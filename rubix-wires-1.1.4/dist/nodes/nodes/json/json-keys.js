"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class JsonFilter extends node_1.Node {
    constructor() {
        super();
        this.title = 'Json Keys';
        this.description = 'Return json object values. Example: Object.keys(in)';
        this.addInput('input', node_1.Type.STRING);
        this.addOutput('keys out', node_1.Type.STRING);
        this.addOutput('values out', node_1.Type.STRING);
        this.addOutput('entries out', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        if (input === null) {
            this.setOutputData(0, null);
            this.setOutputData(1, null);
            this.setOutputData(2, null);
            this.setOutputData(3, null);
            return;
        }
        try {
            input = JSON.parse(input);
            this.setOutputData(0, Object.keys(input));
            this.setOutputData(1, Object.values(input));
            this.setOutputData(2, Object.entries(input));
            this.setOutputData(3, null);
        }
        catch (e) {
            this.setOutputData(0, null);
            this.setOutputData(1, null);
            this.setOutputData(2, null);
            this.setOutputData(3, e);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('json/json-keys', JsonFilter);
//# sourceMappingURL=json-keys.js.map