"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
class AddNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsType = node_1.Type.NUMBER;
        this.title = 'Add';
        this.description =
            "('output' = 'in 1' + 'in 2' + ...) 'output' is the result of adding of all Numeric inputs. Input values can be set from settings. The number of inputs is configurable from settings.";
        this.addOutput('output', node_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const inputCount = this.getInputsCount();
        let total = 0;
        for (let i = this.dynamicInputStartPosition; i < inputCount; i++) {
            total = total + this.getInputData(i);
        }
        this.setOutputData(0, total);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('math/add', AddNode);
//# sourceMappingURL=add.js.map