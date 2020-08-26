"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const flexible_node_1 = require("../../flexible-node");
class HubNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicSettingsExist = false;
        this.dynamicInputsType = node_1.Type.ANY;
        this.title = 'Hub';
        this.description =
            "This node merges multiple inputs into a single stream/output.  Any new 'input' ('in #') value will be passed to 'output'.  The number of inputs can be modified from settings.";
        this.addOutput('output', node_1.Type.ANY);
    }
    onAdded() {
        this.onInputUpdated();
        this.size = this.computeSize();
    }
    onInputUpdated() {
        const inputs = this.getInputsCount();
        for (let i = this.dynamicInputStartPosition; i < inputs; i++) {
            let inputValue = this.getInputData(i);
            if (utils_1.default.hasInput(inputValue)) {
                if (this.inputs[i].updated) {
                    this.setOutputData(0, this.inputs[i].data);
                    return;
                }
            }
        }
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('connection/hub', HubNode);
//# sourceMappingURL=hub.js.map