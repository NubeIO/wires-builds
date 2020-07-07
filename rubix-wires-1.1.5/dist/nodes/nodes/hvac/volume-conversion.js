"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
class VolumeUnitConversionNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Volume Conversion (L)';
        this.description =
            'This node converts between Volume units Litre (L), Cubic Metre (m³), Cubic Foot (ft³), and Gallon (gal).  Input type can be selected from settings. Outputs will change based on selected input type.';
        this.addInput('L', node_1.Type.NUMBER);
        this.addOutput('M³', node_1.Type.NUMBER);
        this.addOutput('ft³', node_1.Type.NUMBER);
        this.addOutput('gal', node_1.Type.NUMBER);
        this.settings['inputType'] = {
            description: 'Input Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'L', text: 'Litre (L)' },
                    { value: 'm³', text: 'Cubic Metre (m³)' },
                    { value: 'ft³', text: 'Cubic Foot (ft³)' },
                    { value: 'gal', text: 'Gallon (gal)' },
                ],
            },
            value: 'L',
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
            case 'L':
                this.title = 'Volume Conversion (L)';
                this.inputs[0].name = 'L';
                this.outputs[0].name = 'm³';
                this.outputs[1].name = 'ft³';
                this.outputs[2].name = 'gal';
                this.conversionFunction = input => {
                    const outputArray = [null, null, null];
                    outputArray[0] = input * 0.001;
                    outputArray[1] = input * 0.0353147;
                    outputArray[2] = input * 0.2642;
                    return outputArray;
                };
                break;
            case 'm³':
                this.title = 'Volume Conversion (m³)';
                this.inputs[0].name = 'm³';
                this.outputs[0].name = 'L';
                this.outputs[1].name = 'ft³';
                this.outputs[2].name = 'gal';
                this.conversionFunction = input => {
                    const outputArray = [null, null, null];
                    outputArray[0] = input * 1000;
                    outputArray[1] = input * 35.3147;
                    outputArray[2] = input * 264.2;
                    return outputArray;
                };
                break;
            case 'ft³':
                this.title = 'Volume Conversion (ft³)';
                this.inputs[0].name = 'ft³';
                this.outputs[0].name = 'm³';
                this.outputs[1].name = 'L';
                this.outputs[2].name = 'gal';
                this.conversionFunction = input => {
                    const outputArray = [null, null, null];
                    outputArray[0] = input * 0.0283168;
                    outputArray[1] = input * 28.3168;
                    outputArray[2] = input * 7.481;
                    return outputArray;
                };
                break;
            case 'gal':
                this.title = 'Volume Conversion (gal)';
                this.inputs[0].name = 'gal';
                this.outputs[0].name = 'm³';
                this.outputs[1].name = 'L';
                this.outputs[2].name = 'ft³';
                this.conversionFunction = input => {
                    const outputArray = [null, null, null];
                    outputArray[0] = input * 0.00378541;
                    outputArray[1] = input * 3.78541;
                    outputArray[2] = input * 0.133681;
                    return outputArray;
                };
                break;
            default:
                this.title = 'Volume Conversion (L)';
                this.inputs[0].name = 'L';
                this.outputs[0].name = 'm³';
                this.outputs[1].name = 'ft³';
                this.outputs[2].name = 'gal';
                this.conversionFunction = input => {
                    const outputArray = [null, null, null];
                    outputArray[0] = input * 0.001;
                    outputArray[1] = input * 0.0353147;
                    outputArray[2] = input * 0.2642;
                    return outputArray;
                };
        }
    }
}
container_1.Container.registerNodeType('hvac/volume-conversion', VolumeUnitConversionNode);
//# sourceMappingURL=volume-conversion.js.map