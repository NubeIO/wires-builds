"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const ui_node_1 = require("./ui-node");
class UiTextBoxNode extends ui_node_1.UiNode {
    constructor(container, id, properties) {
        super('TextBox', 'UiTextBoxNode', properties);
        this.description =
            "Dashboard node which provides a user input text box on the dashboard.  The entered string is sent from the node 'output'.  The text-box can be overridden by wiring a String into the node 'input'. ";
        this.title = 'Text-Box';
        this.setState('');
        this.addInput('input', node_1.Type.STRING);
        this.addOutput('output', node_1.Type.STRING);
    }
    onAdded() {
        super.onAdded();
        if (this.side == container_1.Side.server)
            this.setOutputData(0, this.getState());
    }
    onGetMessageToServerSide(data) {
        this.setValue(data.state);
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        this.setValue(val);
    }
    setValue(val) {
        this.setOutputData(0, val);
        this.sendIOValuesToEditor();
        this.isRecentlyActive = true;
        if (this.getState() != val)
            this.setState(val);
    }
}
exports.UiTextBoxNode = UiTextBoxNode;
container_1.Container.registerNodeType('dashboard/text-box', UiTextBoxNode);
//# sourceMappingURL=text-box.js.map