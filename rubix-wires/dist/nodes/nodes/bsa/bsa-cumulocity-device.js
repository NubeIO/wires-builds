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
const bsa_client_config_1 = require("./bsa-client-config");
let moment = require('moment-timezone');
class BSACumulocityDeviceNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Create BSA Cumulocity Device';
        this.description = '';
        this.addInput('createDevice', node_1.Type.BOOLEAN);
        this.addOutput('id', node_1.Type.NUMBER);
        this.addOutput('message', node_1.Type.STRING);
        this.settings['CumulocityDeviceName'] = {
            description: 'Cumulocity Device Name',
            value: '',
            type: node_1.SettingType.STRING,
        };
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            if (this.getInputData(0) && this.inputs[0].updated) {
                yield this.checkDeviceExists(this);
                if (this.outputs[0].data && this.outputs[0].data.length == 0)
                    yield this.createDevice(this);
                yield this.checkDeviceExists(this);
            }
        });
    }
    onAfterSettingsChange() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkDeviceExists(this);
        });
    }
    checkDeviceExists(self) {
        return __awaiter(this, void 0, void 0, function* () {
            var deviceName = self.settings['CumulocityDeviceName'].value || 'unknownDevice';
            if (!deviceName.startsWith('c8y_'))
                deviceName = 'c8y_' + deviceName;
            var ids = [];
            let cfg = bsa_client_config_1.bsaClientConfig('device');
            cfg['method'] = 'get';
            cfg['params'] = { query: `name+eq+${deviceName}` };
            axios_1.default(cfg)
                .then(function (response) {
                response.data.managedObjects.forEach(device => {
                    ids.push(Number(device.id));
                });
                self.setOutputData(0, ids);
            })
                .catch(function (error) {
                self.setOutputData(1, String(error));
            });
        });
    }
    createDevice(self) {
        return __awaiter(this, void 0, void 0, function* () {
            var errorFlag = false;
            const clientIDfromPlat = yield this.getClientID();
            const deviceIDfromPlat = yield this.getDeviceID();
            let foundDeviceID = false;
            let foundClientID = false;
            typeof deviceIDfromPlat == 'string' ? (foundDeviceID = true) : null;
            typeof clientIDfromPlat == 'string' ? (foundClientID = true) : null;
            var deviceName = self.settings['CumulocityDeviceName'].value || 'c8y_unknownDevice';
            if (!deviceName.startsWith('c8y_'))
                deviceName = 'c8y_' + deviceName;
            let cfg = bsa_client_config_1.bsaClientConfig('device');
            cfg['method'] = 'post';
            cfg['data'] = {
                name: deviceName,
                type: 'c8y_nube',
                deviceid: foundDeviceID ? deviceIDfromPlat : 'c8y_unknownDeviceID',
                clientid: foundClientID ? clientIDfromPlat : 'c8y_unknownClientID',
                c8y_IsDevice: {},
            };
            axios_1.default(cfg)
                .then(function (response) {
            })
                .catch(function (error) {
                self.setOutputData(this.histErrorOutput, String(error));
                errorFlag = true;
            });
        });
    }
    persistProperties() {
        if (!this.container.db)
            return;
        this.container.db.updateNode(this.id, this.container.id, {
            $set: {
                properties: this.properties,
                inputs: this.inputs,
                settings: this.settings,
            },
        });
    }
    getDeviceID() {
        return new Promise((resolve, reject) => {
            try {
                this.findMainContainer(this).db.getNodeType('system/platform', (err, docs) => {
                    if (!err) {
                        let output = [];
                        output.push(docs);
                        if (output[0] && output[0][0] && output[0][0].properties) {
                            resolve(output[0][0].properties['deviceID'].trim());
                            return output[0][0].properties['deviceID'].trim();
                        }
                        else {
                        }
                        resolve(output);
                        return output;
                    }
                    else {
                        console.log(err);
                        reject(err);
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getClientID() {
        return new Promise((resolve, reject) => {
            try {
                this.findMainContainer(this).db.getNodeType('system/platform', (err, docs) => {
                    if (!err) {
                        let output = [];
                        output.push(docs);
                        if (output[0] && output[0][0] && output[0][0].settings) {
                            resolve(output[0][0].settings['clientID'].value.trim());
                            return output[0][0].settings['clientID'].value.trim();
                        }
                        else {
                        }
                        resolve(output);
                        return output;
                    }
                    else {
                        console.log(err);
                        reject(err);
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findMainContainer(search) {
        if (search.hasOwnProperty('container')) {
            return this.findMainContainer(search['container']);
        }
        else {
            return search;
        }
    }
}
container_1.Container.registerNodeType('bsa/bsa-cumulocity-device', BSACumulocityDeviceNode);
//# sourceMappingURL=bsa-cumulocity-device.js.map