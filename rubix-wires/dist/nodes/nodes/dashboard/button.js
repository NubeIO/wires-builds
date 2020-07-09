"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const ui_node_1 = require("./ui-node");
const node_1 = require("../../node");
class UiButtonNode extends ui_node_1.UiNode {
    constructor(container, id, properties) {
        super('Button', 'UiButtonNode', properties);
        this.interval = null;
        this.description =
            "Dashboard node which displays a push button on the dashboard.  When clicked it will send 'true' from the node 'output'.";
        this.title = 'Button';
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.settings['button-text'] = {
            description: 'Button Text',
            value: 'ON',
            type: node_1.SettingType.STRING,
        };
        this.setState({ buttonText: 'ON' });
    }
    onAfterSettingsChange() {
        if (this.side !== container_1.Side.server)
            return;
    }
    onRemoved() {
        super.onRemoved();
    }
    onGetMessageToServerSide() {
        this.setOutputData(0, true);
        this.sendIOValuesToEditor();
    }
}
exports.UiButtonNode = UiButtonNode;
container_1.Container.registerNodeType('dashboard/button', UiButtonNode);
//# sourceMappingURL=button.js.map