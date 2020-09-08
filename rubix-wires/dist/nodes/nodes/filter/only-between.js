"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class FiltersOnlyFromRangeNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Only Between';
        this.description =
            "This node filters 'input' values.  Only Numeric 'input' values between 'min' and 'max' are passed to 'output'.";
        this.addInput('value', node_io_1.Type.NUMBER);
        this.addInputWithSettings('min', node_io_1.Type.NUMBER, 0, 'min', false);
        this.addInputWithSettings('max', node_io_1.Type.NUMBER, 10, 'max', false);
        this.addOutput('value', node_io_1.Type.NUMBER);
    }
    onInputUpdated() {
        const val = this.getInputData(0);
        const min = this.getInputData(1);
        const max = this.getInputData(2);
        if (val == null || min == null || max == null) {
            this.setOutputData(0, null);
        }
        else if (val >= min && val <= max)
            this.setOutputData(0, val);
    }
}
container_1.Container.registerNodeType('filter/only-between', FiltersOnlyFromRangeNode);
//# sourceMappingURL=only-between.js.map