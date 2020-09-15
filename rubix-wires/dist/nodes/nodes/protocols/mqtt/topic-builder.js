"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../../container");
const flexible_node_1 = require("../../../flexible-node");
const node_io_1 = require("../../../node-io");
class MQTTTopicBuilderNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsType = node_io_1.Type.STRING;
        super.dynamicInputsStartName = 'string';
        this.title = 'MQTT Topic Builder';
        this.description =
            "This node takes String inputs and concatenates/joins them with '/' to produce an MQTT Topic 'output'.   The number of inputs can be modified from settings.";
        this.addOutput('output', node_io_1.Type.STRING);
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
            const value = (this.getInputData(i) || '').toString();
            if (value != '') {
                if (output != '')
                    output = output.concat('/');
                output = output.concat(value);
            }
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