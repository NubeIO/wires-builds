"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class JsonFilter extends node_1.Node {
    constructor() {
        super();
        this.title = 'Json Filter';
        this.description = 'Filter a json object Example: msg.myKey';
        this.addInput('input', node_1.Type.STRING);
        this.addOutput('output', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
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
        function findVal(object, key) {
            let value = null;
            Object.keys(object).some(function (k) {
                if (k === key) {
                    value = object[k];
                    return true;
                }
                if (object[k] && typeof object[k] === 'object') {
                    value = findVal(object[k], key);
                    return value !== undefined;
                }
            });
            return value;
        }
        try {
            input = JSON.parse(input);
            const filter = this.settings['filter'].value;
            let out = findVal(input, filter);
            this.setOutputData(0, out);
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
container_1.Container.registerNodeType('json/json-filter', JsonFilter);
//# sourceMappingURL=json-filter.js.map