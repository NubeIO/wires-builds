"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
class StringJoinNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsType = node_1.Type.STRING;
        super.dynamicInputsStartName = 'string';
        this.title = 'String Join';
        this.description =
            "This node takes String inputs and concatenates/joins them to produce a String 'output'.   The number of inputs can be modified from settings.";
        this.addOutput('out', node_1.Type.STRING);
        this.setOutputData(0, null);
    }
    onAdded() {
        this.size = this.computeSize();
        this.onInputUpdated();
    }
    onInputUpdated() {
        const inputs = this.getInputsCount();
        let output = '';
        for (let i = this.dynamicInputStartPosition; i < inputs; i++) {
            output = output.concat(this.getInputData(i));
        }
        this.setOutputData(0, output, true);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('string/string-join', StringJoinNode);
//# sourceMappingURL=string-join.js.map