"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
var JsonParseType;
(function (JsonParseType) {
    JsonParseType["Stringify"] = "Stringify";
    JsonParseType["Parse"] = "Parse";
})(JsonParseType = exports.JsonParseType || (exports.JsonParseType = {}));
class JsonParse extends node_1.Node {
    constructor() {
        super();
        this.out = 0;
        this.outValidJson = 1;
        this.outValidJsonAfterParse = 2;
        this.error = 3;
        this.title = 'Json Parse';
        this.description = 'Return JSON.stringify or a JSON.parse';
        this.addInput('input');
        this.addOutput('output');
        this.addOutput('is valid json');
        this.addOutput('is valid json after parse');
        this.addOutput('error', node_1.Type.STRING);
        this.settings['operation'] = {
            description: 'Output type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: JsonParseType.Stringify, text: JsonParseType.Stringify },
                    { value: JsonParseType.Parse, text: JsonParseType.Parse },
                ],
            },
            value: JsonParseType.Stringify,
        };
    }
    isJsonString(str) {
        try {
            JSON.parse(str);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        let checkJson = this.isJsonString(input);
        let out = this.out;
        let outValidJson = this.outValidJson;
        let outValidJsonAfterParse = this.outValidJsonAfterParse;
        let error = this.error;
        this.setOutputData(outValidJson, checkJson);
        this.setOutputData(error, null);
        if (input === null) {
            this.setOutputData(out, null);
            this.setOutputData(outValidJson, null);
            this.setOutputData(outValidJsonAfterParse, null);
            this.setOutputData(error, null);
            return;
        }
        const operation = this.settings['operation'].value;
        try {
            input = JSON.parse(input);
            if (operation === JsonParseType.Stringify) {
                let outStringify = JSON.stringify(input);
                checkJson = this.isJsonString(outStringify);
                this.setOutputData(out, outStringify);
                this.setOutputData(outValidJsonAfterParse, checkJson);
            }
            else if (operation === JsonParseType.Parse) {
                checkJson = this.isJsonString(input);
                this.setOutputData(out, input);
                this.setOutputData(outValidJsonAfterParse, checkJson);
            }
            this.setOutputData(error, null);
        }
        catch (e) {
            this.setOutputData(out, null);
            this.setOutputData(outValidJson, null);
            this.setOutputData(outValidJsonAfterParse, null);
            this.setOutputData(error, e);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('json/json-parse', JsonParse);
//# sourceMappingURL=json-parse.js.map