"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class MathCosNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Cos';
        this.description = "'cos(x)' is the result of cos('x').  The Cosine function of input 'x'.";
        this.addInput('x', node_1.Type.NUMBER);
        this.addOutput('cos(x)', node_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, Math.cos(val));
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('math-advanced/cos', MathCosNode);
//# sourceMappingURL=cos.js.map