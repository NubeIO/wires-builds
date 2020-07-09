"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class MathLogarithmNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Logarithm (Base E)';
        this.description =
            "'log(x)' is the result of log('x') with base E (Euler's Number 2.71828).  The Natural Logarithmic function of input 'x'.";
        this.addInput('x', node_1.Type.NUMBER);
        this.addOutput('log(x)', node_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, Math.log(val));
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('math-advanced/log', MathLogarithmNode);
//# sourceMappingURL=log.js.map