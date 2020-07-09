"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class NumbersHighestNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Stream Highest';
        this.description =
            "'output' is the highest received Numeric 'input' value.  'output' is reset when 'reset' transitions from 'false' to 'true'. ";
        this.addInput('input', node_1.Type.NUMBER);
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.NUMBER);
        this.lastReset = false;
        this.val = null;
    }
    onInputUpdated() {
        const reset = this.getInputData(1);
        if (reset && !this.lastReset) {
            this.val = null;
            this.setOutputData(0, null);
            this.lastReset = reset;
            return;
        }
        else if (!reset && this.lastReset) {
            this.lastReset = reset;
            return;
        }
        let inputVal = this.getInputData(0);
        if (inputVal == null)
            return;
        if (this.val == null || this.val < inputVal) {
            this.val = inputVal;
            this.setOutputData(0, this.val);
        }
    }
}
container_1.Container.registerNodeType('streams/stream-highest', NumbersHighestNode);
//# sourceMappingURL=stream-highest.js.map