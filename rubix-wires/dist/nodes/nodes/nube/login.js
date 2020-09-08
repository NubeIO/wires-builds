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
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
const axios_1 = require("axios");
const crypto_utils_1 = require("../../utils/crypto-utils");
const time_utils_1 = require("../../utils/time-utils");
class NubeLoginNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Login';
        this.description =
            "This node is used to authenticate with Nube devices.  Once successfully authenticated, the other Nube-API nodes will have their settings updated with values from the connected Nube devices. ‘Host’ setting is the IP address of the Nube controller to connect to.  ‘Port’ setting is the port at ‘Host’ (standard port is 4000). ‘Username’ setting is the username for the ‘Host’ (standard is ‘admin’).  ‘Password’ setting is the password for the ‘Host’; this password is supplied with each Nube controller.  ‘Interval’ is the authentication frequency (minimum 10 mins). 'interval’ units can be configured from settings.  Maximum ‘interval’ setting is 587 hours.";
        this.settings['host'] = { description: 'Host', value: '', type: node_1.SettingType.STRING };
        this.settings['port'] = { description: 'Port', value: '', type: node_1.SettingType.STRING };
        this.settings['username'] = { description: 'Username', value: '', type: node_1.SettingType.STRING };
        this.settings['password'] = { description: 'Password', value: '', type: node_1.SettingType.PASSWORD };
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addInputWithSettings('interval', node_io_1.Type.NUMBER, 10, 'Interval(minimum 10 minutes)', false);
        this.addOutput('jwt', node_io_1.Type.STRING);
        this.addOutput('error', node_io_1.Type.STRING);
        this.settings['time'] = {
            description: 'Units',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'milliseconds', text: 'Milliseconds' },
                    { value: 'seconds', text: 'Seconds' },
                    { value: 'minutes', text: 'Minutes' },
                    { value: 'hours', text: 'Hours' },
                ],
            },
            value: 'minutes',
        };
        this.setSettingsConfig({
            groups: [{ interval: { weight: 2 }, time: {} }],
        });
    }
    onAdded() {
        this.setExecuteInterval();
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setExecuteInterval();
            let trigger = this.getInputData(0);
            if (trigger && this.inputs[0].updated) {
                yield this.getJwtToken();
            }
        });
    }
    onExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            yield this.getJwtToken();
        });
    }
    onAfterSettingsChange() {
        return __awaiter(this, void 0, void 0, function* () {
            this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
            this.setExecuteInterval();
            yield this.getJwtToken();
        });
    }
    setExecuteInterval() {
        let interval = this.getInputData(1);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        interval = Math.max(interval, 600000);
        this.EXECUTE_INTERVAL = interval;
    }
    onRemoved() {
        if (this.side !== container_1.Side.server)
            return;
        return new Promise((resolve, reject) => {
            this.container &&
                this.container.db.removeUser({ nodeId: this.id }, err => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
        });
    }
    getJwtToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            const host = this.settings['host'].value;
            const port = this.settings['port'].value;
            const url = `${utils_1.default.buildUrl(host, port)}/user/login`;
            const username = this.settings['username'].value;
            const password = this.settings['password'].value;
            const body = { username, password: crypto_utils_1.default.decrypt(password) };
            try {
                const res = yield axios_1.default.post(url, body);
                const query = { nodeId: this.id };
                const user = {
                    jwt: res.data.token,
                    host,
                    port,
                    nodeId: this.id,
                };
                yield this.container.db.addOrUpdateUser(query, user);
                this.setOutputData(0, res.data.token);
                this.setOutputData(1, null);
            }
            catch (e) {
                this.setOutputData(0, null);
                this.setOutputData(1, e.message);
                yield this.onRemoved();
            }
            return;
        });
    }
}
container_1.Container.registerNodeType('nube/login', NubeLoginNode);
//# sourceMappingURL=login.js.map