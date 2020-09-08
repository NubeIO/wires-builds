"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
const node_io_1 = require("../../node-io");
class MathSubNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsType = node_io_1.Type.NUMBER;
        this.title = 'Subtract';
        this.description =
            "('output' = 'in 1' - 'in 2' - ...)  'output' is the result of subtracting each Numeric input in order. Input values can be set from settings. The number of inputs is configurable from settings.";
        this.addOutput('output', node_io_1.Type.NUMBER);
    }
    onAdded() {
        this.size = this.computeSize();
        this.onInputUpdated();
    }
    onInputUpdated() {
        const inputCount = this.getInputsCount();
        let total = this.getInputData(0);
        for (let i = this.dynamicInputStartPosition + 1; i < inputCount; i++) {
            total = total - this.getInputData(i);
        }
        this.setOutputData(0, total);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('math/subtract', MathSubNode);
//# sourceMappingURL=subtract.js.map