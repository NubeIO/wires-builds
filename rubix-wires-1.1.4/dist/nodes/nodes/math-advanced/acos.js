"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class MathAcosNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Acos';
        this.description =
            "'acos(x)' is the result of arccos('x').  The Inverse Cosine function of input 'x'.";
        this.addInput('x', node_1.Type.NUMBER);
        this.addOutput('acos(x)', node_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, Math.acos(val));
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('math-advanced/acos', MathAcosNode);
//# sourceMappingURL=acos.js.map