"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_1 = require("../../node");
const utils_1 = require("../../utils");
const base_function_node_1 = require("./base-function-node");
class FanOutFunctionNode extends base_function_node_1.BaseFunctionNode {
    constructor() {
        super('Fan-Out Function', 'Evaluates a code block upon message reception, and sends results to multiple outputs. ' +
            'The incoming value is accessible through the variable named "message". ' +
            'Values can be emitted by using emit(index, value), where the index specifies the outlet. ' +
            'Emit can be called multiple times.');
        this.error_node_name = 'error';
        this.mixinScriptSetting('// message is the received value\n' +
            '// use emit(index, value) to push\n' +
            'emit(0, message);');
        this.settings['outputs'] = { description: 'Output count', value: 2, type: node_1.SettingType.NUMBER };
        this.changeValueOutputCount(this.settings['outputs'].value);
    }
    emitError(error) {
        this.setOutputData(this.getHighestOutputId(), error.stack);
    }
    onAfterSettingsChange() {
        const output_count = utils_1.default.clamp(this.settings['outputs'].value, 1, 1000);
        this.changeValueOutputCount(output_count);
        if (this.container.db) {
            this.container.db.updateNode(this.id, this.container.id, { $set: { outputs: this.outputs } });
        }
        this.onInputUpdated();
    }
    getScriptInput() {
        const message = this.getInputData(0);
        return {
            message, emit: (index, value) => {
                Promise.resolve(value).then(value => this.setOutputData(index, value));
            },
        };
    }
    changeValueOutputCount(count) {
        const error_index = this.getHighestOutputId();
        const error_links = (this.outputs[error_index].links || []).map(link => (Object.assign({}, link)));
        this.removeOutput(error_index);
        const outlets_to_add = count - Object.keys(this.outputs).length;
        const outlets_to_remove = -outlets_to_add;
        this.addOutletCount(outlets_to_add);
        this.removeOutletCount(outlets_to_remove);
        this.addOutput('error');
        error_links.forEach(link => {
            this.connect(this.getHighestOutputId(), link.target_node_id, link.target_slot);
        });
    }
    addOutletCount(count) {
        for (let i = 0; i < count; i += 1) {
            this.addOutput('NodeHelp.vue ' + this.getFreeOutputId());
        }
    }
    removeOutletCount(count) {
        for (let i = 0; i < count; i += 1) {
            this.removeOutput(this.getHighestOutputId());
        }
    }
    getHighestOutputId() {
        return Object.keys(this.outputs)
            .map(v => parseInt(v))
            .sort((a, b) => b - a)[0];
    }
}
exports.FanOutFunctionNode = FanOutFunctionNode;
container_1.Container.registerNodeType('custom-function/fan-out-function', FanOutFunctionNode);
//# sourceMappingURL=fan-out-function.js.map