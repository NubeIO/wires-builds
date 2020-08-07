"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class ConnectionLocalReceiverSingleNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Link Receiver';
        this.description =
            "This node works in conjunction with link-transmitter node and provides a connection of nodes without the graphical wires.  'out #' outputs will match the corresponding 'in #' input from link-transmitter nodes with matching 'Topic ID' settings.";
        this.properties['val'] = null;
        this.properties['topic'] = null;
        this.properties['topic_setting'] = null;
        this.addInputWithSettings('topic', node_1.Type.STRING, 'ID', 'Topic ID', false);
        this.addOutput('val', node_1.Type.ANY);
        this.addOutput('topic', node_1.Type.ANY);
    }
    onAdded() {
        this.setOutputData(0, this.properties['val']);
        this.setOutputData(1, this.properties['topic']);
        this.onInputUpdated();
    }
    onInputUpdated() {
        const topicIn = this.getInputData(0);
        const topicSetting = this.settings['topic'].value;
        if (this.inputs[0].data) {
            this.properties['topic_setting'] = topicIn;
        }
        else
            this.properties['topic_setting'] = topicSetting;
        let name = 'Link Receiver Single [' + this.settings['topic'].value + ']';
        this.updateTitle(name);
        this.setOutputData(0, this.properties['val']);
        this.setOutputData(1, this.properties['topic']);
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
    updateTitle(name) {
        this.title = name;
    }
}
container_1.Container.registerNodeType('connection/link-receiver-single', ConnectionLocalReceiverSingleNode);
//# sourceMappingURL=local-receiver-single.js.map