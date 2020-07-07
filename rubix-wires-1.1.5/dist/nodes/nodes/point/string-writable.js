"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
class StringPriorityNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsType = node_1.Type.STRING;
        this.title = 'String Writable (Priority)';
        this.description =
            "Outputs the highest priority, non-null, String input.  Highest priority is 'in 1' then 'in 2' and so on.   Input values can also be wired in, or set from settings. The number of inputs can be modified from settings.";
        this.addOutput('out', node_1.Type.STRING);
    }
    onAdded() {
        this.size = this.computeSize();
        this.onInputUpdated();
    }
    onInputUpdated() {
        for (let i = this.dynamicInputStartPosition; i < this.getInputsCount(); i++) {
            let inputValue = this.getInputData(i);
            if (inputValue) {
                this.setOutputData(0, inputValue);
                return;
            }
        }
        this.setOutputData(0, '');
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('point/string-writable', StringPriorityNode);
//# sourceMappingURL=string-writable.js.map