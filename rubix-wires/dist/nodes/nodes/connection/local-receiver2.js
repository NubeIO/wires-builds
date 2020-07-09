"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class ConnectionLocalReceiverNode2 extends node_1.Node {
    constructor() {
        super();
        this.title = 'Link Receiver2';
        this.description =
            "This node works in conjunction with link-transmitter node and provides a connection of nodes without the graphical wires.  'out #' outputs will match the corresponding 'in #' input from link-transmitter nodes with matching 'Channel Number' settings.  The number of outputs is configurable from settings.";
        this.settings['channel'] = {
            description: 'Channel Number',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
    }
    onAdded() {
        this.updateTitle();
    }
    onAfterSettingsChange() {
    }
    subscribe({ action, payload }) {
        switch (action) {
            case "SEND_PAYLOAD_TO_CHILD":
                console.log(111);
                console.log(action, payload);
                console.log(22);
                break;
            default:
                this.debugWarn("Request action doesn't match");
        }
    }
    updateTitle() {
        this.title = 'Link Receiver [' + this.settings['channel'].value + ']';
    }
}
container_1.Container.registerNodeType('connection/link-receiver2', ConnectionLocalReceiverNode2);
//# sourceMappingURL=local-receiver2.js.map