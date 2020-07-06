"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
class OrNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicSettingsExist = false;
        this.dynamicInputsType = node_1.Type.BOOLEAN;
        this.title = 'OR';
        this.description =
            "Performs a logical 'OR' operation (output 'true' when ANY input is 'true'). You can specify the number of inputs in the node settings.";
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.addOutput('out not', node_1.Type.BOOLEAN);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const allInputs = this.getDefinedInputValues();
        if (allInputs.length == 0) {
            this.setOutputData(0, false);
            this.setOutputData(1, true);
            return;
        }
        const anyTrue = allInputs.some(v => v == true);
        this.setOutputData(0, anyTrue);
        this.setOutputData(1, !anyTrue);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('boolean/or', OrNode);
//# sourceMappingURL=or.js.map