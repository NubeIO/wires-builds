"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class FiltersPreventEqualNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Prevent Equal';
        this.description =
            "This node filters 'input' values.  All 'input' values are passed to 'output' EXCEPT 'input' values which are equal to 'match'.";
        this.addInput('input', node_io_1.Type.ANY);
        this.addInputWithSettings('match', node_io_1.Type.ANY, null, 'Match Value');
        this.addOutput('output', node_io_1.Type.ANY);
        this.properties['value'];
    }
    onAdded() {
        this.setOutputData(0, this.properties['value']);
        this.onInputUpdated();
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        val = (val || '').toString();
        let match = (this.getInputData(1) || '').toString();
        if (match == 'false')
            match = false;
        else if (match == 'true')
            match = true;
        if (val != match) {
            this.setOutputData(0, val);
            this.properties['value'] = val;
            this.persistProperties(false, true);
        }
    }
}
container_1.Container.registerNodeType('filter/prevent-equal', FiltersPreventEqualNode);
//# sourceMappingURL=prevent-equal.js.map