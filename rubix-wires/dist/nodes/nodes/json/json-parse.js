"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const helper_1 = require("../../../utils/helper");
class JsonParse extends node_1.Node {
    constructor() {
        super();
        this.title = 'Json Parse';
        this.description = 'Return JSON.stringify or a JSON.parse';
        this.addInput('json-input', node_io_1.Type.JSON);
        this.addOutput('output', node_io_1.Type.JSON);
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        if (helper_1.isNull(input))
            return;
        try {
            this.setOutputData(0, input);
        }
        catch (err) {
            this.debugInfo(`JSON PARSE: try/catch , ${err}`);
        }
        ;
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('json/json-parse', JsonParse);
//# sourceMappingURL=json-parse.js.map