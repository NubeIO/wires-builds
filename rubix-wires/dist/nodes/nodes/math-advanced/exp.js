"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class MathExpNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Exp';
        this.description =
            "('exp(x)' = E^'x') 'exp(x)' is the result of raising E (Euler's Number 2.71828) to the power of 'x'.  The Natural Exponential function.";
        this.addInput('x', node_io_1.Type.NUMBER);
        this.addOutput('exp(x)', node_io_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, Math.exp(val));
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('math-advanced/exp', MathExpNode);
//# sourceMappingURL=exp.js.map