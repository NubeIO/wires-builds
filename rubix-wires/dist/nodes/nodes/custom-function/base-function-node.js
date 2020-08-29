"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vm2_1 = require("vm2");
const helper_1 = require("../../../utils/helper");
const container_1 = require("../../container");
const node_1 = require("../../node");
class BaseFunctionNode extends node_1.Node {
    constructor(title, description) {
        super();
        this.title = title;
        this.description = description;
        this.addInput('message');
        this.addOutput('output');
        this.addOutput('error');
    }
    onCreated() {
    }
    onAdded() {
    }
    onInputUpdated() {
        try {
            this.executeConfiguredScript(this.getScriptInput())
                .then(result => this.emitResult(result))
                .catch(e => this.emitError(e));
        }
        catch (e) {
            this.emitError(e);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
    executeConfiguredScript(...variables) {
        const code = this.settings['script'].value;
        if (this.side !== container_1.Side.server || helper_1.isEmpty(code))
            return;
        const vm = new vm2_1.NodeVM({ timeout: 1000, sandbox: {} });
        let func = vm.run(`module.exports = function(message, ...args) {\n${code}\n};`);
        return Promise.resolve(func(...variables));
    }
    emitResult(result) {
        this.setOutputData(0, result);
        this.setOutputData(1, null);
    }
    emitError(error) {
        this.setOutputData(0, null);
        this.debugErr(`Error when executing function node ${error.stack}`);
        this.setOutputData(1, error);
    }
    mixinScriptSetting(defaultScript) {
        this.settings['script'] = { description: 'Function Code', value: defaultScript, type: node_1.SettingType.CODE_AREA };
    }
}
exports.BaseFunctionNode = BaseFunctionNode;
//# sourceMappingURL=base-function-node.js.map