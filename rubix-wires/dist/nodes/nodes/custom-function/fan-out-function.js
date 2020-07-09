"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const vm = require("vm");
class BaseFunctionNode extends node_1.Node {
    constructor() {
        super();
        this.settings['script'] = {
            description: 'Function Code',
            value: 'return null;',
            type: node_1.SettingType.CODE_AREA,
        };
    }
    executeConfiguredScript(variables) {
        if (this.side != container_1.Side.server)
            return;
        const code = this.settings['script'].value;
        if (!code)
            return;
        const context = vm.createContext(Object.assign(Object.assign(Object.assign({}, variables), require('timers')), { require: m => eval('require')(m) }));
        const script = new vm.Script(`(() => {\n${code}\n})();`, { filename: 'function-node' });
        return Promise.resolve(script.runInContext(context));
    }
    emitResult(result) {
        this.setOutputData(0, result);
        this.setOutputData(1, null);
    }
    emitError(error) {
        this.setOutputData(0, null);
        this.setOutputData(1, error.stack);
    }
    onCreated() { }
    onAdded() { }
    onAfterSettingsChange() { }
}
class FanOutFunctionNode extends BaseFunctionNode {
    constructor() {
        super();
        this.error_node_name = 'error';
        this.title = 'Fan-Out Function';
        this.description =
            'Evaluates a code block upon message reception, and sends results to multiple outputs. ' +
                'The incoming value is accessible through the variable named "message". ' +
                'Values can be emmitted by using emit(index, value), where the index specifies the outlet. ' +
                'Emit can be called multiple times.';
        this.settings['outputs'] = { description: 'Output count', value: 2, type: node_1.SettingType.NUMBER };
        this.settings['script'] = {
            description: 'Function Code',
            value: '// message is the received value\n' +
                '// use emit(index, value) to push\n' +
                'emit(0, message);',
            type: node_1.SettingType.CODE_AREA,
        };
        this.addInput('message');
        this.addOutput('error');
        this.changeValueOutputCount(this.settings['outputs'].value);
    }
    onInputUpdated() {
        const message = this.getInputData(0);
        try {
            const emit = (index, value) => {
                Promise.resolve(value).then(value => this.setOutputData(index, value));
            };
            this.executeConfiguredScript({ message, emit });
        }
        catch (e) {
            this.emitError(e);
        }
    }
    emitError(error) {
        this.setOutputData(this.getHighestOutputId(), error.stack);
    }
    onAfterSettingsChange() {
        const output_count = utils_1.default.clamp(this.settings['outputs'].value, 1, 1000);
        this.changeValueOutputCount(output_count);
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, { $set: { outputs: this.outputs } });
        this.onInputUpdated();
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