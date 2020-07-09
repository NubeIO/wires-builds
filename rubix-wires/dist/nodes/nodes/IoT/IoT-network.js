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
const container_node_1 = require("../../container-node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const axios_1 = require("axios");
const node_icons_1 = require("../../node-icons");
const node_1 = require("../../node");
let uiMainIcon = node_icons_1.default.uiMainIcon;
let uiMainColour = node_icons_1.default.uiMainColour;
let compareMainIcon = node_icons_1.default.uiMainIcon;
let compareMainColour = node_icons_1.default.uiMainColour;
const demoPointCreationConfig = {
    code: 'new-point-2',
    kind: 'INPUT',
    type: 'DIGITAL',
    category: 'GPIO',
    unit: {
        type: 'meters_per_second',
        alias: {
            '=1': '11',
            '=2': '22',
            '=3': '33',
        },
    },
    device: 'd7cd3f57-a188-4462-b959-df7a23994c92',
    enabled: true,
};
class Network extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.protocols = ['GPIO', 'BACNET', 'MODBUS', 'UNKNOWN'].map(point => {
            return { value: point, text: point };
        });
        this.title = 'Network';
        this.description = 'Network Family creation';
        this.addInput('connect', node_1.Type.BOOLEAN);
        this.addOutput('status', node_1.Type.BOOLEAN);
        this.settings['gatewayHost'] = {
            description: 'Gateway host',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['gatewayPort'] = {
            description: 'Gateway port',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['id'] = { description: 'ID', value: '', type: node_1.SettingType.READONLY };
        this.settings['code'] = { description: 'Network Code', value: '', type: node_1.SettingType.STRING };
        this.settings['protocol'] = {
            description: 'Protocol',
            value: this.protocols[3].value,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: this.protocols,
            },
        };
    }
    onAfterSettingsChange(oldSettings) {
        const _super = Object.create(null, {
            onAfterSettingsChange: { get: () => super.onAfterSettingsChange }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onAfterSettingsChange.call(this, oldSettings);
            let id = this.settings['id'].value;
            const host = this.settings['gatewayHost'].value;
            const port = this.settings['gatewayPort'].value;
            const baseUrl = `${utils_1.default.buildUrl(host, port)}/api/network`;
            const selectIdUrl = `${baseUrl}/${id}`;
            const code = this.settings['code'].value;
            const protocol = this.settings['protocol'].value;
            const body = { code, protocol };
            if (id) {
                try {
                    const res = yield axios_1.default.patch(selectIdUrl, body);
                    this.emitResult(res.data);
                }
                catch (e) {
                    this.emitError(e);
                }
                return;
            }
            try {
                const res = yield axios_1.default.post(baseUrl, body);
                this.emitResult(res.data);
            }
            catch (e) {
                this.emitError(e);
            }
        });
    }
    emitResult(res) {
        this.settings['id'].value = res.resource.id;
        this.persistSettings();
        this.broadcastSettingsToClients();
    }
    emitError(err) {
        this.setServerNetworkSettings();
        this.persistSettings();
        this.broadcastSettingsToClients();
    }
    setServerNetworkSettings() {
        let id = this.settings['id'].value;
        const host = this.settings['gatewayHost'].value;
        const port = this.settings['gatewayPort'].value;
        const baseUrl = `${utils_1.default.buildUrl(host, port)}/api/network`;
        const selectIdUrl = `${baseUrl}/${id}`;
        if (id) {
            axios_1.default.get(selectIdUrl).then(res => {
                const network = res.data;
                this.settings['code'].value = network.code;
                this.settings['protocol'].value = network.protocol;
            }, e => {
                this.settings['code'].value = '';
                this.settings['protocol'].value = this.protocols[3].value;
            });
        }
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
container_1.Container.registerNodeType('IoT/IoT-network', Network);
//# sourceMappingURL=IoT-network.js.map