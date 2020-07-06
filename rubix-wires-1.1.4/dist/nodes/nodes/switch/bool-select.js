"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const flexible_node_1 = require("../../flexible-node");
class BoolSelectNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsType = node_1.Type.BOOLEAN;
        super.dynamicInputStartPosition = 1;
        this.title = 'Boolean Select';
        this.description =
            "Numeric integer 'select' passes corresponding Boolean input to 'output'.  If 'select' is 2, 'in 2' will be passed to 'output' (likewise for other integer 'select' values). If the 'select' value does not have a corresponding 'in #' value, 'output' value will be 'null'.  The number of inputs and their values can be modified from settings.";
        this.addInput('select', node_1.Type.NUMBER);
        this.addOutput('output', node_1.Type.BOOLEAN);
    }
    onAdded() {
        this.size = this.computeSize();
        this.onInputUpdated();
    }
    onInputUpdated() {
        const select = this.getInputData(0);
        if (!utils_1.default.hasInput(select) ||
            select < this.dynamicInputStartPosition ||
            select > this.getInputsCount() - this.dynamicInputStartPosition) {
            this.setOutputData(0, null, true);
            return;
        }
        this.setOutputData(0, this.getInputData(select));
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('switch/bool-select', BoolSelectNode);
//# sourceMappingURL=bool-select.js.map