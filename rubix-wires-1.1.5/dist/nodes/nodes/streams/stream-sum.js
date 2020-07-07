"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class NumbersSumNode extends node_1.Node {
    constructor() {
        super();
        this.val = 0;
        this.title = 'Stream Sum';
        this.description =
            "output' is the sum of all received Numeric 'input' value.  'output' is reset to 0 when 'reset' transitions from 'false' to 'true'.";
        this.addInput('input', node_1.Type.NUMBER);
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.NUMBER);
        this.lastReset = false;
    }
    onInputUpdated() {
        const reset = this.getInputData(1);
        if (reset && !this.lastReset) {
            this.val = 0;
            this.setOutputData(0, 0);
            this.lastReset = reset;
            return;
        }
        else if (!reset && this.lastReset) {
            this.lastReset = reset;
            return;
        }
        if (this.inputs[0].updated && this.inputs[0].data != null)
            this.val += this.inputs[0].data;
        this.setOutputData(0, this.val, true);
    }
}
container_1.Container.registerNodeType('streams/stream-sum', NumbersSumNode);
//# sourceMappingURL=stream-sum.js.map