"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const string_json_compare_utils_1 = require("../../utils/string-json-compare-utils");
class JsonFilter extends node_1.Node {
    constructor() {
        super();
        this.title = 'Json Filter';
        this.description = 'Filter a json object Example: msg.myKey';
        this.addInput('input', node_1.Type.STRING);
        this.addOutput('output', node_1.Type.STRING);
        this.addOutput('output-key', node_1.Type.STRING);
        this.settings['filter'] = {
            description: 'Example: msg.myKey',
            value: 'myKey',
            type: node_1.SettingType.STRING,
        };
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        if (input === null) {
            this.setOutputData(0, null);
            this.setOutputData(1, null);
            return;
        }
        try {
            const jsonCheck = JSON.parse(input);
            const filter = this.settings['filter'].value;
            let out = string_json_compare_utils_1.default.findVal(jsonCheck, filter);
            this.setOutputData(0, out.value);
            this.setOutputData(1, out.valueWithKey);
        }
        catch (e) {
            this.setOutputData(0, null);
            this.setOutputData(1, null);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('json/json-filter', JsonFilter);
//# sourceMappingURL=json-filter.js.map