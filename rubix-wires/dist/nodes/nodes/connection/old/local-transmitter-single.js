"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const node_io_1 = require("../../../node-io");
class ConnectionLocalTransmitterSingleNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Link Transmitter';
        this.description =
            "This node works in conjunction with link-receiver node, and provides a connection of nodes without the graphical wires.  'in #' inputs will be sent to the corresponding 'out #' output on link-receiver nodes with matching 'Topic ID' settings.";
        this.addInput('input', node_io_1.Type.ANY);
        this.addInputWithSettings('topic', node_io_1.Type.STRING, 'ID', 'Topic ID', false);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const val = this.inputs[0].data;
        const topicIn = this.getInputData(1);
        const topicSetting = this.settings['topic'].value;
        let topic = null;
        if (this.inputs[1].data) {
            topic = topicIn;
        }
        else
            topic = topicSetting;
        let name = 'Link Transmitter Single [' + topic + ']';
        this.updateTitle(name);
        let receivers = container_1.Container.containers[0].getNodesByType('connection/link-receiver-single', true);
        receivers.forEach(receiver => {
            if (receiver.properties['topic'] === topic) {
                receiver.properties['val'] = val;
                receiver.properties['topic'] = topic;
                receiver.setOutputData(0, val);
                receiver.setOutputData(1, topic);
            }
        });
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
    updateTitle(name) {
        this.title = name;
        this.broadcastTitleToClients();
    }
}
container_1.Container.registerNodeType('connection/link-transmitter-single', ConnectionLocalTransmitterSingleNode);
//# sourceMappingURL=local-transmitter-single.js.map