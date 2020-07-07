"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
class TimeConvertNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Time Conversion (min)';
        this.description =
            "This node converts between Time units Days('day'), Hours('hour'), Minutes('min'), Seconds('sec'), and Milliseconds('milli').  Input type can be selected from settings. Outputs will change based on selected input type.  The number of decimal places that output values have can be set from the 'Precision' setting.";
        this.addInput('min', node_1.Type.NUMBER);
        this.addOutput('day', node_1.Type.NUMBER);
        this.addOutput('hour', node_1.Type.NUMBER);
        this.addOutput('sec', node_1.Type.NUMBER);
        this.addOutput('milli', node_1.Type.NUMBER);
        this.settings['inputType'] = {
            description: 'Input Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'day', text: 'Days (day)' },
                    { value: 'hour', text: 'Hours (hour)' },
                    { value: 'min', text: 'Minutes (min)' },
                    { value: 'sec', text: 'Seconds (sec)' },
                    { value: 'milli', text: 'Milliseconds(milli)' },
                ],
            },
            value: 'min',
        };
        this.settings['precision'] = { description: 'Precision', type: node_1.SettingType.NUMBER, value: '2' };
        this.conversionFunction = input => {
            let outputArray = [null, null, null, null];
            outputArray[0] = input * 0.000694444;
            outputArray[1] = input * 0.016666667;
            outputArray[2] = input * 60;
            outputArray[3] = input * 60000;
            return outputArray;
        };
    }
    onAdded() {
        this.setConversionFunction();
    }
    onInputUpdated() {
        this.onInputOrSettingsChange();
    }
    onAfterSettingsChange() {
        this.setConversionFunction();
        this.onInputOrSettingsChange();
    }
    onInputOrSettingsChange() {
        const input = this.getInputData(0);
        if (!utils_1.default.hasInput(input)) {
            this.setOutputData(0, null);
            this.setOutputData(1, null);
            this.setOutputData(2, null);
            this.setOutputData(3, null);
            this.setOutputData(4, null);
            return;
        }
        const output = this.conversionFunction(input);
        const precision = Math.abs(this.settings['precision'].value);
        this.setOutputData(0, Number(output[0]).toFixed(precision));
        this.setOutputData(1, Number(output[1]).toFixed(precision));
        this.setOutputData(2, Number(output[2]).toFixed(precision));
        this.setOutputData(3, Number(output[3]).toFixed(precision));
        this.setOutputData(4, Number(output[4]).toFixed(precision));
    }
    setConversionFunction() {
        const inputType = this.settings['inputType'].value;
        switch (inputType) {
            case 'min':
                this.title = 'Time Conversion (min)';
                this.inputs[0].name = 'min';
                this.outputs[0].name = 'day';
                this.outputs[1].name = 'hour';
                this.outputs[2].name = 'sec';
                this.outputs[3].name = 'milli';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null];
                    outputArray[0] = input * 0.000694444;
                    outputArray[1] = input * 0.016666667;
                    outputArray[2] = input * 60;
                    outputArray[3] = input * 60000;
                    return outputArray;
                };
                break;
            case 'sec':
                this.title = 'Time Conversion (sec)';
                this.inputs[0].name = 'sec';
                this.outputs[0].name = 'day';
                this.outputs[1].name = 'hour';
                this.outputs[2].name = 'min';
                this.outputs[3].name = 'milli';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null];
                    outputArray[0] = input * 1.1574e-5;
                    outputArray[1] = input * 0.000277778;
                    outputArray[2] = input * 0.016666667;
                    outputArray[3] = input * 1000;
                    return outputArray;
                };
                break;
            case 'milli':
                this.title = 'Time Conversion (milli)';
                this.inputs[0].name = 'milli';
                this.outputs[0].name = 'day';
                this.outputs[1].name = 'hour';
                this.outputs[2].name = 'min';
                this.outputs[3].name = 'sec';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null];
                    outputArray[0] = input * 1.1574e-8;
                    outputArray[1] = input * 2.7778e-7;
                    outputArray[2] = input * 1.6667e-5;
                    outputArray[3] = input * 0.00100002;
                    return outputArray;
                };
                break;
            case 'day':
                this.title = 'Time Conversion (day)';
                this.inputs[0].name = 'day';
                this.outputs[0].name = 'hour';
                this.outputs[1].name = 'min';
                this.outputs[2].name = 'sec';
                this.outputs[3].name = 'milli';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null];
                    outputArray[0] = input * 24;
                    outputArray[1] = input * 1440;
                    outputArray[2] = input * 86400;
                    outputArray[3] = input * 8.64e7;
                    return outputArray;
                };
                break;
            case 'hour':
                this.title = 'Time Conversion (hour)';
                this.inputs[0].name = 'hour';
                this.outputs[0].name = 'day';
                this.outputs[1].name = 'min';
                this.outputs[2].name = 'sec';
                this.outputs[3].name = 'milli';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null];
                    outputArray[0] = input * 0.0416667;
                    outputArray[1] = input * 60;
                    outputArray[2] = input * 3600;
                    outputArray[3] = input * 3.6e6;
                    return outputArray;
                };
                break;
            default:
                this.title = 'Time Conversion (min)';
                this.inputs[0].name = 'min';
                this.outputs[0].name = 'day';
                this.outputs[1].name = 'hour';
                this.outputs[2].name = 'sec';
                this.outputs[3].name = 'milli';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null];
                    outputArray[0] = input * 0.000694444;
                    outputArray[1] = input * 0.016666667;
                    outputArray[2] = input * 60;
                    outputArray[3] = input * 60000;
                    return outputArray;
                };
        }
    }
}
exports.TimeConvertNode = TimeConvertNode;
container_1.Container.registerNodeType('time/conversion', TimeConvertNode);
//# sourceMappingURL=time-conversion.js.map