"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class MathFloorNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Floor';
        this.description = "'output' is the 'input' value rounded DOWN to the nearest integer.";
        this.addInput('input', node_1.Type.NUMBER);
        this.addOutput('output', node_1.Type.NUMBER);
    }
    onInputUpdated() {
        this.emitTransformedInput(x => Math.floor(x));
    }
}
container_1.Container.registerNodeType('num-transform/floor', MathFloorNode);
//# sourceMappingURL=floor.js.map