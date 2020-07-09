"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class MathTriggerPowNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Trigger Power';
        this.description =
            "When 'trigger' transitions from 'false' to 'true', 'output' is updated with the result of 'in1' to the power of 'in2' ('in 1' ^ 'in 2'). Input values can be set from settings. ";
        this.addInput('trigger', node_1.Type.BOOLEAN);
        this.addInputWithSettings('in 1', node_1.Type.NUMBER, 0, 'in 1');
        this.addInputWithSettings('in 2', node_1.Type.NUMBER, 2, 'in 2');
        this.addOutput('output', node_1.Type.NUMBER);
    }
    onAdded() {
        this.lastTrigger = false;
        this.onInputUpdated();
    }
    onInputUpdated() {
        const trigger = this.getInputData(0);
        if (trigger && !this.lastTrigger) {
            const x = this.getInputData(1);
            const y = this.getInputData(2);
            if (x != null && y != null)
                this.setOutputData(0, Math.pow(x, y));
            else
                this.setOutputData(0, null);
        }
        this.lastTrigger = trigger;
    }
    dynamicInputStartPosition() {
        return 1;
    }
}
container_1.Container.registerNodeType('math-trigger/trigger-power', MathTriggerPowNode);
//# sourceMappingURL=trigger-power.js.map