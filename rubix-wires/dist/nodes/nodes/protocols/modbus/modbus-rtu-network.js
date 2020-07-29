"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_node_1 = require("../../../container-node");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const modbus_functions_1 = require("./modbus-functions");
const modbus_point_methods_1 = require("./modbus-fc/modbus-point-methods");
const constants_1 = require("../../../constants");
const utils_1 = require("../../../utils");
const registry_1 = require("../../../registry");
const SerialPort = require('serialport');
const ModbusRTU = require('modbus-serial');
var Poll;
(function (Poll) {
    Poll[Poll["DO_NOT_INIT"] = 0] = "DO_NOT_INIT";
    Poll[Poll["FIRST_START"] = 1] = "FIRST_START";
    Poll[Poll["STOP"] = 2] = "STOP";
})(Poll || (Poll = {}));
class ModbusSerialNetworkNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.rs485DeviceName = 'ttyUSB1';
        this.isPortOk = false;
        this.isPortInUse = false;
        this.serialPortStatus = false;
        this.pollEnableSetting = false;
        this.client = null;
        this.outStatus = 0;
        this.outError = 1;
        this.outPortStatus = 2;
        this.outPortMsg = 3;
        this.outMessageJson = 4;
        this.title = 'Modbus 485 Network';
        this.description =
            `## Description\n ` +
                ` This node is used as a modbus TCP or RTU(rs485) modbus network.\n ` +
                ` The device and points for the device will be added inside this node (right click and **open** on the network node to add the device and points) \n ` +
                `   \n ` +
                `### Enable\n ` +
                `   \n ` +
                ` This will enable/disable the network from polling \n ` +
                `   \n `;
        this.addOutput('status', node_1.Type.BOOLEAN);
        this.addOutput('error', node_1.Type.STRING);
        this.addOutput('port status', node_1.Type.STRING);
        this.addOutput('port messages', node_1.Type.STRING);
        this.addOutput('message', node_1.Type.STRING);
        this.settings['networkEnable'] = {
            description: 'Network enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['devicePolling'] = {
            description: 'Polling time setting in ms',
            value: 2000,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['registerDelay'] = {
            description: 'Polling delay between each register in ms',
            value: 30,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['transport'] = {
            description: 'TCP or RTU/RS485',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'rtu', text: 'Modbus RTU over Serial 485' },
                    { value: 'tcp', text: 'Modbus TCP/IP' },
                ],
            },
            value: 'rtu',
        };
        this.setSettingsConfig({
            groups: [
                { port: {}, baudRate: {} },
                { parity: {}, dataBits: {}, stopBits: {} },
                { devicePolling: {}, registerDelay: {} },
            ],
            conditions: {
                port: setting => {
                    return setting['transport'].value === 'rtu';
                },
                baudRate: setting => {
                    return setting['transport'].value === 'rtu';
                },
                parity: setting => {
                    return setting['transport'].value === 'rtu';
                },
                dataBits: setting => {
                    return setting['transport'].value === 'rtu';
                },
                stopBits: setting => {
                    return setting['transport'].value === 'rtu';
                },
            },
        });
        this.settings['port'] = {
            description: 'port',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: '/dev/ttyUSB0', text: 'ttyUSB0' },
                    { value: '/dev/ttyUSB1', text: 'ttyUSB1' },
                    { value: '/dev/ttyUSB2', text: 'ttyUSB2' },
                    { value: '/dev/ttyUSB3', text: 'ttyUSB3' },
                    { value: '/dev/ttyUSB4', text: 'ttyUSB4' },
                ],
            },
            value: '/dev/ttyUSB0',
        };
        this.settings['baudRate'] = {
            description: 'Baud Rate',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 115200, text: '115200' },
                    { value: 57600, text: '57600' },
                    { value: 38400, text: '38400' },
                    { value: 19200, text: '19200' },
                    { value: 9600, text: '9600' },
                ],
            },
            value: 9600,
        };
        this.settings['parity'] = {
            description: 'Parity',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'none', text: 'none' },
                    { value: 'even', text: 'even' },
                    { value: 'mark', text: 'mark' },
                    { value: 'odd', text: 'odd' },
                    { value: 'space', text: 'space' },
                ],
            },
            value: 'none',
        };
        this.settings['dataBits'] = {
            description: 'Data Bits',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 8, text: '8' },
                    { value: 7, text: '7' },
                    { value: 6, text: '6' },
                    { value: 5, text: '5' },
                ],
            },
            value: 8,
        };
        this.settings['stopBits'] = {
            description: 'Stop Bits',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 2, text: '2' },
                    { value: 1.5, text: '1.5' },
                    { value: 1, text: '1' },
                ],
            },
            value: 1,
        };
    }
    static getDevicesPoints(sub_container, container_db) {
        return __awaiter(this, void 0, void 0, function* () {
            let devicesPoints = [];
            let devices = yield modbus_functions_1.default.getDevice(constants_1.MODBUS_RTU_DEVICE, sub_container, container_db);
            for (let device of devices) {
                let points = yield modbus_functions_1.default.getPoints(constants_1.MODBUS_RTU_POINT, device, container_db);
                devicesPoints.push(points);
            }
            return devicesPoints;
        });
    }
    onAdded() {
        const _super = Object.create(null, {
            onAdded: { get: () => super.onAdded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onAdded.call(this);
            let nodeDetailsMessage = {
                nodeId: this.id,
                cid: this.container.id,
                sub_id: this.sub_container.id,
            };
            this.setOutputData(this.outMessageJson, nodeDetailsMessage);
            yield this.setupForPolling();
        });
    }
    onCreated() {
        super.onCreated();
        if (this.side !== container_1.Side.server)
            return;
    }
    onRemoved() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.polling(Poll.STOP);
            if (this.client) {
                this.client.close(() => { });
            }
            for (let id in this.sub_container._nodes) {
                let node = this.sub_container._nodes[id];
                node.container.remove(node);
            }
            delete container_1.Container.containers[this.sub_container.id];
        });
    }
    onAfterSettingsChange(oldSettings) {
        const _super = Object.create(null, {
            onAfterSettingsChange: { get: () => super.onAfterSettingsChange }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onAfterSettingsChange.call(this, oldSettings);
            this.persistSettings();
            yield this.setupForPolling();
        });
    }
    checkRS485Device() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkPort = new SerialPort(this.port, { baudRate: this.baudRate, autoOpen: false });
            yield this.checkPort.on('open', () => {
                this.debugInfo('Port connected');
                this.setOutputData(this.outPortMsg, `INFO: port is ok!`);
                this.isPortOk = true;
                this.closePort();
            });
            this.checkPort.on('error', err => {
                this.checkPort = null;
                this.debugErr(err.message);
                this.setOutputData(this.outPortMsg, `ERROR! this port: ${this.port.substring(5)} is in use`);
                this.isPortOk = false;
            });
            this.checkPort.open();
            yield utils_1.default.sleep(10000);
            return this.isPortOk;
        });
    }
    closePort() {
        if (this.checkPort) {
            this.checkPort.close();
        }
        this.checkPort = null;
    }
    polling(poll) {
        return __awaiter(this, void 0, void 0, function* () {
            this.poll = poll;
            if (this.side !== container_1.Side.server)
                return;
            if (this.poll === Poll.STOP) {
                this.setOutputData(this.outPortMsg, 'INFO: closed port connection');
                if (this.client)
                    this.client.close(() => { });
                return;
            }
            if (this.transport === 'rtu') {
                if (this.client)
                    this.client.close(() => { });
                try {
                    this.client = new ModbusRTU();
                    this.client.setTimeout(500);
                    setTimeout(() => {
                        this.client.connectRTUBuffered(this.port, {
                            baudRate: this.baudRate,
                            parity: this.parity,
                            dataBits: this.dataBits,
                            stopBits: this.stopBits,
                        });
                        this.setOutputData(this.outPortMsg, `INFO: will start RS485 polling`);
                    }, 500);
                }
                catch (error) {
                }
            }
            else {
                this.client = new ModbusRTU();
                this.setOutputData(this.outPortMsg, `INFO: will start TCP polling`);
            }
            if (this.poll === Poll.FIRST_START) {
                yield this.pollDevicesPoints();
            }
        });
    }
    pollDevicesPoints() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.poll === Poll.STOP)
                return;
            const devices = yield ModbusSerialNetworkNode.getDevicesPoints(this.sub_container.id, this.container.db);
            let errorOnModbusDevicesExec = false;
            for (let device of devices) {
                let { deviceCID, deviceID, deviceAddress, ipAddress, ipPort, deviceAddressOffset } = device.deviceObj;
                const deviceNode = registry_1.default._nodes[registry_1.default.getId(deviceCID, deviceID)];
                if (!deviceNode)
                    return;
                let points = device.points;
                if (this.transport === 'tcp') {
                    try {
                        this.client.connectTCP(ipAddress, { port: ipPort });
                    }
                    catch (e) {
                        errorOnModbusDevicesExec = true;
                        modbus_functions_1.default.sendDeviceError(deviceNode, e);
                        this.setOutputData(this.outError, e);
                        continue;
                    }
                }
                let errorOnModbusPointsExec = false;
                for (let point of points) {
                    const { pntAddr, pntType, pntOffset, pntVal, pntCid, pntId, pntDataType, pntDataEndian } = point;
                    yield utils_1.default.sleep(this.registerDelay || 50);
                    const pointNode = registry_1.default._nodes[registry_1.default.getId(pntCid, pntId)];
                    if (!pointNode)
                        return;
                    try {
                        const response = yield modbus_point_methods_1.default.modbusMethods(this.client, deviceAddress, pntType, pntAddr, pntOffset, pntVal, pntDataType, pntDataEndian, deviceAddressOffset);
                        modbus_functions_1.default.sendPointMessage(pointNode, response);
                        modbus_functions_1.default.sendPointError(pointNode, null);
                    }
                    catch (e) {
                        errorOnModbusDevicesExec = true;
                        this.setOutputData(this.outError, e);
                        modbus_functions_1.default.sendDeviceError(deviceNode, e);
                        modbus_functions_1.default.sendPointError(pointNode, e);
                    }
                }
                if (!errorOnModbusDevicesExec)
                    modbus_functions_1.default.sendDeviceError(deviceNode, null);
                errorOnModbusDevicesExec = errorOnModbusDevicesExec || errorOnModbusPointsExec;
            }
            if (!errorOnModbusDevicesExec)
                this.setOutputData(this.outError, null);
            yield utils_1.default.sleep(this.devicePolling || 2000);
            yield this.pollDevicesPoints();
        });
    }
    setupForPolling() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            this.networkEnable = this.settings['networkEnable'].value;
            this.port = this.settings['port'].value;
            this.baudRate = this.settings['baudRate'].value;
            this.parity = this.settings['parity'].value;
            this.dataBits = this.settings['dataBits'].value;
            this.stopBits = this.settings['stopBits'].value;
            this.devicePolling = this.settings['devicePolling'].value;
            this.registerDelay = this.settings['registerDelay'].value;
            this.transport = this.settings['transport'].value;
            if (this.networkEnable) {
                if (!this.pollEnableSetting) {
                    this.pollEnableSetting = true;
                    yield this.polling(Poll.FIRST_START);
                }
                else {
                    yield this.polling(Poll.DO_NOT_INIT);
                }
            }
            else {
                this.pollEnableSetting = false;
                yield this.polling(Poll.STOP);
            }
        });
    }
    persistSettings() {
        if (!this.container.db)
            return;
        this.container.db.updateNode(this.id, this.container.id, {
            $set: {
                settings: this.settings,
                properties: this.properties,
            },
        });
    }
}
container_1.Container.registerNodeType(constants_1.MODBUS_RTU_NETWORK, ModbusSerialNetworkNode);
//# sourceMappingURL=modbus-rtu-network.js.map