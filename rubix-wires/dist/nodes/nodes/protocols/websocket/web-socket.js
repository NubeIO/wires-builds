"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_utils_1 = require("../../../utils/crypto-utils");
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const btoa = require('btoa');
const W3CWebSocket = require('websocket').w3cwebsocket;
var Authorization;
(function (Authorization) {
    Authorization["Basic"] = "Basic";
    Authorization["None"] = "None";
})(Authorization || (Authorization = {}));
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["Connected"] = "Connected";
    ConnectionStatus["Disconnected"] = "Disconnected";
})(ConnectionStatus || (ConnectionStatus = {}));
class WebSocketNode extends node_1.Node {
    constructor() {
        super();
        this.client = null;
        this.title = 'WebSocket';
        this.description = 'WebSocket Client for request/listen output';
        this.addInput('send', node_1.Type.STRING);
        this.addInput('connect', node_1.Type.BOOLEAN);
        this.addOutput('message', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
        this.addOutput('status', node_1.Type.STRING);
        this.settings['authorization-type'] = {
            description: 'Authorization Type',
            value: Authorization.Basic,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: Object.values(Authorization),
            },
        };
        this.settings['url'] = { description: 'URL', value: '', type: node_1.SettingType.STRING };
        this.settings['username'] = { description: 'Username', value: '', type: node_1.SettingType.STRING };
        this.settings['password'] = { description: 'Password', value: '', type: node_1.SettingType.PASSWORD };
    }
    onInputUpdated() {
        this.onWebSocketConfigChange();
    }
    onAfterSettingsChange() {
        this.onWebSocketConfigChange();
    }
    onRemoved() {
        if (this.client)
            this.client.close();
    }
    onWebSocketConfigChange() {
        if (this.side !== container_1.Side.server)
            return;
        this.clearOutputs();
        if (this.client)
            this.client.close();
        if (!this.getInputData(1))
            return;
        const authorizationType = this.settings['authorization-type'].value;
        const url = this.settings['url'].value;
        const username = this.settings['username'].value;
        const password = this.settings['password'].value;
        const message = this.getInputData(0);
        const websocketUrlRegex = new RegExp('^(wss?:\\/\\/)([0-9]{1,3}(?:\\.[0-9]{1,3}){3}|[a-zA-Z0-9.\\-\\/]+)(:([0-9]{1,5}))?[a-zA-Z0-9.\\-\\/]+?$');
        if (!websocketUrlRegex.test(url)) {
            this.setOutputData(1, 'Invalid URL');
            return;
        }
        if (authorizationType === Authorization.Basic) {
            const authorization = btoa(`${username}:${crypto_utils_1.default.decrypt(password)}`);
            this.client = new W3CWebSocket(url, null, null, {
                Authorization: `Basic ${authorization}`,
            });
        }
        else {
            this.client = new W3CWebSocket(url);
        }
        this.client.onerror = () => {
            this.debugErr('Connection Error');
            this.setOutputData(1, 'Connection Error');
            this.setOutputData(2, ConnectionStatus.Disconnected);
        };
        this.client.onopen = () => {
            this.debugInfo('WebSocket Client Connected');
            this.client.send(message || '');
            this.setOutputData(2, ConnectionStatus.Connected);
        };
        this.client.onclose = () => {
            this.debugInfo('Client Closed');
            this.setOutputData(2, ConnectionStatus.Disconnected);
        };
        this.client.onmessage = e => {
            this.setOutputData(0, e.data);
        };
    }
    clearOutputs() {
        this.setOutputData(0, null);
        this.setOutputData(1, null);
        this.setOutputData(2, ConnectionStatus.Disconnected);
    }
}
container_1.Container.registerNodeType('protocols/websocket', WebSocketNode);
//# sourceMappingURL=web-socket.js.map