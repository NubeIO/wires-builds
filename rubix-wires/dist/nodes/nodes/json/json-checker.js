"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class JsonCheckerNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'JSON Checker';
        this.description = `Checks 'input' for valid JSON format string.`;
        this.addInput('input', node_1.Type.STRING);
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.addOutput('msg', node_1.Type.STRING);
    }
    onAdded() {
        this.onInputUpdated();
    }
    isJson(item) {
        item = typeof item !== 'string' ? JSON.stringify(item) : item;
        try {
            item = JSON.parse(item);
        }
        catch (e) {
            return false;
        }
        if (typeof item === 'object' && item !== null) {
            return true;
        }
        return false;
    }
    onInputUpdated() {
        const val = this.getInputData(0);
        try {
            if (this.isJson(val)) {
                this.setOutputData(0, true);
                this.setOutputData(1, 'valid JSON');
            }
            else {
                this.setOutputData(0, false);
                this.setOutputData(1, 'invalid JSON');
            }
        }
        catch (err) {
            this.setOutputData(0, false);
            this.setOutputData(1, err);
        }
    }
}
container_1.Container.registerNodeType('json/json-checker', JsonCheckerNode);
//# sourceMappingURL=json-checker.js.map