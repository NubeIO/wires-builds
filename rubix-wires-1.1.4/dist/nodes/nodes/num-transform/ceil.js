"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class MathCeilNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Ceil';
        this.description = "'output' is the 'input' value rounded UP to the nearest integer.";
        this.addInput('input', node_1.Type.NUMBER);
        this.addOutput('output', node_1.Type.NUMBER);
    }
    onInputUpdated() {
        this.emitTransformedInput(x => Math.ceil(x));
    }
}
container_1.Container.registerNodeType('num-transform/ceil', MathCeilNode);
//# sourceMappingURL=ceil.js.map