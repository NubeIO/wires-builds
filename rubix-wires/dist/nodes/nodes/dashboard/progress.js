"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_io_1 = require("../../node-io");
const ui_node_1 = require("./ui-node");
const container_1 = require("../../container");
class UiProgressNode extends ui_node_1.UiNode {
    constructor(container, id, properties) {
        super('Progress', 'UiProgressNode', properties);
        this.description =
            "Dashboard node which displays 'input' value from 0-100 on a progress bar on the dashboard.";
        this.title = 'Progress';
        this.addInput('input', node_io_1.Type.NUMBER);
        this.UPDATE_INPUTS_INTERVAL = 100;
        this.setState(0);
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val > 100)
            val = 100;
        if (val < 0)
            val = 0;
        this.setState(val);
        this.isRecentlyActive = true;
    }
}
exports.UiProgressNode = UiProgressNode;
container_1.Container.registerNodeType('dashboard/progress', UiProgressNode);
//# sourceMappingURL=progress.js.map