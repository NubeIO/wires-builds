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
        this.addOutput('output', node_1.Type.ANY);
        this.settings['channel'] = {
            description: 'Topic ID',
            value: 1,
            type: node_1.SettingType.STRING,
        };
    }
    onAdded() {
        this.updateTitle();
        this.setOutputData(0, this.properties['val']);
    }
    onAfterSettingsChange() {
        this.updateTitle();
    }
    updateTitle() {
        this.title = 'Link Receiver Single [' + this.settings['channel'].value + ']';
    }
}
container_1.Container.registerNodeType('connection/link-receiver-single', ConnectionLocalReceiverSingleNode);
//# sourceMappingURL=local-receiver-single.js.map