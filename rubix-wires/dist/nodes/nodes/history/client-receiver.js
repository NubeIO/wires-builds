"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class ClientReceiver extends node_1.Node {
    constructor() {
        super();
        this.listOfClients = [];
        this.title = 'ClientReceiver';
        this.description = '';
        this.settings['clientUUID'] = {
            description: 'enable enable',
            value: '',
            type: node_1.SettingType.READONLY,
        };
    }
    onAdded() { }
    onAfterSettingsChange() { }
    subscribe({ action, payload }) {
        switch (action) {
            case 'ADD_CLIENT':
                console.log(111);
                console.log(action, payload);
                this.settings['clientUUID'].value = payload.uuid;
                this.broadcastSettingsToClients();
                this.listOfClients.push(payload);
                console.log(this.listOfClients);
                break;
            case 'DELETE_CLIENT':
                this.listOfClients = this.listOfClients.filter(e => e.uuid !== payload.uuid);
                console.log(this.listOfClients);
                break;
            default:
                this.debugWarn("Request action doesn't match");
        }
    }
}
container_1.Container.registerNodeType('history/client-receiver', ClientReceiver);
//# sourceMappingURL=client-receiver.js.map