"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class JsonFilterCompare extends node_1.Node {
    constructor() {
        super();
        this.title = 'Json Filter Comparison';
        this.description = 'Filter a json object Example: msg.myKey';
        this.addInput('input', node_1.Type.STRING);
        this.addOutput('output', node_1.Type.STRING);
        this.addOutput('match', node_1.Type.BOOLEAN);
        this.addOutput('error', node_1.Type.STRING);
        this.settings['filter'] = {
            description: 'Example: msg.myKey',
            value: 'myKey',
            type: node_1.SettingType.STRING,
        };
        this.addInputWithSettings('string2', node_1.Type.STRING, '', 'Comparison Value');
        this.settings['function'] = {
            description: 'Comparison Type',
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
        this.settings['passNull'] = {
            description: 'Send null if not a match',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    onAdded() {
        this.setTitleAndConversionFunction();
        this.onInputUpdated();
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        if (input === null) {
            this.setOutputData(0, null);
            this.setOutputData(1, null);
            this.setOutputData(2, null);
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
            const string2 = this.getInputData(1);
            if (!this.conversionFunction) {
                return;
            }
            if (this.conversionFunction(out, string2)) {
                this.setOutputData(0, input);
                this.setOutputData(1, true);
            }
            else if (this.settings['passNull'].value === true) {
                this.setOutputData(0, null);
                this.setOutputData(1, false);
                this.setOutputData(2, null);
            }
            else
                this.setOutputData(1, false);
        }
        catch (e) {
            this.setOutputData(0, null);
            this.setOutputData(1, null);
            this.setOutputData(2, e);
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
                this.title = 'Json Compare (Equals)';
                this.conversionFunction = (s1, s2) => {
                    return s1 === s2;
                };
                break;
            case 'includes':
                this.title = 'Json Compare (Includes)';
                this.conversionFunction = (s1, s2) => {
                    return s1.includes(s2);
                };
                break;
            case 'startsWith':
                this.title = 'Json Compare (Starts With)';
                this.conversionFunction = (s1, s2) => {
                    return s1.startsWith(s2);
                };
                break;
            case 'endsWith':
                this.title = 'Json Compare (Ends With)';
                this.conversionFunction = (s1, s2) => {
                    return s1.endsWith(s2);
                };
                break;
            default:
                this.title = 'Json Compare (Equals)';
                this.conversionFunction = (s1, s2) => {
                    return s1 === s2;
                };
        }
    }
}
container_1.Container.registerNodeType('json/json-filter-compare', JsonFilterCompare);
//# sourceMappingURL=json-filter-compare.js.map