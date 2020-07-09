"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class FiltersPreventDuplicatesNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Prevent Duplicates';
        this.description =
            "This node filters 'input' values.  All 'input' values are passed to 'output' EXCEPT 'input' values which are equal to the previous 'input' value.";
        this.addInput('input');
        this.addOutput('output');
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val === '')
            val = null;
        if (this.lastVal == val)
            return;
        this.lastVal = val;
        this.setOutputData(0, val, true);
    }
}
container_1.Container.registerNodeType('filter/prevent-duplicates', FiltersPreventDuplicatesNode);
//# sourceMappingURL=prevent-duplicates.js.map