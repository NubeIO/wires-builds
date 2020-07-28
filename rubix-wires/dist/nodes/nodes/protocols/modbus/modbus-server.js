"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
let ModbusRTU = require('modbus-serial');
class ModbusServerNode extends node_1.Node {
    constructor() {
        super();
        this.tcpServer = null;
        this.title = 'Modbus Server';
        this.description =
            `## Description\n ` +
                ` This node is used to create a modbus server.\n ` +
                ` Once the Port and Modbus Address settings are configured, when enabled, this node will create a Local Modbus TCP/IP Server.  The points on this created Modbus Server can be written to and read from with other Modbus Nodes, or from another device.\n ` +
                `   \n ` +
                `## Point Address\n ` +
                `   \n ` +
                `### Coils\n ` +
                `   \n ` +
                ` Valid Coil range is between 0 and 10001. This will allow any modbus client to read and write to those coli ranges\n ` +
                `   \n ` +
                `### Holding Register\n ` +
                `   \n ` +
                ` Valid Holding Register range is between 10001 and 19999. This will allow any modbus client to read and write to those coli ranges\n ` +
                `   \n ` +
                `### Enable\n ` +
                `   \n ` +
                ` This will enable/disable the modbus server \n ` +
                `   \n ` +
                `### Port\n ` +
                `   \n ` +
                ` This is the setting that the modbus server will listen on \n ` +
                `   \n ` +
                `### Modbus address\n ` +
                `   \n ` +
                ` This will set the modbus server modbus address (valid range between 0 and 255) \n ` +
                `   \n `;
        this.addInput('connect', node_1.Type.BOOLEAN);
        this.addOutput('status', node_1.Type.BOOLEAN);
        this.addOutput('error', node_1.Type.STRING);
        this.addOutput('message', node_1.Type.STRING);
        this.settings['serverEnable'] = {
            description: 'Server enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['port'] = { description: 'port', value: 8502, type: node_1.SettingType.NUMBER };
        this.settings['address'] = {
            description: 'Modbus address',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
    }
    onAdded() {
        this.createModbusServer();
    }
    onInputUpdated() {
        this.createModbusServer();
    }
    onAfterSettingsChange() {
        this.createModbusServer();
    }
    onRemoved() {
        this.closeTcpServer();
    }
    createModbusServer() {
        if (this.side !== container_1.Side.server)
            return;
        this.closeTcpServer();
        this.emitResult(false, false, 'close connection');
        if (this.settings['serverEnable'].value) {
            const coils = Buffer.alloc(160008, 0);
            const registers = Buffer.alloc(160008, 0);
            let unitId = this.settings['address'].value;
            unitId = parseInt(unitId);
            const minAddress = 0;
            const maxInputAddress = 10001;
            const maxAddress = 20001;
            const bufferFactor = 8;
            const vector = {
                getCoil: function (addr, unitID) {
                    if (unitID === unitId && addr >= minAddress && addr < maxAddress) {
                        return coils.readUInt8(addr * bufferFactor);
                    }
                },
                getInputRegister: function (addr, unitID) {
                    if (unitID === unitId && addr >= minAddress && addr < maxInputAddress) {
                        return registers.readUInt16BE(addr * bufferFactor);
                    }
                },
                getHoldingRegister: function (addr, unitID) {
                    if (unitID === unitId && addr >= maxInputAddress && addr < maxAddress) {
                        return registers.readUInt16BE(addr * bufferFactor);
                    }
                },
                setCoil: function (addr, value, unitID) {
                    if (unitID === unitId && addr >= minAddress && addr < maxAddress) {
                        coils.writeUInt8(value, addr * bufferFactor);
                    }
                },
                setRegister: function (addr, value, unitID) {
                    if (unitID === unitId && addr >= minAddress && addr < maxAddress) {
                        registers.writeUInt16BE(value, addr * bufferFactor);
                    }
                },
                readDeviceIdentification: function (unitID) {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve({
                                0x00: 'Nube-IO',
                                0x01: 'wires-server',
                                0x02: '1',
                                0x05: 'wires-server',
                            });
                        }, 10);
                    });
                },
            };
            var net = require('net');
            var server = net.createServer();
            let port = this.settings['port'].value;
            let salveAddress = this.settings['address'].value;
            if (port.toString().length >= 3) {
                server.once('error', err => {
                    if (err.code === 'EADDRINUSE') {
                        this.emitResult(false, false, 'port in use');
                        server.close();
                    }
                });
                server.once('listening', () => {
                    this.tcpServer = new ModbusRTU.ServerTCP(vector, {
                        host: '0.0.0.0',
                        port: port,
                        debug: true,
                        unitID: parseInt(salveAddress),
                    });
                    this.tcpServer.on('socketError', err => {
                        this.emitResult(false, err, 'server error');
                    });
                    this.tcpServer.on('initialized', () => {
                        this.emitResult(true, false, 'initialized');
                    });
                    server.close();
                });
                server.listen(port);
            }
            else if (port.toString().length < 3) {
                this.emitResult(null, false, 'use a port >= 3');
            }
        }
    }
    closeTcpServer() {
        this.tcpServer &&
            this.tcpServer.close(() => {
                this.emitResult(false, false, 'closed');
            });
    }
    emitResult(out, err, msg) {
        this.setOutputData(0, out);
        this.setOutputData(1, err);
        this.setOutputData(2, msg);
    }
}
container_1.Container.registerNodeType('protocols/modbus/modbus-server', ModbusServerNode);
//# sourceMappingURL=modbus-server.js.map