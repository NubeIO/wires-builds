"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class NumbersAverageNode extends node_1.Node {
    constructor() {
        super();
        this.values = [];
        this.title = 'Stream Average';
        this.description =
            "'output' is the average of all received Numeric 'input' value.  'output' is reset when 'reset' transitions from 'false' to 'true'.";
        this.addInput('value', node_1.Type.NUMBER);
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.NUMBER);
        this.lastReset = false;
    }
    onInputUpdated() {
        const reset = this.getInputData(1);
        if (reset && !this.lastReset) {
            this.values = [];
            this.setOutputData(0, null);
            this.lastReset = reset;
            return;
        }
        else if (!reset && this.lastReset) {
            this.lastReset = reset;
            return;
        }
        let val = this.getInputData(0);
        if (val == null)
            return;
        this.values.push(val);
        let sum = this.values.reduce(function (a, b) {
            return a + b;
        });
        let avg = sum / this.values.length;
        this.setOutputData(0, avg);
    }
}
container_1.Container.registerNodeType('streams/stream-average', NumbersAverageNode);
//# sourceMappingURL=stream-average.js.map