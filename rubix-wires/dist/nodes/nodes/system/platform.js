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
            'This node provides global settings for the Wires instance.  It should be added to the main(root) Editor Pane of each Wires instance.  ‘Client ID’ and ‘Device ID’ are used by each node with a history logging configuration to store data. ';
        this.settings['clientID'] = {
            description: 'Client ID',
            value: 'unknownClientID',
            type: node_1.SettingType.STRING,
        };
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
        this.properties['deviceID'];
    }
    onAdded() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.haystackAbout.serverName.then(e => {
                this.settings['serverName'].value = e;
                this.broadcastSettingsToClients();
            });
            yield this.haystackAbout.productVersion.then(e => {
                this.settings['productVersion'].value = e;
                this.broadcastSettingsToClients();
            });
            this.onAfterSettingsChange();
        });
    }
    onAfterSettingsChange() {
        this.doUUIDSteps();
        this.settings['deviceIdType'].value
            ? (this.properties['deviceID'] = this.settings['deviceIDcustom'].value)
            : (this.properties['deviceID'] = this.settings['deviceIDFixed'].value);
        this.persistSettings();
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
            const dbPath = '/data/rubix-wires/db';
            const filePath = `${dbPath}/${fileName}`;
            let result = yield this.checkUUIDFile(filePath);
            if (!result)
                this.makeUUIDFile(filePath);
            this.getDeviceUUID(filePath);
        });
    }
    checkUUIDFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContent = yield file_utils_1.default.readFile(filePath);
            if (!fileContent)
                return false;
            const fileDataArray = fileContent
                .toString()
                .trim()
                .split('-');
            if (!(fileDataArray[0].length == 8 &&
                fileDataArray[1].length == 4 &&
                fileDataArray[2].length == 4 &&
                fileDataArray[3].length == 4 &&
                fileDataArray[4].length == 12))
                return false;
            return true;
        });
    }
    getDeviceUUID(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            file_utils_1.default.readFile(filePath)
                .then(data => {
                this.settings['deviceIDFixed'].value = data.toString().trim();
                this.broadcastSettingsToClients();
            })
                .catch(err => {
                this.debugWarn(err);
            });
        });
    }
    makeUUIDFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield file_utils_1.default.writeFile(filePath, uuid_utils_1.default.createUUID());
        });
    }
}
container_1.Container.registerNodeType('system/platform', PlatNode);
//# sourceMappingURL=platform.js.map