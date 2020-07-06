"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class NumbersLowestNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Stream Lowest';
        this.description =
            "'output' is the lowest received Numeric 'input' value.  'output' is reset when 'reset' transitions from 'false' to 'true'. ";
        this.addInput('input', node_1.Type.NUMBER);
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.NUMBER);
        this.val = null;
        this.lastReset = false;
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
        if (this.val == null || this.val > inputVal) {
            this.val = inputVal;
            this.setOutputData(0, this.val);
        }
    }
}
container_1.Container.registerNodeType('streams/stream-lowest', NumbersLowestNode);
//# sourceMappingURL=stream-lowest.js.map