"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class FiltersOnlyEqualNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Only Equal';
        this.description =
            "This node filters 'input' values.  Only 'input' values equal to 'match' are passed to 'output'.";
        this.addInput('input', node_io_1.Type.ANY);
        this.addInputWithSettings('match', node_io_1.Type.ANY, 0, 'match');
        this.addOutput('output', node_io_1.Type.ANY);
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        let match = this.getInputData(1);
        if ((val || '').toString() === (match || '').toString())
            this.setOutputData(0, val);
    }
}
container_1.Container.registerNodeType('filter/only-equal', FiltersOnlyEqualNode);
//# sourceMappingURL=only-equal.js.map