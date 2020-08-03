"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
class AddressHelperNumber extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicOutputsExist = true;
        this.dynamicInputsExist = false;
        this.dynamicSettingsExist = false;
        super.dynamicOutputsType = node_1.Type.NUMBER;
        this.title = 'Point Address Builder Number';
        this.description =
            "Numeric integer 'select' passes Numeric 'input' to the corresponding Numeric 'output'. If 'select' is 2, 'input' will be passed to 'out 2' (likewise for other integer 'select' values). If the 'select' value does not have a corresponding 'out #' value, no values will be passed. The number of outputs can be modified from settings.";
        this.addInput('input', node_1.Type.NUMBER);
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        if (typeof input === 'undefined')
            return;
        if (typeof input === 'number') {
            const len = this.getOutputsCount();
            for (let i = 0; i < len; i++) {
                this.setOutputData(i, i + input);
            }
        }
    }
}
exports.AddressHelperNumber = AddressHelperNumber;
container_1.Container.registerNodeType('point/address-helper-number', AddressHelperNumber);
//# sourceMappingURL=point-address-helper-num.js.map