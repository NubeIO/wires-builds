"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flexible_node_1 = require("../../flexible-node");
const node_io_1 = require("../../node-io");
class Statistics extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsType = node_io_1.Type.NUMBER;
    }
    onAdded() {
        this.size = this.computeSize();
        this.onInputUpdated();
    }
    onInputUpdated() { }
    getDefinedInputsOrSettingsValues() {
        const output = [];
        for (let i = 0; i < this.getInputsCount(); i++) {
            const input = this.getInputData(i);
            if (input != null) {
                output.push(input);
            }
        }
        return output;
    }
}
exports.default = Statistics;
//# sourceMappingURL=statistics.js.map