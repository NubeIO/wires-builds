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
const container_1 = require("../../container");
const os_utils_1 = require("../../utils/os-utils");
class PlatNode extends node_1.Node {
    constructor() {
        super();
        this.unitsFunc = ['metric', 'imperial'].map(e => {
            return { value: e, text: e };
        });
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
        this.title = 'Platform Instance';
        this.settings['units'] = {
            description: 'Select Units of measurement',
            value: this.unitsFunc[0].value,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: this.unitsFunc,
            },
        };
        this.description = "A node for return the build versions of wires and nodejs'";
        this.settings['id'] = this.haystackSite.id;
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
        });
    }
    onAfterSettingsChange() {
        this.persistSettings();
        console.log(this.settings['units'].value);
    }
    persistSettings() {
        if (!this.container.db)
            return;
        this.container.db.updateNode(this.id, this.container.id, {
            $set: {
                settings: this.settings,
            },
        });
    }
}
container_1.Container.registerNodeType('platform/plat', PlatNode);
//# sourceMappingURL=plat.js.map