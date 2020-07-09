"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const client_utils_1 = require("./client-utils");
const uuid_utils_1 = require("../../utils/uuid-utils");
class ClientTransmitter extends node_1.Node {
    constructor() {
        super();
        this.title = 'ClientTransmitter';
        this.properties['uuid'] = null;
        this.description = '';
        this.settings['clientName'] = {
            description: 'clientName enable',
            value: "my new client",
            type: node_1.SettingType.STRING,
        };
        this.settings['enable'] = {
            description: 'enable enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    onAdded() {
        this.properties['uuid'] = uuid_utils_1.default.create8DigId();
        console.log(this.properties['uuid']);
    }
    onRemoved() {
        let receivers = container_1.Container.containers[0].getNodesByType('history/client-receiver', true);
        receivers.forEach(receiver => {
            client_utils_1.default.deleteClient(receiver, {
                uuid: this.properties['uuid'],
                details: "delete client",
            });
        });
    }
    onAfterSettingsChange() {
        let receivers = container_1.Container.containers[0].getNodesByType('history/client-receiver', true);
        receivers.forEach(receiver => {
            client_utils_1.default.addClient(receiver, {
                uuid: this.properties['uuid'],
                details: "add client",
            });
        });
    }
}
container_1.Container.registerNodeType('history/client-transmitter', ClientTransmitter);
//# sourceMappingURL=client-transmitter.js.map