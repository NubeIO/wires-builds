"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
const node_io_1 = require("../../node-io");
class MathDivideNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsType = node_io_1.Type.NUMBER;
        this.title = 'Divide';
        this.description =
            "('output' = 'in 1' / 'in 2' / ...)  'output' is the result of dividing each Numeric input in order. Input values can be set from settings. The number of inputs is configurable from settings.";
        this.addOutput('output', node_io_1.Type.NUMBER);
    }
    onAdded() {
        this.size = this.computeSize();
        this.onInputUpdated();
    }
    onInputUpdated() {
        const inputCount = this.getInputsCount();
        let total = 1;
        let div = 0;
        for (let i = this.dynamicInputStartPosition; i < inputCount; i++) {
            div = this.getInputData(i);
            if (!div) {
                this.setOutputData(0, 0);
                return;
            }
            if (i === this.dynamicInputStartPosition) {
                total = div;
            }
            else {
                total = total / div;
            }
        }
        this.setOutputData(0, total);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('math/divide', MathDivideNode);
//# sourceMappingURL=divide.js.map