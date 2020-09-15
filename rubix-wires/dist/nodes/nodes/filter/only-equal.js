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
        this.addInputWithSettings('match', node_io_1.Type.ANY, '', 'Match Value');
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
        if (val == 'false')
            val = false;
        else if (val == 'true')
            val = true;
        let match = (this.getInputData(1) || '').toString();
        if (match == 'false')
            match = false;
        else if (match == 'true')
            match = true;
        if (val == match) {
            this.setOutputData(0, val);
            this.properties['value'] = val;
            this.persistProperties(false, true);
        }
    }
}
container_1.Container.registerNodeType('filter/only-equal', FiltersOnlyEqualNode);
//# sourceMappingURL=only-equal.js.map