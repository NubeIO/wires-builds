"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
class PowerUnitConversionNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Power Conversion (kW)';
        this.description =
            'This node converts between Power units kilowatt (kW), Tons of Refrigeration (tons),  British Thermal Unit per hour (Btu/h), and Electrical Horsepower (hp).  Input type can be selected from settings. Outputs will change based on selected input type.';
        this.addInput('kW', node_io_1.Type.NUMBER);
        this.addOutput('tons', node_io_1.Type.NUMBER);
        this.addOutput('Btu/h', node_io_1.Type.NUMBER);
        this.addOutput('hp', node_io_1.Type.NUMBER);
        this.settings['inputType'] = {
            description: 'Input Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'kW', text: 'kilowatt (kW)' },
                    { value: 'tons', text: 'Tons of Refrigeration (tons)' },
                    { value: 'Btu/h', text: 'British Thermal Unit per hour (Btu/h)' },
                    { value: 'hp', text: 'Electrical Horsepower (hp)' },
                ],
            },
            value: 'kW',
        };
        this.settings['precision'] = { description: 'Precision', type: node_1.SettingType.NUMBER, value: '4' };
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
            case 'kW':
                this.title = 'Power Conversion (kW)';
                this.inputs[0].name = 'kW';
                this.outputs[0].name = 'tons';
                this.outputs[1].name = 'Btu/h';
                this.outputs[2].name = 'hp';
                this.conversionFunction = input => {
                    const outputArray = [null, null, null];
                    outputArray[0] = input * 0.284345;
                    outputArray[1] = input * 3412.141635133076;
                    outputArray[2] = input * 1.340482573727;
                    return outputArray;
                };
                break;
            case 'tons':
                this.title = 'Power Conversion (tons)';
                this.inputs[0].name = 'tons';
                this.outputs[0].name = 'kW';
                this.outputs[1].name = 'Btu/h';
                this.outputs[2].name = 'hp';
                this.conversionFunction = input => {
                    const outputArray = [null, null, null];
                    outputArray[0] = input * 3.51685;
                    outputArray[1] = input * 12000;
                    outputArray[2] = input * 4.71427613941;
                    return outputArray;
                };
                break;
            case 'Btu/h':
                this.title = 'Power Conversion (Btu/h)';
                this.inputs[0].name = 'Btu/h';
                this.outputs[0].name = 'kW';
                this.outputs[1].name = 'tons';
                this.outputs[2].name = 'hp';
                this.conversionFunction = input => {
                    const outputArray = [null, null, null];
                    outputArray[0] = input * 0.00029307107;
                    outputArray[1] = input * 8.33333332843549e-5;
                    outputArray[2] = input * 0.000392856662;
                    return outputArray;
                };
                break;
            case 'hp':
                this.title = 'Power Conversion (hp)';
                this.inputs[0].name = 'hp';
                this.outputs[0].name = 'kW';
                this.outputs[1].name = 'tons';
                this.outputs[2].name = 'Btu/h';
                this.conversionFunction = input => {
                    const outputArray = [null, null, null];
                    outputArray[0] = input * 0.746;
                    outputArray[1] = input * 2545.457659809275;
                    outputArray[2] = input * 0.21212147;
                    return outputArray;
                };
                break;
            default:
                this.title = 'Power Conversion (kW)';
                this.inputs[0].name = 'kW';
                this.outputs[0].name = 'tons';
                this.outputs[1].name = 'Btu/h';
                this.outputs[2].name = 'hp';
                this.conversionFunction = input => {
                    const outputArray = [null, null, null];
                    outputArray[0] = input * 0.284345;
                    outputArray[1] = input * 3412.141635133076;
                    outputArray[2] = input * 1.340482573727;
                    return outputArray;
                };
        }
    }
}
container_1.Container.registerNodeType('hvac/power-conversion', PowerUnitConversionNode);
//# sourceMappingURL=power-conversion.js.map