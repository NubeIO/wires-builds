"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const ui_node_1 = require("./ui-node");
const node_1 = require("../../node");
class UiSwitchNode extends ui_node_1.UiNode {
    constructor(container, id, properties) {
        super('Switch', 'UiSwitchNode', properties);
        this.description =
            "Dashboard node which displays a toggle switchon the dashboard.  When clicked it will switch the node 'output' between 'true' and 'false'.  The button text can be edited in settings.  The button can be overridden by wiring a Boolean into the node 'input'. ";
        this.title = 'Switch';
        this.setState(false);
        this.addInput('input', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.BOOLEAN);
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
exports.UiSwitchNode = UiSwitchNode;
container_1.Container.registerNodeType('dashboard/switch', UiSwitchNode);
//# sourceMappingURL=switch.js.map