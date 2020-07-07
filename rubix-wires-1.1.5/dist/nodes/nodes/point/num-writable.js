"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
class NumWritableNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsType = node_1.Type.NUMBER;
        this.title = 'Numeric Writable (Priority)';
        this.description =
            "Outputs the highest priority, non-null, Numeric input.  Highest priority is 'in 1' then 'in 2' and so on.  Input values can also be wired in, or set from settings. The number of inputs can be modified from settings.";
        this.addOutput('out', node_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
        this.size = this.computeSize();
    }
    onInputUpdated() {
        const inputs = this.getInputsCount();
        for (let i = this.dynamicInputStartPosition; i < inputs; i++) {
            let inputValue = this.getInputData(i);
            if (inputValue != null) {
                this.setOutputData(0, inputValue);
                return;
            }
        }
        this.setOutputData(0, null);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('point/num-writable', NumWritableNode);
//# sourceMappingURL=num-writable.js.map