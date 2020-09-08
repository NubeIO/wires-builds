"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class MathAtanNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Atan';
        this.description =
            "'atan(x)' is the result of arctan('x').  The Inverse Tangent function of input 'x'.";
        this.addInput('x', node_io_1.Type.NUMBER);
        this.addOutput('atan(x)', node_io_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, Math.atan(val));
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('math-advanced/atan', MathAtanNode);
//# sourceMappingURL=atan.js.map