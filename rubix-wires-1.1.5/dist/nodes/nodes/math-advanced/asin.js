"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class MathAsinNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Asin';
        this.description =
            "'asin(x)' is the result of arcsin('x').  The Inverse Sine function of input 'x'.";
        this.addInput('x', node_1.Type.NUMBER);
        this.addOutput('asin(x)', node_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, Math.asin(val));
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('math-advanced/asin', MathAsinNode);
//# sourceMappingURL=asin.js.map