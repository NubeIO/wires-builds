"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class MathTriggerModulusNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Trigger Modulus';
        this.description =
            "When 'trigger' transitions from 'false' to 'true', 'output' is updated with the result of the modulus of the inputs ('in 1' % 'in 2'). Input values can be set from settings. ";
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addInputWithSettings('in 1', node_io_1.Type.NUMBER, 0, 'in 1');
        this.addInputWithSettings('in 2', node_io_1.Type.NUMBER, 2, 'in 2');
        this.addOutput('output', node_io_1.Type.NUMBER);
    }
    onAdded() {
        this.lastTrigger = false;
        this.onInputUpdated();
    }
    onInputUpdated() {
        const trigger = this.getInputData(0);
        if (trigger && !this.lastTrigger) {
            let a = this.getInputData(1);
            let b = this.getInputData(2);
            if (a != null && b != null)
                this.setOutputData(0, a % b);
            else
                this.setOutputData(0, null);
        }
        this.lastTrigger = trigger;
    }
    dynamicInputStartPosition() {
        return 1;
    }
}
container_1.Container.registerNodeType('math-trigger/trigger-modulus', MathTriggerModulusNode);
//# sourceMappingURL=trigger-modulus.js.map