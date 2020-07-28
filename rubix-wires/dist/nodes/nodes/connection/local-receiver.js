"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
class ConnectionLocalReceiverNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicOutputsExist = true;
        this.dynamicInputsExist = false;
        this.dynamicSettingsExist = false;
        this.dynamicDefaultOutputs = 1;
        this.dynamicMinOutputs = 1;
        this.title = 'Link Receiver';
        this.description =
            "This node works in conjunction with link-transmitter node and provides a connection of nodes without the graphical wires.  'out #' outputs will match the corresponding 'in #' input from link-transmitter nodes with matching 'Channel Number' settings.  The number of outputs is configurable from settings.";
        this.settings['channel'] = {
            description: 'Channel Number',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
    }
    onCreated() {
        this.properties['channel'] = 1;
    }
    onAdded() {
        this.updateTitle();
        this.onAfterSettingsChange();
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.updateTitle();
        if (this.properties['channel'] !== this.settings['channel'].value)
            this.resetOutputs();
        this.triggerTransmitterNodeUpdate();
    }
    triggerTransmitterNodeUpdate() {
        let transmitters = container_1.Container.containers[0].getNodesByType('connection/link-transmitter', true);
        transmitters.forEach(transmitter => {
            if (transmitter.settings['channel'].value == this.settings['channel'].value) {
                transmitter['onInputUpdated']();
            }
        });
    }
    resetOutputs() {
        for (let i in this.outputs) {
            this.setOutputData(+i, null);
        }
    }
    updateTitle() {
        this.title = 'Link Receiver [' + this.settings['channel'].value + ']';
    }
}
exports.ConnectionLocalReceiverNode = ConnectionLocalReceiverNode;
container_1.Container.registerNodeType('connection/link-receiver', ConnectionLocalReceiverNode);
//# sourceMappingURL=local-receiver.js.map