"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class FiltersPreventEqualNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Prevent Equal';
        this.description =
            "This node filters 'input' values.  All 'input' values are passed to 'output' EXCEPT 'input' values which are equal to 'match'.";
        this.addInput('input');
        this.addInput('[match]');
        this.addOutput('output');
        this.settings['match'] = { description: 'match', value: 0, type: node_1.SettingType.NUMBER };
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val === '')
            val = null;
        let match = this.getInputData(1);
        if (match === undefined)
            match = this.settings['match'].value;
        if (match == '')
            match = null;
        else if (match == 'false')
            match = false;
        else if (match == 'true')
            match = true;
        if (val != match)
            this.setOutputData(0, val);
    }
}
container_1.Container.registerNodeType('filter/prevent-equal', FiltersPreventEqualNode);
//# sourceMappingURL=prevent-equal.js.map