"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const flexible_node_1 = require("../../flexible-node");
class AnyPriorityNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicSettingsExist = false;
        this.title = 'Any Priority Node';
        this.description = 'The highest priority non-null input is passed to output';
        this.addOutput('output', node_1.Type.NUMBER);
        this.settings['type'] = {
            description: 'Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: node_1.Type.STRING, text: node_1.Type.STRING },
                    { value: node_1.Type.NUMBER, text: node_1.Type.NUMBER },
                    { value: node_1.Type.BOOLEAN, text: node_1.Type.BOOLEAN },
                ],
            },
            value: node_1.Type.NUMBER,
        };
    }
    init() {
        super.init();
        this.dynamicInputsType = node_1.convertStringToType(this.settings[this.dynamicOutputsField].value);
    }
    onInputUpdated() {
        for (let i = 0; i < this.getInputsCount(); i++) {
            const inputValue = this.getInputData(i);
            if (inputValue != null && inputValue != '') {
                this.setOutputData(0, inputValue, true);
                return;
            }
        }
        this.setOutputData(0, null, true);
    }
    onAfterSettingsChange() {
        const type = this.settings['type'].value;
        for (let i = 0; i < this.getInputsCount(); i++) {
            this.inputs[i].type = type;
            this.inputs[i].data = utils_1.default.parseValue(this.getInputData(i), type);
        }
        this.outputs[0].type = type;
        this.outputs[0].data = utils_1.default.parseValue(this.outputs[0].data, type);
        this.dynamicInputsType = node_1.convertStringToType(this.settings['type'].value);
        super.onAfterSettingsChange();
    }
}
container_1.Container.registerNodeType('point/any-writable', AnyPriorityNode);
//# sourceMappingURL=any-writable.js.map