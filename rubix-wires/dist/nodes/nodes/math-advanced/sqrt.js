"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class MathSqrtNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Sqrt';
        this.description = "'sqrt(x)' is the Square Root of input 'x'.";
        this.addInput('x', node_1.Type.NUMBER);
        this.addOutput('sqrt(x)', node_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, Math.sqrt(val));
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('math-advanced/sqrt', MathSqrtNode);
//# sourceMappingURL=sqrt.js.map