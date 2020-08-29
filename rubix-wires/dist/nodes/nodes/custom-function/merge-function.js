"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_1 = require("../../node");
const utils_1 = require("../../utils");
const base_function_node_1 = require("./base-function-node");
class MergeFunctionNode extends base_function_node_1.BaseFunctionNode {
    constructor() {
        super('Merge Function', 'Evaluates a code block upon message reception. ' +
            'The incoming values is accessible by index in the array named "messages". ' +
            'The "return" value will be emitted through the outlet, unless that value is null.' +
            'The script runs every time any inlet receives a value.');
        this.settings['inputs'] = { description: 'Inputs count', value: 2, type: node_1.SettingType.NUMBER };
        this.mixinScriptSetting('// the "messages" array contains inlet values by index\n' +
            'return messages.filter(v => v != null);');
        this.changeInputsCount(this.settings['inputs'].value);
    }
    onAfterSettingsChange() {
        const inputs_count = utils_1.default.clamp(this.settings['inputs'].value, 1, 1000);
        this.changeInputsCount(inputs_count);
        if (this.container.db) {
            this.container.db.updateNode(this.id, this.container.id, { $set: { inputs: this.inputs } });
        }
        this.onInputUpdated();
    }
    getScriptInput() {
        return Object.keys(this.inputs).map(i => this.inputs[i].data);
    }
}
exports.MergeFunctionNode = MergeFunctionNode;
container_1.Container.registerNodeType('custom-function/merge-function', MergeFunctionNode);
//# sourceMappingURL=merge-function.js.map