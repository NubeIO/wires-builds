"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class FiltersOnlyTrueNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Only True';
        this.description =
            "This node filters 'input' values.  Only 'true' values are passed to 'output'.";
        this.addInput('input', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.BOOLEAN);
    }
    onInputUpdated() {
        if (this.getInputData(0) === true)
            this.setOutputData(0, true);
    }
}
container_1.Container.registerNodeType('filter/only-true', FiltersOnlyTrueNode);
//# sourceMappingURL=only-true.js.map