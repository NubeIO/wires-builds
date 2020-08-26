"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const flexible_node_1 = require("../../../flexible-node");
class MQTTTopicBuilderNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsType = node_1.Type.STRING;
        super.dynamicInputsStartName = 'string';
        this.title = 'MQTT Topic Builder';
        this.description =
            "This node takes String inputs and concatenates/joins them with '/' to produce an MQTT Topic 'output'.   The number of inputs can be modified from settings.";
        this.addOutput('output', node_1.Type.STRING);
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
            if (i !== (inputs - 1))
                output = output.concat('/');
        }
        this.setOutputData(0, output, true);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('protocols/mqtt/topic-builder', MQTTTopicBuilderNode);
//# sourceMappingURL=topic-builder.js.map