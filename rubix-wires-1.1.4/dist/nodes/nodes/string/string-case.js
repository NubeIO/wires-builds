"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
class StringCaseChangeNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'String Case (Lower)';
        this.description =
            "'output' is the 'input' string with all characters changed to either upper or lower case.  Upper or Lower case can be selected from settings.";
        this.addInput('input', node_1.Type.STRING);
        this.addOutput('output', node_1.Type.STRING);
        this.setOutputData(0, null);
        this.settings['function'] = {
            description: 'Select Case',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'lower', text: 'Lower Case' },
                    { value: 'upper', text: 'Upper Case' },
                ],
            },
            value: 'lower',
        };
    }
    onAdded() {
        this.setTitleAndConversionFunction();
        this.onInputUpdated();
    }
    onInputUpdated() {
        const input = this.getInputData(0);
        if (!utils_1.default.hasInput(input)) {
            this.setOutputData(0, null, true);
            return;
        }
        this.setOutputData(0, this.conversionFunction(input), true);
    }
    onAfterSettingsChange() {
        this.setTitleAndConversionFunction();
        this.onInputUpdated();
    }
    setTitleAndConversionFunction() {
        const inputType = this.settings['function'].value;
        switch (inputType) {
            case 'lower':
                this.title = 'String Case (Lower)';
                this.conversionFunction = s1 => {
                    return s1.toLowerCase();
                };
                break;
            case 'upper':
                this.title = 'String Case (Upper)';
                this.conversionFunction = s1 => {
                    return s1.toUpperCase();
                };
                break;
            default:
                this.title = 'String Case (Lower)';
                this.conversionFunction = s1 => {
                    return s1.toLowerCase();
                };
        }
    }
}
container_1.Container.registerNodeType('string/string-case', StringCaseChangeNode);
//# sourceMappingURL=string-case.js.map