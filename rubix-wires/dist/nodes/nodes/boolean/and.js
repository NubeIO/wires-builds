"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
const node_io_1 = require("../../node-io");
class AndNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicSettingsExist = false;
        this.dynamicInputsType = node_io_1.Type.BOOLEAN;
        this.title = 'AND';
        this.description =
            "Performs a logical 'AND' operation (output 'true' when ALL inputs are 'true'). You can specify the number of inputs in the node settings.";
        this.addOutput('output', node_io_1.Type.BOOLEAN);
        this.addOutput('out not', node_io_1.Type.BOOLEAN);
        this.setOutputData(0, false);
        this.setOutputData(1, true);
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
        const areAllInputsTrue = allInputs.every(v => v === true);
        this.setOutputData(0, areAllInputsTrue);
        this.setOutputData(1, !areAllInputsTrue);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('boolean/and', AndNode);
//# sourceMappingURL=and.js.map