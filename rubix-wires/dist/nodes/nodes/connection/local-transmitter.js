"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
class ConnectionLocalTransmitterNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicSettingsExist = false;
        this.dynamicDefaultInputs = 1;
        this.dynamicMinInputs = 1;
        this.title = 'Link Transmitter';
        this.description =
            "This node works in conjunction with link-receiver node, and provides a connection of nodes without the graphical wires.  'in #' inputs will be sent to the corresponding 'out #' output on link-receiver nodes with matching 'Channel Number' settings.  The number of inputs is configurable from settings.";
        this.settings['channel'] = {
            description: 'Channel Number',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
    }
    onAdded() {
        this.updateTitle();
    }
    onInputUpdated() {
        for (let i in this.inputs) {
            if (this.inputs[i].updated) {
                let val = this.inputs[i].data;
                let receivers = container_1.Container.containers[0].getNodesByType('connection/link-receiver', true);
                receivers.forEach(receiver => {
                    if (receiver.settings['channel'].value == this.settings['channel'].value) {
                        receiver.setOutputData(+i, val);
                    }
                });
            }
        }
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.updateTitle();
    }
    updateTitle() {
        this.title = 'Link Transmitter [' + this.settings['channel'].value + ']';
    }
}
exports.ConnectionLocalTransmitterNode = ConnectionLocalTransmitterNode;
container_1.Container.registerNodeType('connection/link-transmitter', ConnectionLocalTransmitterNode);
//# sourceMappingURL=local-transmitter.js.map