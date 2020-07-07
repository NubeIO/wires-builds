"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
let ModbusRTU = require('modbus-serial');
class ModbusWriteClientNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Modbus Client Write';
        this.description =
            'Modbus-client-write point nodes are used to write modbus values to modbus servers.  Modbus details are configured in settings.  Math functions can be configured to be performed on the input value before being sent.';
        this.addInput('input', node_1.Type.NUMBER);
        this.addOutput('address', node_1.Type.STRING);
        this.addOutput('out bytes', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
        this.settings['ip'] = { description: 'ip', value: '0.0.0.0', type: node_1.SettingType.STRING };
        this.settings['port'] = { description: 'port', value: 8502, type: node_1.SettingType.NUMBER };
        this.settings['slaveAddress'] = {
            description: 'Modbus Salve address',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['address'] = {
            description: 'Modbus address',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['operation'] = {
            description: 'Output type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'FC 5: Write Single Coil' },
                    { value: 1, text: 'FC 6: Write Single Holding Register' },
                ],
            },
            value: 0,
        };
        this.settings['math-function'] = {
            description: 'Apply an optional math function',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'null' },
                    { value: 1, text: 'multiply' },
                    { value: 2, text: 'divide' },
                    { value: 3, text: 'add' },
                    { value: 4, text: 'subtract' },
                ],
            },
            value: 0,
        };
        this.settings['math-value'] = {
            description: 'Apply an optional math value',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
    }
    onCreated() { }
    onAdded() { }
    emitResult(out, arr, err) {
        this.setOutputData(0, out);
        this.setOutputData(1, arr);
        this.setOutputData(2, err);
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        let client = new ModbusRTU();
        let ip = this.settings['ip'].value;
        const port = this.settings['port'].value;
        const slaveAddress = this.settings['slaveAddress'].value;
        const address = this.settings['address'].value;
        var networkErrors = [
            'ESOCKETTIMEDOUT',
            'ETIMEDOUT',
            'ECONNRESET',
            'ECONNREFUSED',
            'EHOSTUNREACH',
        ];
        let write = (operation, address, dataIn) => {
            if (operation == 0) {
                client
                    .writeCoil(address, dataIn)
                    .then(d => {
                    this.emitResult(d.address, d, null);
                })
                    .catch(e => {
                    this.emitResult(null, null, e.message);
                });
            }
            else if (operation == 1) {
                client
                    .writeRegisters(address, [dataIn])
                    .then(d => {
                    this.emitResult(d.address, d, null);
                })
                    .catch(e => {
                    this.emitResult(null, null, e.message);
                });
            }
            else if (operation == 2) {
                client
                    .writeUInt16BE(address, dataIn)
                    .then(d => {
                    this.emitResult(d.address, d, null);
                })
                    .catch(e => {
                    this.emitResult(null, null, e.message);
                });
            }
        };
        let setClient = () => {
            let input = parseFloat(this.getInputData(0));
            const mathFunction = this.settings['math-function'].value;
            const mathValue = parseFloat(this.settings['math-value'].value);
            let dataIn = null;
            if (mathFunction == 0) {
                dataIn = input;
            }
            else if (mathFunction == 1) {
                dataIn = input * mathValue;
            }
            else if (mathFunction == 2) {
                dataIn = input / mathValue;
            }
            else if (mathFunction == 3) {
                dataIn = input + mathValue;
            }
            else if (mathFunction == 4) {
                dataIn = input - mathValue;
            }
            const operation = this.settings['operation'].value;
            client.setID(parseInt(slaveAddress));
            client.setTimeout(1000);
            write(operation, address, dataIn);
        };
        client
            .connectTCP(ip, { port: port })
            .then(setClient)
            .then(() => { })
            .catch(e => {
            if (e.errno) {
                if (networkErrors.includes(e.errno)) {
                }
            }
        });
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('protocols/modbus/modbus-client-write', ModbusWriteClientNode);
//# sourceMappingURL=modbus-client-write.js.map