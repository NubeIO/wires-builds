"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const base_function_node_1 = require("./base-function-node");
class FunctionNode extends base_function_node_1.BaseFunctionNode {
    constructor() {
        super('Function', 'Evaluates a code block upon message reception. ' +
            'The incoming value is accessible through the variable named "message". ' +
            'The "return" value will be emitted through the outlet. Null values are ignored.');
        this.mixinScriptSetting('// message is the received value\nreturn message;');
    }
    getScriptInput() {
        return this.getInputData(0);
    }
}
exports.FunctionNode = FunctionNode;
container_1.Container.registerNodeType('custom-function/function', FunctionNode);
//# sourceMappingURL=function.js.map