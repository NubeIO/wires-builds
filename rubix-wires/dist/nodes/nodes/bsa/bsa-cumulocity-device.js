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
const axios_1 = require("axios");
const container_1 = require("../../container");
const node_1 = require("../../node");
const node_io_1 = require("../../node-io");
const bsa_client_config_1 = require("./bsa-client-config");
const system_utils_1 = require("../system/system-utils");
class BSACumulocityDeviceNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Create BSA Cumulocity Device';
        this.description = '';
        this.addInput('createDevice', node_io_1.Type.BOOLEAN);
        this.addOutput('id', node_io_1.Type.NUMBER);
        this.addOutput('message', node_io_1.Type.STRING);
        this.settings['CumulocityDeviceName'] = {
            description: 'Cumulocity Device Name',
            value: '',
            type: node_1.SettingType.STRING,
        };
    }
    onAdded() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onAfterSettingsChange();
        });
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            if (this.getInputData(0) && this.inputs[0].updated) {
                if (this.outputs[0].data && this.outputs[0].data.length == 0)
                    yield this.createDevice();
                yield this.checkDeviceExists();
            }
        });
    }
    onAfterSettingsChange() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            yield this.checkDeviceExists();
        });
    }
    getDeviceName() {
        let deviceName = this.settings['CumulocityDeviceName'].value || 'unknownDevice';
        if (!deviceName.startsWith('c8y_'))
            deviceName = 'c8y_' + deviceName;
        return deviceName;
    }
    checkDeviceExists() {
        return __awaiter(this, void 0, void 0, function* () {
            let deviceName = this.getDeviceName();
            let cfg = bsa_client_config_1.bsaClientConfig('device');
            cfg = Object.assign(Object.assign({}, cfg), { method: 'GET', url: `${cfg.url}?query=name+eq+${deviceName}` });
            try {
                const response = yield axios_1.default(cfg);
                const ids = [];
                response.data.managedObjects.forEach(device => {
                    ids.push(Number(device.id));
                });
                this.setOutputData(0, ids);
                this.setOutputData(1, null);
            }
            catch (error) {
                this.setOutputData(1, String(error));
            }
        });
    }
    createDevice() {
        return __awaiter(this, void 0, void 0, function* () {
            let clientIdFromPlat;
            let deviceIdFromPlat;
            try {
                clientIdFromPlat = yield system_utils_1.default.getClientID(this);
            }
            catch (e) {
                clientIdFromPlat = 'unknownClientID';
            }
            try {
                deviceIdFromPlat = yield system_utils_1.default.getDeviceID(this);
            }
            catch (e) {
                deviceIdFromPlat = 'unknownDeviceID';
            }
            let deviceName = this.getDeviceName();
            let cfg = bsa_client_config_1.bsaClientConfig('device');
            cfg = Object.assign(Object.assign({}, cfg), { method: 'POST', data: {
                    name: deviceName,
                    type: 'c8y_nube',
                    deviceid: deviceIdFromPlat,
                    clientid: clientIdFromPlat,
                    c8y_IsDevice: {},
                } });
            try {
                yield axios_1.default(cfg);
            }
            catch (error) {
                this.setOutputData(1, String(error));
            }
        });
    }
}
container_1.Container.registerNodeType('bsa/bsa-cumulocity-device', BSACumulocityDeviceNode);
//# sourceMappingURL=bsa-cumulocity-device.js.map