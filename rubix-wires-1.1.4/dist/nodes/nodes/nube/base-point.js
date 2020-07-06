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
const utils_1 = require("../../utils");
const axios_1 = require("axios");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
class BasePointNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.previousAdvancedSetting = false;
        this.advancedSetting = false;
        this.settings['url'] = {
            description: 'Select Url',
            value: '',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [],
            },
        };
        this.settings['point'] = { description: 'Select Point', value: '', type: node_1.SettingType.STRING };
        this.settings['point'] = {
            description: 'Select Point',
            value: '',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [],
            },
        };
    }
    onAdded() {
        this.previousAdvancedSetting = this.settings['advancedSetting'].value;
        this.advancedSetting = this.previousAdvancedSetting;
        this.updateTitle();
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            yield this.reload();
            this.updateTitle();
            this.broadcastTitleToClients();
        });
    }
    fetchPointValue({ jwt, host, port }, point) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${utils_1.default.buildUrl(host, port)}/points/${point}`;
            const pointValue = yield axios_1.default.get(url, { headers: { Authorization: jwt } });
            return pointValue.data;
        });
    }
    fetchConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.container.db.getAsyncUsers();
            const urls = users.map(user => {
                return {
                    value: JSON.stringify(user),
                    text: `${utils_1.default.buildUrl(user.host, user.port)}/points (${user.nodeId})`,
                };
            });
            this.settings['url'].config.items = urls;
            this.broadcastSettingsToClients();
            const url = this.settings['url'].value;
            const user = this.settings['url'].value;
            const urlJson = JSON.parse(url);
            const findUrl = urls.find(x => JSON.parse(x.value).nodeId === urlJson.nodeId);
            if (!user || !findUrl) {
                throw { message: 'No connection' };
            }
            this.settings['url'].value = findUrl.value;
            this.broadcastSettingsToClients();
            return (user && JSON.parse(user)) || null;
        });
    }
    fetchPoints({ jwt, host, port }) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${utils_1.default.buildUrl(host, port)}/points`;
            const response = yield axios_1.default.get(url, { headers: { Authorization: jwt } });
            const rawPoints = this.filterPoint(Object.keys(response.data));
            const points = rawPoints.map(point => {
                return { value: point, text: point };
            });
            this.settings['point'].config.items = points;
            this.broadcastSettingsToClients();
            const point = this.settings['point'].value;
            if (!point || !points.map(x => x.value).includes(point)) {
                throw { message: 'No point' };
            }
            return point;
        });
    }
    filterPoint(points) {
        return points;
    }
}
exports.default = BasePointNode;
//# sourceMappingURL=base-point.js.map