"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_icons_1 = require("../../node-icons");
const icon = node_icons_1.default.aiIcon;
class ConnectionLocalReceiverNode extends node_1.Node {
    constructor() {
        super();
        this.topicList = [];
        this.title = 'Link Receiver Topic';
        this.description =
            "This node works in conjunction with link-transmitter node and provides a connection of nodes without the graphical wires. 'out #' outputs will match the corresponding 'in #' input from link-transmitter nodes with matching 'Channel Number' settings.  The number of outputs is configurable from settings.";
        this.iconImageUrl = icon;
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, true, 'Enable');
        this.addOutput('output', node_1.Type.ANY);
        this.addOutput('topic-id', node_1.Type.STRING);
        this.settings['channel'] = {
            description: 'Topic Name',
            config: { items: [] },
            value: '',
            type: node_1.SettingType.DROPDOWN,
        };
        this.settings['blockNull'] = {
            description: 'Block Null',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    init() {
        if (!this.properties['val']) {
            this.properties['val'] = null;
        }
    }
    onAdded() {
        this.onAfterSettingsChange();
        this.setOutputData(0, this.properties['val']);
    }
    onAfterSettingsChange() {
        this.updateTitle();
        if (this.side !== container_1.Side.server)
            return;
        this.transmitterTopic();
        this.updateChannel();
    }
    pushSettings() {
        const unitCategory = this.topicList.map((point) => {
            return { value: point, text: point };
        });
        this.settings['channel'].config = {
            items: unitCategory,
        };
        this.persistProperties(true);
        this.updateTitle();
        this.updateChannel();
        this.broadcastSettingsToClients(false);
        this.broadcastTitleToClients(false);
        this.broadcastOutputsToClients(false);
    }
    transmitterTopic() {
        const transmitters = container_1.Container.containers[0].getNodesByType('connection/link-transmitter-single', true);
        this.topicList = [];
        transmitters.forEach(transmitter => {
            this.topicList.push(transmitter.getInputData(1));
        });
        this.pushSettings();
    }
    updateTitle() {
        this.title = 'Link Receiver Single [' + this.settings['channel'].value + ']';
    }
    updateChannel() {
        this.setOutputData(1, this.settings['channel'].value, true);
    }
    triggerTransmitterTopicUpdate() {
        if (this.side !== container_1.Side.server)
            return;
        this.transmitterTopic();
    }
}
exports.ConnectionLocalReceiverNode = ConnectionLocalReceiverNode;
container_1.Container.registerNodeType('connection/link-receiver-single', ConnectionLocalReceiverNode);
//# sourceMappingURL=local-receiver-single.js.map