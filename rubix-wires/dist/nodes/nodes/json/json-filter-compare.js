"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const string_json_compare_utils_1 = require("../../utils/string-json-compare-utils");
var compareType;
(function (compareType) {
    compareType["Equals"] = "Equals";
    compareType["NotEquals"] = "Not Equal";
    compareType["GreaterThanEqual"] = "Greater Than Equal";
    compareType["GreaterThan"] = "Greater Than";
    compareType["LessThanEqual"] = "Less Than Equal";
    compareType["LessThan"] = "Less Than";
    compareType["Includes"] = "Includes";
    compareType["startsWith"] = "Starts With";
    compareType["endsWith"] = "Ends With";
})(compareType || (compareType = {}));
class JsonFilterCompare extends node_1.Node {
    constructor() {
        super();
        this.title = 'Json Filter';
        this.description =
            "This node provides several functions to compare a JSON object input, with a Boolean 'output'.  Available comparison functions are: Equals, Includes, Starts With, and Ends With.  The comparison function is selected from settings.";
        this.addInput('input', node_io_1.Type.STRING);
        this.addInputWithSettings('comparison-to', node_io_1.Type.STRING, '', 'Comparison Value');
        this.addOutput('output', node_io_1.Type.STRING);
        this.addOutput('output-key', node_io_1.Type.STRING);
        this.addOutput('match', node_io_1.Type.BOOLEAN);
        this.settings['filter'] = {
            description: 'Example: msg.myKey',
            value: 'myKey',
            type: node_1.SettingType.STRING,
        };
        this.settings['function'] = {
            description: 'Comparison Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: compareType.Equals, text: compareType.Equals },
                    { value: compareType.NotEquals, text: compareType.NotEquals },
                    { value: compareType.GreaterThanEqual, text: compareType.GreaterThanEqual },
                    { value: compareType.GreaterThan, text: compareType.GreaterThan },
                    { value: compareType.LessThanEqual, text: compareType.LessThanEqual },
                    { value: compareType.LessThan, text: compareType.LessThan },
                    { value: compareType.Includes, text: compareType.Includes },
                    { value: compareType.startsWith, text: compareType.startsWith },
                    { value: compareType.endsWith, text: compareType.endsWith },
                ],
            },
            value: compareType.Equals,
        };
        this.settings['isNumber'] = {
            description: 'Comparison value is a number',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['passNull'] = {
            description: 'Send null if not a match',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        const input = this.getInputData(0);
        if (input === null || input === undefined) {
            this.setOutputData(0, null);
            this.setOutputData(1, null);
            this.setOutputData(2, null);
            return;
        }
        try {
            const jsonCheck = JSON.parse(input);
            const filter = this.settings['filter'].value;
            let out = string_json_compare_utils_1.default.findVal(jsonCheck, filter);
            const string2 = this.getInputData(1);
            if (string_json_compare_utils_1.default.compare(this, out.value, string2)) {
                this.setOutputData(0, out.value);
                this.setOutputData(1, out.valueWithKey);
                this.setOutputData(2, true);
            }
            else if (this.settings['passNull'].value === true) {
                this.setOutputData(0, null);
                this.setOutputData(1, null);
                this.setOutputData(2, false);
            }
            else
                this.setOutputData(2, false);
        }
        catch (e) {
            this.setOutputData(0, null);
            this.setOutputData(1, null);
            this.setOutputData(2, true);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
        const inputType = this.settings['function'].value;
        const title = "Json Comparison";
        this.title = `${title} Compare (${inputType})`;
        this.broadcastTitleToClients();
    }
}
container_1.Container.registerNodeType('json/json-filter-compare', JsonFilterCompare);
//# sourceMappingURL=json-filter-compare.js.map