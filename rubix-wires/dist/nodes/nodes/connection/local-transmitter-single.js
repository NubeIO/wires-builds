"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_1 = require("../../node");
const node_icons_1 = require("../../node-icons");
const icon = node_icons_1.default.aiIcon;
class ConnectionLocalTransmitterNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Link Transmitter Single';
        this.description =
            "This node works in conjunction with link-receiver node, and provides a connection of nodes without the graphical wires. 'in #' inputs will be sent to the corresponding 'out #' output on link-receiver nodes with matching 'Channel Number' settings. The number of inputs is configurable from settings.";
        this.iconImageUrl = icon;
        this.addInput('input', node_1.Type.ANY);
        this.addInputWithSettings('channel', node_1.Type.STRING, '1', 'Topic Name', false);
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, true, 'Enable');
    }
    init() {
        if (!this.properties['channel']) {
            this.properties['channel'] = null;
        }
    }
    onAdded() {
        this.onAfterSettingsChange();
        this.updateTitle();
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        this.properties['channel'] = this.getInputData(1);
        this.persistProperties(false, true);
        const receivers = this.getReceivers();
        if (this.inputs[1].updated) {
            this.updateTransmitterTopics();
        }
        if (!this.isEnable())
            return;
        const val = this.getInputData(0);
        const channel = this.getInputData(1);
        receivers.forEach(receiver => {
            if (receiver.settings['channel'].value === channel) {
                const blockNull = receiver.settings['blockNull'].value;
                if (receiver.getInputData(0) === true && ((blockNull && val != null) || !blockNull)) {
                    receiver.properties['val'] = val;
                    receiver.persistProperties(false, true);
                    receiver.setOutputData(0, receiver.properties['val'], true);
                }
            }
        });
        this.updateTitle();
    }
    onAfterSettingsChange() {
        this.updateTransmitterTopics();
        this.onInputUpdated();
    }
    onRemoved() {
        this.updateTransmitterTopics();
    }
    updateTransmitterTopics() {
        if (this.side !== container_1.Side.server)
            return;
        setTimeout(() => {
            const receivers = this.getReceivers();
            receivers.forEach(receiver => {
                receiver['triggerTransmitterTopicUpdate']();
            });
        }, 100);
    }
    getReceivers() {
        return container_1.Container.containers[0].getNodesByType('connection/link-receiver-single', true);
    }
    isEnable() {
        return this.getInputData(2);
    }
    updateTitle() {
        this.title = `Link Transmitter Single [${this.properties['channel'] || this.getInputData(1)}]`;
        this.broadcastTitleToClients();
    }
}
exports.ConnectionLocalTransmitterNode = ConnectionLocalTransmitterNode;
container_1.Container.registerNodeType('connection/link-transmitter-single', ConnectionLocalTransmitterNode);
//# sourceMappingURL=local-transmitter-single.js.map