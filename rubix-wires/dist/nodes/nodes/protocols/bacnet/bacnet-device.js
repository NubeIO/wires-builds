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
const Bacnet = require("node-bacnet");
const bacnet_utils_1 = require("./bacnet-utils");
const constants_1 = require("../../../constants");
const container_1 = require("../../../container");
const container_node_1 = require("../../../container-node");
const node_1 = require("../../../node");
const utils_1 = require("../../../utils");
const bacnet_constant_1 = require("./bacnet-constant");
var Poll;
(function (Poll) {
    Poll[Poll["STOP"] = 0] = "STOP";
    Poll[Poll["START"] = 1] = "START";
})(Poll || (Poll = {}));
class BACnetDevice extends container_node_1.ContainerNode {
    constructor(ContainerNode) {
        super(ContainerNode);
        this.bacnetClient = null;
        this.networkSettings = {};
        this.points = [];
        this.pointNodes = [];
        this.isFirst = true;
        this.isPolling = false;
        this.shouldPoll = true;
        this.delayBetweenDevice = 100;
        this.delayBetweenPoint = 30;
        this.networkNumber = null;
        this.title = 'BACnet Device';
        this.description =
            'This node acts as a container for bacnet-point nodes. All bacnet-device nodes should be added within the bacnet-network container.  All bacnet-point nodes should be added within a bacnet-device container node.  Configuration of BACnet device connections are set from settings.  Both IP and MSTP BACnet devices can be configured from the bacnet-device settings.';
        this.addInput('get-point-list', node_1.Type.BOOLEAN);
        this.addOutput('out', node_1.Type.STRING);
        this.addOutput('out msg', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
        this.addOutput('points-discovered', node_1.Type.STRING);
        this.addOutput('points-to-poll', node_1.Type.STRING);
        this.properties['pointsList'] = null;
        this.settings['deviceEnable'] = {
            description: 'Device enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['ip'] = { description: 'ip', value: '192.168.13.13', type: node_1.SettingType.STRING };
        this.settings['deviceId'] = { description: 'deviceId', value: 2508, type: node_1.SettingType.NUMBER };
        this.settings['port'] = { description: 'port', value: 47808, type: node_1.SettingType.NUMBER };
        this.settings['deviceTypeMstp'] = {
            description: 'BACnet MS/TP device',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['macAddress'] = {
            description: 'BACnet Mac address',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['networkNumber'] = {
            description: 'BACnet network number ',
            type: node_1.SettingType.READONLY,
        };
    }
    onAdded() {
        const _super = Object.create(null, {
            onAdded: { get: () => super.onAdded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onAdded.call(this);
            this.name = `BACnet Device: cid_${this.container.id.toString()}_sid_${this.sub_container.id.toString()}_id${this.id.toString()}`;
            yield utils_1.default.sleep(1000);
            this.setBacnetClient();
            this.setPayloadsToPointNodes();
            if (this.side !== container_1.Side.server)
                return;
            bacnet_utils_1.default.addDevice(this.getParentNode(), this);
            this.updateNetworkSettings();
            yield this.requestPoll();
        });
    }
    onAfterSettingsChange(oldSettings) {
        super.onAfterSettingsChange(oldSettings);
        this.setPayloadsToPointNodes();
        this.requestPoll().then();
    }
    onRemoved() {
        super.onRemoved();
        this.shouldPoll = false;
        bacnet_utils_1.default.removeDevice(this.getParentNode(), this);
    }
    updateNetworkSettings() {
        if (this.side !== container_1.Side.server)
            return;
        this.networkSettings = bacnet_utils_1.default.getNetworkSettings(this.getParentNode());
        this.networkNumber = this.networkSettings.networkNumber.value;
        this.settings['networkNumber'].value = this.networkNumber;
        this.broadcastSettingsToClients();
        this.persistSettings();
    }
    onInputUpdated() {
        let pntList = [];
        for (let pointNode of this.pointNodes) {
            const settings = pointNode.settings;
            const id = pointNode.id;
            const cid = pointNode.id;
            const name = pointNode.name;
            let a = {
                id: id,
                cid: cid,
                name: name,
                settings: settings,
            };
            pntList.push(a);
        }
        this.setOutputData(4, JSON.stringify(pntList));
        this.setOutputData(3, JSON.stringify(this.points));
    }
    requestPoll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentPollValue() === Poll.START && !this.isPolling) {
                this.isPolling = true;
                yield this.polling();
            }
        });
    }
    currentPollValue() {
        return this.settings['deviceEnable'].value && this.networkSettings['networkEnable'].value ? Poll.START : Poll.STOP;
    }
    setPayloadsToPointNodes() {
        if (this.side !== container_1.Side.server)
            return;
        this.setOutputData(this.outputMsg, `INFO: Scan devices`);
        bacnet_utils_1.singleton
            .process(() => this.scanDeviceFunc())
            .then(points => {
            this.points = points;
            this.sendPayloadToPointNodesFunc();
        });
        bacnet_utils_1.singleton.process(() => __awaiter(this, void 0, void 0, function* () { return yield utils_1.default.sleep(this.delayBetweenDevice); })).then();
    }
    sendPayloadToPointNodesFunc() {
        for (let pointNode of this.pointNodes) {
            bacnet_utils_1.default.sendPayloadToChild(pointNode, {
                points: this.points,
                networkSettings: this.networkSettings,
            });
        }
    }
    setBacnetClient() {
        if (this.side !== container_1.Side.server)
            return;
        this.bacnetClient = bacnet_utils_1.default.getBacnetClient(this.getParentNode());
    }
    writePresentValue(deviceAddress, type, instance, value, priority) {
        if (!this.bacnetClient)
            return;
        if (this.settings['deviceTypeMstp'].value) {
            this.bacnetClient.writeProperty({
                address: deviceAddress,
                net: this.networkNumber,
                adr: [this.settings['macAddress'].value],
            }, { type: type, instance: instance }, 85, [{ type: Bacnet.enum.ApplicationTags.REAL, value: value }], { priority: priority }, (err, value) => {
                console.log(err, value);
            });
        }
        else {
            this.bacnetClient.writeProperty(deviceAddress, { type: type, instance: instance }, 85, [{ type: Bacnet.enum.ApplicationTags.REAL, value: value }], { priority: priority }, (err, value) => { });
        }
    }
    readObjectList(deviceAddress, deviceId, callback) {
        const requestArray = [
            {
                objectId: { type: Bacnet.enum.ObjectType.DEVICE, instance: deviceId },
                properties: [{ id: Bacnet.enum.PropertyIdentifier.OBJECT_LIST }],
            },
        ];
        if (!this.bacnetClient)
            return;
        if (this.settings['deviceTypeMstp'].value) {
            this.bacnetClient.readPropertyMultiple({
                address: deviceAddress,
                net: this.networkNumber,
                adr: [this.settings['macAddress'].value],
            }, requestArray, requestArray, callback);
        }
        else
            this.bacnetClient.readPropertyMultiple(deviceAddress, requestArray, callback);
    }
    readObjectFull(deviceAddress, type) {
        return this.readObject(deviceAddress, type, [
            { id: Bacnet.enum.PropertyIdentifier.OBJECT_IDENTIFIER },
            { id: Bacnet.enum.PropertyIdentifier.OBJECT_NAME },
            { id: Bacnet.enum.PropertyIdentifier.OBJECT_TYPE },
            { id: Bacnet.enum.PropertyIdentifier.DESCRIPTION },
            { id: Bacnet.enum.PropertyIdentifier.UNITS },
            { id: Bacnet.enum.PropertyIdentifier.PRESENT_VALUE },
        ]);
    }
    readObject(deviceAddress, obj, properties) {
        return new Promise(resolve => {
            const requestArray = [
                {
                    objectId: { type: obj.type, instance: obj.instance },
                    properties: properties,
                },
            ];
            if (!this.bacnetClient)
                return;
            if (this.settings['deviceTypeMstp'].value) {
                this.bacnetClient.readPropertyMultiple({
                    address: deviceAddress,
                    net: this.networkNumber,
                    adr: [this.settings['macAddress'].value],
                }, requestArray, (error, value) => {
                    resolve({
                        error: error,
                        value: value,
                    });
                });
            }
            else {
                this.bacnetClient.readPropertyMultiple(deviceAddress, requestArray, (error, value) => {
                    resolve({
                        error: error,
                        value: value,
                    });
                });
            }
        });
    }
    readProperty(deviceAddress, obj) {
        return new Promise(resolve => {
            if (this.settings['deviceTypeMstp'].value) {
                this.bacnetClient.readProperty({
                    address: deviceAddress,
                    net: this.networkNumber,
                    adr: [this.settings['macAddress'].value],
                }, { type: obj.type, instance: obj.instance }, Bacnet.enum.PropertyIdentifier.PRESENT_VALUE, (error, value) => {
                    resolve({
                        error: error,
                        value: value,
                    });
                });
            }
            else {
                this.bacnetClient.readProperty(deviceAddress, { type: obj.type, instance: obj.instance }, Bacnet.enum.PropertyIdentifier.PRESENT_VALUE, (error, value) => {
                    resolve({
                        error: error,
                        value: value,
                    });
                });
            }
        });
    }
    readPresentValue(obj) {
        return this.readProperty(this.settings['ip'].value, obj);
    }
    findValueById(properties, id) {
        const property = properties.find(function (element) {
            return element.id === id;
        });
        if (property && property.value && property.value.length > 0) {
            if (property.value[0].value.errorClass) {
                return null;
            }
            return property.value[0].value;
        }
        else {
            return null;
        }
    }
    mapToDeviceObject(object) {
        if (!object || !object.values) {
            return null;
        }
        const objectInfo = object.values[0].objectId.instance;
        const objectProperties = object.values[0].values;
        const name = this.findValueById(objectProperties, Bacnet.enum.PropertyIdentifier.OBJECT_NAME);
        const description = this.findValueById(objectProperties, Bacnet.enum.PropertyIdentifier.DESCRIPTION);
        const type = this.findValueById(objectProperties, Bacnet.enum.PropertyIdentifier.OBJECT_TYPE);
        const units = this.findValueById(objectProperties, Bacnet.enum.PropertyIdentifier.UNITS);
        const presentValue = this.findValueById(objectProperties, Bacnet.enum.PropertyIdentifier.PRESENT_VALUE);
        return { objectInfo, name, description, type, units, presentValue };
    }
    scanDeviceFunc() {
        return __awaiter(this, void 0, void 0, function* () {
            const device = {
                deviceId: this.settings['deviceId'].value,
                address: this.settings['ip'].value,
            };
            this.setOutputData(1, `INFO: Scan device ID: ${device}`);
            this.setOutputData(2, ``);
            return new Promise((resolve, reject) => {
                this.readObjectList(device.address, device.deviceId, (err, result) => __awaiter(this, void 0, void 0, function* () {
                    if (!err) {
                        const objectArray = result.values[0].values[0].value;
                        this.setOutputData(1, `INFO: Scan device ID: ${device}`);
                        this.setOutputData(2, ``);
                        const outputs = [];
                        for (const object of objectArray) {
                            try {
                                const output = yield this.readObjectFull(device.address, {
                                    type: object.value.type,
                                    instance: object.value.instance,
                                });
                                outputs.push(output);
                            }
                            catch (error) {
                                this.setOutputData(1, ``);
                                this.setOutputData(2, `ERROR: while fetching objects: ${JSON.stringify(error)}`);
                                reject(error);
                            }
                            yield utils_1.default.sleep(this.delayBetweenDevice);
                        }
                        const successfulResults = outputs.filter(element => !element.error);
                        const deviceObjects = successfulResults.map(element => {
                            return this.mapToDeviceObject(element.value);
                        });
                        resolve(deviceObjects);
                    }
                    else {
                        this.setOutputData(1, ``);
                        this.setOutputData(2, `ERROR: while fetching objects: ${JSON.stringify(err)}`);
                        reject(err);
                    }
                }));
            });
        });
    }
    subscribe({ action, payload }) {
        switch (action) {
            case bacnet_constant_1.ADD_POINT:
                this.pointNodes.push(payload);
                break;
            case bacnet_constant_1.REMOVE_POINT:
                this.pointNodes = this.pointNodes.filter(pointNode => pointNode.id !== payload.id);
                break;
            case bacnet_constant_1.GET_NETWORK_SETTINGS:
                return bacnet_utils_1.default.getNetworkSettings(this.getParentNode());
            case bacnet_constant_1.GET_POINTS:
                return this.points;
            case bacnet_constant_1.GET_PRESENT_VALUE:
                return this.readPresentValue(payload);
            case bacnet_constant_1.SEND_PAYLOAD_TO_CHILD:
                this.bacnetClient = payload.bacnetClient;
                this.networkSettings = payload.networkSettings;
                this.updateNetworkSettings();
                if (!this.isFirst) {
                    this.setPayloadsToPointNodes();
                }
                this.isFirst = false;
                this.requestPoll().then();
                break;
            case bacnet_constant_1.WRITE_PRESENT_VALUE:
                this.writePresentValue(this.settings['ip'].value, payload[0], payload[1], payload[2], payload[3]);
                break;
            default:
                this.debugWarn("Request action doesn't match");
        }
    }
    emitResult(id, out) {
        this.setOutputData(id, out);
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
    polling() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentPollValue() !== Poll.START || !this.shouldPoll) {
                this.isPolling = false;
                return;
            }
            yield bacnet_utils_1.singleton.process(() => this.pollingFunc());
            yield bacnet_utils_1.singleton.process(() => __awaiter(this, void 0, void 0, function* () { return yield utils_1.default.sleep(this.delayBetweenDevice); }));
            yield utils_1.default.sleep(this.networkSettings['devicePolling'].value);
            yield this.polling();
        });
    }
    pollingFunc() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let pointNode of this.pointNodes) {
                let selectPoint = pointNode.settings['pointsList'].value;
                const manualPoint = pointNode.settings['manualPoint'].value;
                const objectType = pointNode.settings['objectType'].value;
                const objectInstance = pointNode.settings['objectInstance'].value;
                if (manualPoint) {
                    selectPoint = { type: objectType, instance: objectInstance };
                }
                if (selectPoint) {
                    const value = yield this.readPresentValue(selectPoint);
                    bacnet_utils_1.default.sendPointValue(pointNode, value);
                    yield utils_1.default.sleep(this.delayBetweenPoint);
                }
            }
        });
    }
}
container_1.Container.registerNodeType(constants_1.BACNET_DEVICE, BACnetDevice, constants_1.BACNET_NETWORK);
//# sourceMappingURL=bacnet-device.js.map