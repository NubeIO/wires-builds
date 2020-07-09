"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
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
class FunctionNode extends BaseFunctionNode {
    constructor() {
        super();
        this.title = 'Function';
        this.description =
            'Evaluates a code block upon message reception. ' +
                'The incoming value is accessible through the variable named "message". ' +
                'The "return" value will be emitted through the outlet. Null values are ignored.';
        this.addInput('message');
        this.addOutput('return value');
        this.addOutput('error');
        this.settings['script'] = {
            description: 'Function Code',
            value: '// message is the received value\n' + 'return message;',
            type: node_1.SettingType.CODE_AREA,
        };
    }
    onInputUpdated() {
        const message = this.getInputData(0);
        try {
            this.executeConfiguredScript({ message })
                .then(result => this.emitResult(result))
                .catch(e => this.emitError(e));
        }
        catch (e) {
            this.emitError(e);
        }
    }
}
exports.FunctionNode = FunctionNode;
container_1.Container.registerNodeType('custom-function/function', FunctionNode);
//# sourceMappingURL=function.js.map