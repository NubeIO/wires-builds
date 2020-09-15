"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const helper_1 = require("../../../utils/helper");
class FiltersPreventNullNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Prevent Null';
        this.description = "This node filters 'input' values.  All 'input' values are passed to 'output' EXCEPT 'null'.";
        this.addInput('input');
        this.addOutput('output');
        this.properties['value'];
    }
    onAdded() {
        this.setOutputData(0, this.properties['value']);
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (helper_1.isNotNull(val) && val !== '') {
            this.setOutputData(0, val);
            this.properties['value'] = val;
            this.persistProperties(false, true);
        }
    }
}
container_1.Container.registerNodeType('filter/prevent-null', FiltersPreventNullNode);
//# sourceMappingURL=prevent-null.js.map