"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class ConnectionLocalTransmitterSingleNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Link Transmitter';
        this.description =
            "This node works in conjunction with link-receiver node, and provides a connection of nodes without the graphical wires.  'in #' inputs will be sent to the corresponding 'out #' output on link-receiver nodes with matching 'Topic ID' settings.";
        this.addInput('input', node_1.Type.ANY);
        this.settings['channel'] = {
            description: 'Topic ID',
            value: 1,
            type: node_1.SettingType.STRING,
        };
    }
    onAdded() {
        this.updateTitle();
    }
    onInputUpdated() {
        let val = this.inputs[0].data;
        let receivers = container_1.Container.containers[0].getNodesByType('connection/link-receiver-single', true);
        receivers.forEach(receiver => {
            if (receiver.settings['channel'].value == this.settings['channel'].value) {
                receiver.properties['val'] = val;
                receiver.setOutputData(0, val);
            }
        });
    }
    onAfterSettingsChange() {
        this.updateTitle();
    }
    updateTitle() {
        this.title = 'Link Transmitter Single [' + this.settings['channel'].value + ']';
    }
}
container_1.Container.registerNodeType('connection/link-transmitter-single', ConnectionLocalTransmitterSingleNode);
//# sourceMappingURL=local-transmitter-single.js.map