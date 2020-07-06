"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class MathSinNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Sin';
        this.description = "'sin(x)' is the result of sin('x').  The Sine function of input 'x'.";
        this.addInput('x', node_1.Type.NUMBER);
        this.addOutput('sin(x)', node_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, Math.sin(val));
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('math-advanced/sin', MathSinNode);
//# sourceMappingURL=sin.js.map