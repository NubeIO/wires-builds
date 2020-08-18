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
const node_1 = require("../../node");
const container_node_1 = require("../../container-node");
const container_1 = require("../../container");
const os_utils_1 = require("../../utils/os-utils");
const file_utils_1 = require("../../utils/file-utils");
const uuid_utils_1 = require("../../utils/uuid-utils");
const config_1 = require("../../../config");
class PlatNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.haystackSite = {
            id: { description: 'enter site id', value: 'My ID', type: node_1.SettingType.STRING },
        };
        this.haystackAbout = {
            serverName: os_utils_1.default.hostName(),
            productVersion: os_utils_1.default.getCurrentWiresVersion(),
        };
        this.globalSettings = {
            units: ['metric, imperial'],
            vendorName: 'Nube IO',
        };
        this.title = 'Platform';
        this.description =
            'This node provides global settings for the Wires instance. It should be added to the main(root) Editor Pane of each Wires instance. ‘Client ID’ and ‘Device ID’ are used by each node with a history logging configuration to store data.';
        this.addInputWithSettings('client-id', node_1.Type.STRING, 'client abc', 'Client ID/Name', false);
        this.addInputWithSettings('site-id', node_1.Type.STRING, 'site 123', 'Site/Building ID/Name', false);
        this.addOutput('device-id', node_1.Type.STRING);
        this.addOutput('client-id', node_1.Type.STRING);
        this.addOutput('site-id', node_1.Type.STRING);
        this.addOutput('wires-version', node_1.Type.STRING);
        this.addOutput('output-json', node_1.Type.JSON);
        this.settings['deviceIdType'] = {
            description: 'Device ID Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: false, text: 'Fixed ID' },
                    { value: true, text: 'Custom ID' },
                ],
            },
            value: false,
        };
        this.settings['deviceIDFixed'] = {
            description: 'Fixed Device ID',
            value: 'unknownDeviceID',
            type: node_1.SettingType.READONLY,
        };
        this.settings['deviceIDcustom'] = {
            description: 'Custom Device ID',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['serverName'] = {
            description: 'serverName',
            value: '',
            type: node_1.SettingType.READONLY,
        };
        this.settings['productVersion'] = {
            description: 'productVersion',
            value: '',
            type: node_1.SettingType.READONLY,
        };
        this.setSettingsConfig({
            groups: [],
            conditions: {
                deviceIDFixed: setting => {
                    return !setting['deviceIdType'].value;
                },
                deviceIDcustom: setting => {
                    return !!setting['deviceIdType'].value;
                },
            },
        });
        this.properties['deviceID'] = {};
    }
    onAdded() {
        const _super = Object.create(null, {
            onAdded: { get: () => super.onAdded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onAdded.call(this);
            yield this.haystackAbout.serverName.then(e => {
                this.settings['serverName'].value = e;
                this.broadcastSettingsToClients();
            });
            yield this.haystackAbout.productVersion.then(e => {
                this.settings['productVersion'].value = e;
                this.broadcastSettingsToClients();
                this.setOutputData(3, e);
            });
            yield this.onAfterSettingsChange(null);
        });
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onAfterSettingsChange(null);
        });
    }
    onAfterSettingsChange(oldSettings) {
        const _super = Object.create(null, {
            onAfterSettingsChange: { get: () => super.onAfterSettingsChange }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onAfterSettingsChange.call(this, oldSettings);
            if (this.side !== container_1.Side.server)
                return;
            yield this.doUUIDSteps();
            this.properties['deviceID'] = this.settings['deviceIdType'].value
                ? this.settings['deviceIDcustom'].value
                : this.settings['deviceIDFixed'].value;
            this.persistSettings();
            this.setOutputData(0, this.properties['deviceID']);
            this.setOutputData(1, this.getInputData(0));
            this.setOutputData(2, this.getInputData(1));
            const out = {
                deviceID: this.properties['deviceID'],
                clientID: this.getInputData(0),
                siteID: this.getInputData(1)
            };
            this.setOutputData(4, out);
            console.log(JSON.stringify(out));
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
    doUUIDSteps() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = 'deviceUUID.txt';
            const dirPath = `${config_1.default.dataDir}/ids`;
            const filePath = `${dirPath}/${fileName}`;
            const isOldFileExist = yield file_utils_1.default.checkForOldDirectory(filePath);
            if (!isOldFileExist) {
                const isUUIDFile = yield uuid_utils_1.default.isUUIDFile(filePath);
                if (!isUUIDFile) {
                    try {
                        yield uuid_utils_1.default.makeUUIDFile(dirPath, fileName);
                    }
                    catch (e) {
                        this.debugErr(e);
                    }
                }
            }
            yield this.getDeviceUUID(filePath);
        });
    }
    getDeviceUUID(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield file_utils_1.default.readFile(filePath);
                this.settings['deviceIDFixed'].value = data.toString().trim();
                this.broadcastSettingsToClients();
            }
            catch (e) {
                this.debugWarn(e);
            }
        });
    }
}
container_1.Container.registerNodeType('system/platform', PlatNode);
//# sourceMappingURL=platform.js.map