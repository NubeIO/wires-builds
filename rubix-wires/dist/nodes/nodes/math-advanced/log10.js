"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class MathLogarithmNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Logarithm (Base 10)';
        this.description = "'log10(x)' is the result of log('x') with base 10.";
        this.addInput('x', node_io_1.Type.NUMBER);
        this.addOutput('log10(x)', node_io_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, Math.log10(val));
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('math-advanced/log10', MathLogarithmNode);
//# sourceMappingURL=log10.js.map