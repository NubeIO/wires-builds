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
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const axios_1 = require("axios");
const flexible_node_1 = require("../../../flexible-node");
const btoa = require('btoa');
class ConnectionRemoteTransmitterNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicSettingsExist = false;
        this.dynamicDefaultInputs = 1;
        this.dynamicMinInputs = 1;
        this.title = 'Remote Link Transmitter Node';
        this.description =
            'This node works in conjunction with the Remote Link Receiver, ' +
                'and provides a remote connection of nodes. ' +
                'The principle of operation of this node is the same as the Local Transmitter node, ' +
                'but this node can be used to link the nodes are located on different ' +
                'servers in a local network or in the Internet. ' +
                'With this node you can merge several SingleHub systems into one system. ' +
                'To link the transmitter and the receiver, ' +
                'you need to set the channel (like on the Local Transmitter node), ' +
                'address (and port) of the server and password. ' +
                'The server address (and port) - exactly the same, ' +
                'which it access in the browser ("http://192.168.1.2:1313" for example). ' +
                'The passwords in the transmitter and receiver must match. ' +
                'If you do not specify a password, the password will not be used.';
        this.settings['address'] = {
            description: 'Address',
            value: 'http://localhost:1313',
            type: node_1.SettingType.STRING,
        };
        this.settings['username'] = { description: 'Username', value: '', type: node_1.SettingType.STRING };
        this.settings['password'] = { description: 'Password', value: '', type: node_1.SettingType.PASSWORD };
        this.settings['channel'] = {
            description: 'Set The Channel Number',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
    }
    onAdded() {
        this.updateTitle();
    }
    getAuthorization() {
        const username = this.settings['username'].value;
        const password = this.settings['password'].value;
        return `'Basic ${btoa(`${username}:${password}`)}`;
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            let url = this.settings['address'].value + '/api/editor/c/0/n-type';
            for (let i in this.inputs) {
                if (this.inputs[i].updated) {
                    const body = {
                        type: 'connection/remote-link-receiver',
                        subcontainers: true,
                        channel: this.settings['channel'].value,
                        output: +i,
                        value: this.inputs[i].data,
                    };
                    const headers = {
                        Authorization: this.getAuthorization(),
                    };
                    try {
                        const res = yield axios_1.default.post(url, body, { headers });
                        if (res.status !== 200) {
                            this.debugWarn('Receiver drop data. Error: ' + res.data);
                        }
                    }
                    catch (e) {
                        this.debugWarn('Cant send data. ' + e);
                    }
                }
            }
        });
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.updateTitle();
    }
    updateTitle() {
        this.title = 'Remote Link Transmitter [' + this.settings['channel'].value + ']';
    }
}
exports.ConnectionRemoteTransmitterNode = ConnectionRemoteTransmitterNode;
container_1.Container.registerNodeType('connection/remote-link-transmitter', ConnectionRemoteTransmitterNode);
//# sourceMappingURL=remote-transmitter.js.map