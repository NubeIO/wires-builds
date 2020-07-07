"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class FiltersOnlyFalseNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Only False';
        this.description =
            "This node filters 'input' values.  Only 'false' values are passed to 'output'.";
        this.addInput('input', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.BOOLEAN);
    }
    onInputUpdated() {
        if (this.getInputData(0) === false)
            this.setOutputData(0, false);
    }
}
container_1.Container.registerNodeType('filter/only-false', FiltersOnlyFalseNode);
//# sourceMappingURL=only-false.js.map