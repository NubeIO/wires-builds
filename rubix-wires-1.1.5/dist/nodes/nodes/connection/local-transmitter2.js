"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const client_utils_1 = require("./client-utils");
const uuid_utils_1 = require("../../utils/uuid-utils");
class ConnectionLocalTransmitterNode2 extends node_1.Node {
    constructor() {
        super();
        this.title = 'Link Transmitter2';
        this.properties['uuid'] = null;
        this.description =
            "This node works in conjunction with link-receiver node, and provides a connection of nodes without the graphical wires.  'in #' inputs will be sent to the corresponding 'out #' output on link-receiver nodes with matching 'Channel Number' settings.  The number of inputs is configurable from settings.";
        this.settings['channel'] = {
            description: 'Channel Number',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['pointEnable'] = {
            description: 'Point enable',
            value: "he",
            type: node_1.SettingType.STRING,
        };
    }
    onAdded() {
        this.updateTitle();
        this.properties['uuid'] = uuid_utils_1.default.create8DigId();
        console.log(this.properties['uuid']);
    }
    onAfterSettingsChange() {
        let receivers = container_1.Container.containers[0].getNodesByType('connection/link-receiver2', true);
        receivers.forEach(receiver => {
            if (receiver.settings['channel'].value == this.settings['channel'].value)
                client_utils_1.default.sendPayloadToChild(receiver, {
                    points: this.properties['uuid'],
                    networkSettings: 22,
                });
        });
        this.updateTitle();
    }
    updateTitle() {
        this.title = 'Link Transmitter [' + this.settings['channel'].value + ']';
    }
}
container_1.Container.registerNodeType('connection/link-transmitter2', ConnectionLocalTransmitterNode2);
//# sourceMappingURL=local-transmitter2.js.map