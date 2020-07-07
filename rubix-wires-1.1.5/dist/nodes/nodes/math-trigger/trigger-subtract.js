"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
class MathTriggerSubNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsType = node_1.Type.NUMBER;
        super.dynamicInputStartPosition = 1;
        this.title = 'Trigger Subtract';
        this.description =
            "When 'trigger' transitions from 'false' to 'true', 'output' is updated with the result of the subtraction of all inputs ('in 1' - 'in 2' - ...). Input values can be set from settings. The number of inputs is configurable from settings.";
        this.addInput('trigger', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.NUMBER);
    }
    onAdded() {
        this.lastTrigger = false;
        this.onInputUpdated();
    }
    onInputUpdated() {
        const trigger = this.getInputData(0);
        if (trigger && !this.lastTrigger) {
            const inputCount = this.getInputsCount();
            let total = this.getInputData(1);
            for (let i = this.dynamicInputStartPosition + 1; i < inputCount; i++) {
                total -= this.getInputData(i);
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
container_1.Container.registerNodeType('math-trigger/trigger-subtract', MathTriggerSubNode);
//# sourceMappingURL=trigger-subtract.js.map