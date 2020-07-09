"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
class StringCompareNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'String Compare (Equals)';
        this.description =
            "This node provides several functions to compare 2 String inputs, with a Boolean 'output'.  Available comparison functions are: Equals, Includes, Starts With, and Ends With.  The comparison function is selected from settings.";
        this.addInput('string1', node_1.Type.STRING);
        this.addInputWithSettings('string2', node_1.Type.STRING, '', 'String2 Value');
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.setOutputData(0, null);
        this.settings['function'] = {
            description: 'Comparison',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'equals', text: 'Equals' },
                    { value: 'includes', text: 'Includes' },
                    { value: 'startsWith', text: 'Starts With' },
                    { value: 'endsWith', text: 'Ends With' },
                ],
            },
            value: 'equals',
        };
    }
    onAdded() {
        this.setTitleAndConversionFunction();
        this.onInputUpdated();
    }
    onInputUpdated() {
        const string1 = this.getInputData(0);
        if (!utils_1.default.hasInput(string1)) {
            this.setOutputData(0, null, true);
            return;
        }
        const string2 = this.getInputData(1);
        if (!this.conversionFunction) {
            return;
        }
        this.setOutputData(0, this.conversionFunction(string1, string2), true);
        if (this.conversionFunction(string1, string2)) {
            this.setOutputData(1, string1);
        }
    }
    onAfterSettingsChange() {
        this.setTitleAndConversionFunction();
        this.onInputUpdated();
    }
    setTitleAndConversionFunction() {
        const inputType = this.settings['function'].value;
        switch (inputType) {
            case 'equals':
                this.title = 'String Compare (Equals)';
                this.conversionFunction = (s1, s2) => {
                    return s1 === s2;
                };
                break;
            case 'includes':
                this.title = 'String Compare (Includes)';
                this.conversionFunction = (s1, s2) => {
                    return s1.includes(s2);
                };
                break;
            case 'startsWith':
                this.title = 'String Compare (Starts With)';
                this.conversionFunction = (s1, s2) => {
                    return s1.startsWith(s2);
                };
                break;
            case 'endsWith':
                this.title = 'String Compare (Ends With)';
                this.conversionFunction = (s1, s2) => {
                    return s1.endsWith(s2);
                };
                break;
            default:
                this.title = 'String Compare (Equals)';
                this.conversionFunction = (s1, s2) => {
                    return s1 === s2;
                };
        }
    }
}
container_1.Container.registerNodeType('string/string-compare', StringCompareNode);
//# sourceMappingURL=string-compare.js.map