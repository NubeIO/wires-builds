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
class MergeFunctionNode extends BaseFunctionNode {
    constructor() {
        super();
        this.title = 'Merge Function';
        this.description =
            'Evaluates a code block upon message reception. ' +
                'The incoming values is accessible by index in the array named "messages". ' +
                'The "return" value will be emitted through the outlet, unless that value is null.' +
                'The script runs every time any inlet receives a value.';
        this.addOutput('return value');
        this.addOutput('error');
        this.settings['inputs'] = { description: 'Inputs count', value: 2, type: node_1.SettingType.NUMBER };
        this.settings['script'] = {
            description: 'Function Code',
            value: '// the "messages" array contains inlet values by index\n' +
                'return messages.filter(v => v != null);',
            type: node_1.SettingType.CODE_AREA,
        };
        this.changeInputsCount(this.settings['inputs'].value);
    }
    onInputUpdated() {
        const messages = Object.keys(this.inputs).map(i => this.inputs[i].data);
        try {
            this.executeConfiguredScript({ messages })
                .then(result => this.emitResult(result))
                .catch(e => this.emitError(e));
        }
        catch (e) {
            this.emitError(e);
        }
    }
    onAfterSettingsChange() {
        const inputs_count = utils_1.default.clamp(this.settings['inputs'].value, 1, 1000);
        this.changeInputsCount(inputs_count);
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, { $set: { inputs: this.inputs } });
        this.onInputUpdated();
    }
}
exports.MergeFunctionNode = MergeFunctionNode;
container_1.Container.registerNodeType('custom-function/merge-function', MergeFunctionNode);
//# sourceMappingURL=merge-function.js.map