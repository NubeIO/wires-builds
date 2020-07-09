"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_node_1 = require("./ui-node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
class UiLabelNode extends ui_node_1.UiNode {
    constructor(container, id, properties) {
        super('Label', 'UiLabelNode', properties);
        this.description = 'Dashboard node which displays inputed values on the dashboard.';
        this.title = 'Label';
        this.addInput('input');
        this.UPDATE_INPUTS_INTERVAL = 100;
    }
    onInputUpdated() {
        const state = utils_1.default.formatValue(this.getInputData(0));
        this.setState(state);
        this.isRecentlyActive = true;
    }
}
exports.UiLabelNode = UiLabelNode;
container_1.Container.registerNodeType('dashboard/label', UiLabelNode);
//# sourceMappingURL=label.js.map