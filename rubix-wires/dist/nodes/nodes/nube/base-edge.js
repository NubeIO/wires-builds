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
class BaseEdge extends node_1.Node {
    constructor() {
        super();
        this.settings['url'] = {
            description: 'Select Url',
            value: '',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [],
            },
        };
    }
    fetchConnection(suffixApi) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = null;
            const users = yield this.container.db.getAsyncUsers();
            const urls = users.map(user => {
                return {
                    value: JSON.stringify(user),
                    text: `${utils_1.default.buildUrl(user.host, user.port)}${suffixApi} (${user.nodeId})`,
                };
            });
            this.settings['url'].config.items = urls;
            const url = this.settings['url'].value;
            if (url && urls.map(x => x.value).includes(url)) {
                user = this.settings['url'].value;
            }
            else {
                user = urls.length && urls[0].value;
                this.settings['url'].value = user;
            }
            this.broadcastSettingsToClients();
            return (user && JSON.parse(user)) || null;
        });
    }
}
exports.BaseEdge = BaseEdge;
//# sourceMappingURL=base-edge.js.map