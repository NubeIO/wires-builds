"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
const node_io_1 = require("../../node-io");
class MathTriggerDivideNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsType = node_io_1.Type.NUMBER;
        super.dynamicInputStartPosition = 1;
        this.title = 'Trigger Divide';
        this.description =
            "When 'trigger' transitions from 'false' to 'true', 'output' is updated with the result of the division of all inputs ('in 1' / 'in 2' / ...). Input values can be set from settings. The number of inputs is configurable from settings.";
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.NUMBER);
    }
    onAdded() {
        this.size = this.computeSize();
        this.lastTrigger = false;
        this.onInputUpdated();
    }
    onInputUpdated() {
        const trigger = this.getInputData(0);
        if (trigger && !this.lastTrigger) {
            const inputCount = this.getInputsCount();
            let total = 1;
            let div = 0;
            for (let i = this.dynamicInputStartPosition; i < inputCount; i++) {
                div = this.getInputData(i);
                if (div === 0) {
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
        this.lastTrigger = trigger;
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('math-trigger/trigger-divide', MathTriggerDivideNode);
//# sourceMappingURL=trigger-divide.js.map