"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
const node_io_1 = require("../../node-io");
class BoolOutputSelectNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicOutputsExist = true;
        this.dynamicInputsExist = false;
        this.dynamicSettingsExist = false;
        super.dynamicOutputsType = node_io_1.Type.BOOLEAN;
        this.title = 'Boolean Output Select';
        this.description =
            "Numeric integer 'select' passes Boolean 'input' to the corresponding Boolean 'output'.  If 'select' is 2, 'input' will be passed to 'out 2' (likewise for other integer 'select' values). If the 'select' value does not have a corresponding 'out #' value, no values will be passed.  The number of outputs  can be modified from settings.";
        this.addInput('select', node_io_1.Type.NUMBER);
        this.addInput('input', node_io_1.Type.NUMBER);
    }
    onInputUpdated() {
        let active = this.getInputData(0);
        let val = this.getInputData(1);
        if (active < 0 || active >= this.getOutputsCount()) {
            this.debugWarn('Defined active output does not exist');
            return;
        }
        this.setOutputData(active, val);
    }
}
exports.BoolOutputSelectNode = BoolOutputSelectNode;
container_1.Container.registerNodeType('switch/bool-output-select', BoolOutputSelectNode);
//# sourceMappingURL=bool-output-select.js.map