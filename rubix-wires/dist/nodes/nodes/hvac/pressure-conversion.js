"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
class PressureConvertNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Pressure Conversion (Pa)';
        this.description =
            'This node converts between Pressure units: Pascal (Pa), Standard Atmosphere (atm), Bar (bar), and Pound-force per square inch (lbf/in2) .  Input type can be selected from settings. Outputs will change based on selected input type.';
        this.addInput('Pa', node_io_1.Type.NUMBER);
        this.addOutput('atm', node_io_1.Type.NUMBER);
        this.addOutput('bar', node_io_1.Type.NUMBER);
        this.addOutput('lbf/in2', node_io_1.Type.NUMBER);
        this.settings['inputType'] = {
            description: 'Input Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'Pa', text: 'Pascal (Pa)' },
                    { value: 'atm', text: 'Standard Atmosphere (atm)' },
                    { value: 'bar', text: 'Bar (bar)' },
                    { value: 'lbf/in2', text: 'Pound-force per square inch (lbf/in2)' },
                ],
            },
            value: 'Pa',
        };
        this.settings['precision'] = { description: 'Precision', type: node_1.SettingType.NUMBER, value: '2' };
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
            return;
        }
        const output = this.conversionFunction(input);
        const precision = Math.abs(this.settings['precision'].value);
        this.setOutputData(0, Number(output[0]).toFixed(precision));
        this.setOutputData(1, Number(output[1]).toFixed(precision));
        this.setOutputData(2, Number(output[2]).toFixed(precision));
    }
    setConversionFunction() {
        const inputType = this.settings['inputType'].value;
        switch (inputType) {
            case 'Pa':
                this.title = 'Pressure Conversion (Pa)';
                this.inputs[0].name = 'Pa';
                this.outputs[0].name = 'atm';
                this.outputs[1].name = 'bar';
                this.outputs[2].name = 'lbf/in2';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null];
                    outputArray[0] = input * 9.8692e-6;
                    outputArray[1] = input * 1e-5;
                    outputArray[2] = input * 0.000145038;
                    return outputArray;
                };
                break;
            case 'atm':
                this.title = 'Pressure Conversion (atm)';
                this.inputs[0].name = 'atm';
                this.outputs[0].name = 'Pa';
                this.outputs[1].name = 'bar';
                this.outputs[2].name = 'lbf/in2';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null];
                    outputArray[0] = input * 101325;
                    outputArray[1] = input * 1.01325;
                    outputArray[2] = input * 14.6959;
                    return outputArray;
                };
                break;
            case 'bar':
                this.title = 'Pressure Conversion (bar)';
                this.inputs[0].name = 'bar';
                this.outputs[0].name = 'Pa';
                this.outputs[1].name = 'atm';
                this.outputs[2].name = 'lbf/in2';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null];
                    outputArray[0] = input * 100000;
                    outputArray[1] = input * 0.986923;
                    outputArray[2] = input * 14.5038;
                    return outputArray;
                };
                break;
            case 'lbf/in2':
                this.title = 'Pressure Conversion (lbf/in2)';
                this.inputs[0].name = 'lbf/in2';
                this.outputs[0].name = 'Pa';
                this.outputs[1].name = 'atm';
                this.outputs[2].name = 'bar';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null];
                    outputArray[0] = input * 6894.76;
                    outputArray[1] = input * 0.068046;
                    outputArray[2] = input * 0.0689476;
                    return outputArray;
                };
                break;
            default:
                this.title = 'Pressure Conversion (Pa)';
                this.inputs[0].name = 'Pa';
                this.outputs[0].name = 'atm';
                this.outputs[1].name = 'bar';
                this.outputs[2].name = 'lbf/in2';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null];
                    outputArray[0] = input * 9.8692e-6;
                    outputArray[1] = input * 1e-5;
                    outputArray[2] = input * 0.000145038;
                    return outputArray;
                };
        }
    }
}
container_1.Container.registerNodeType('hvac/pressure-conversion', PressureConvertNode);
//# sourceMappingURL=pressure-conversion.js.map