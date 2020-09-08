"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const jsonata = require('jsonata');
class JsonQueryNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Json Query (JSONata)';
        this.description = 'Filter a json data using JSONata http://docs.jsonata.org/overview';
        this.addInput('input', node_io_1.Type.STRING);
        this.addInputWithSettings('query', node_io_1.Type.STRING, '$', 'Query', false);
        this.addOutput('output', node_io_1.Type.STRING);
        this.addOutput('error', node_io_1.Type.STRING);
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        let queryInput = this.getInputData(1);
        try {
            input = JSON.parse(input);
            let expression = jsonata(queryInput);
            let result = expression.evaluate(input);
            this.setOutputData(0, result);
            this.setOutputData(1, null);
        }
        catch (e) {
            this.setOutputData(0, null);
            this.setOutputData(1, e);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('json/json-query', JsonQueryNode);
//# sourceMappingURL=json-query.js.map