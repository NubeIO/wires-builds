"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class FiltersOnlyGreaterNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Only Greater';
        this.description =
            "This node filters 'input' values.  Only Numeric 'input' values greater than 'threshold' are passed to 'output'.";
        this.addInput('input', node_1.Type.NUMBER);
        this.addInputWithSettings('threshold', node_1.Type.NUMBER, 0, 'threshold', false);
        this.addOutput('output', node_1.Type.NUMBER);
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        let threshold = this.getInputData(1);
        if (val == null || threshold == null) {
            this.setOutputData(0, null);
        }
        else if (val > threshold)
            this.setOutputData(0, val);
    }
}
container_1.Container.registerNodeType('filter/only-greater', FiltersOnlyGreaterNode);
//# sourceMappingURL=only-greater.js.map