"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
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
class StringCompareNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'String Compare';
        this.description =
            "This node provides several functions to compare 2 String inputs, with a Boolean 'output'.  Available comparison functions are: Equals, Includes, Starts With, and Ends With.  The comparison function is selected from settings.";
        this.addInput('input', node_io_1.Type.STRING);
        this.addInputWithSettings('comparison-to', node_io_1.Type.STRING, '', 'Comparison Value');
        this.addOutput('match', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.BOOLEAN);
        this.setOutputData(0, null);
        this.setOutputData(1, null);
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
        this.settings['null'] = {
            description: 'Block null messages on input',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const string1 = this.getInputData(0);
        const string2 = this.getInputData(1);
        const resetToNull = this.settings['null'].value;
        if (!utils_1.default.hasInput(string1)) {
            this.setOutputData(0, null, true);
            return;
        }
        if (string1 === null && !resetToNull) {
            return;
        }
        const out = string_json_compare_utils_1.default.compare(this, string1, string2);
        if (out) {
            this.setOutputData(0, true);
            this.setOutputData(1, string1);
        }
        else if (this.settings['passNull'].value === true) {
            this.setOutputData(0, null);
            this.setOutputData(1, null);
        }
        else {
            this.setOutputData(0, false);
            this.setOutputData(1, string1);
        }
    }
    onAfterSettingsChange() {
        const inputType = this.settings['function'].value;
        const title = "String Comparison";
        this.title = `${title} Compare (${inputType})`;
        this.broadcastTitleToClients();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('string/string-compare', StringCompareNode);
//# sourceMappingURL=string-compare.js.map