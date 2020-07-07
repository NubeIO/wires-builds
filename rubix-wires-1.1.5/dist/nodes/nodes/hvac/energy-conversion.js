"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
class EnergyUnitConversionNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Energy Conversion (W·h)';
        this.description =
            'This node converts between Energy units watt-hour (W·h), kilowatt-hour (kW·h), British Thermal Unit (Btu), calorie (cal), joule(J), and joule(kJ).  Input type can be selected from settings. Outputs will change based on selected input type.';
        this.addInput('W·h', node_1.Type.NUMBER);
        this.addOutput('kW·h', node_1.Type.NUMBER);
        this.addOutput('Btu', node_1.Type.NUMBER);
        this.addOutput('cal', node_1.Type.NUMBER);
        this.addOutput('J', node_1.Type.NUMBER);
        this.addOutput('kJ', node_1.Type.NUMBER);
        this.settings['inputType'] = {
            description: 'Input Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'W·h', text: 'watt-hour (W·h)' },
                    { value: 'kW·h', text: 'kilowatt-hour (kW·h)' },
                    { value: 'Btu', text: 'British Thermal Unit (Btu)' },
                    { value: 'cal', text: 'calorie (cal)' },
                    { value: 'J', text: 'joule(J)' },
                    { value: 'kJ', text: 'kilojoule(kJ)' },
                ],
            },
            value: 'W·h',
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
            case 'W·h':
                this.title = 'Energy Conversion (W·h)';
                this.inputs[0].name = 'W·h';
                this.outputs[0].name = 'kW·h';
                this.outputs[1].name = 'Btu';
                this.outputs[2].name = 'cal';
                this.outputs[3].name = 'J';
                this.outputs[4].name = 'kJ';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null, null];
                    outputArray[0] = input * 0.001;
                    outputArray[1] = input * 3.4121416331;
                    outputArray[2] = input * 859.8456;
                    outputArray[3] = input * 3600;
                    outputArray[4] = input * 3.6;
                    return outputArray;
                };
                break;
            case 'kW·h':
                this.title = 'Energy Conversion (kW·h)';
                this.inputs[0].name = 'kW·h';
                this.outputs[0].name = 'W·h';
                this.outputs[1].name = 'Btu';
                this.outputs[2].name = 'cal';
                this.outputs[3].name = 'J';
                this.outputs[4].name = 'kJ';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null, null];
                    outputArray[0] = input * 1000;
                    outputArray[1] = input * 3412.1416331279;
                    outputArray[2] = input * 859845.6;
                    outputArray[3] = input * 3600000;
                    outputArray[4] = input * 3600;
                    return outputArray;
                };
                break;
            case 'Btu':
                this.title = 'Energy Conversion (Btu)';
                this.inputs[0].name = 'Btu';
                this.outputs[0].name = 'W·h';
                this.outputs[1].name = 'kW·h';
                this.outputs[2].name = 'cal';
                this.outputs[3].name = 'J';
                this.outputs[4].name = 'kJ';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null, null];
                    outputArray[0] = input * 0.2930710702;
                    outputArray[1] = input * 0.0002930711;
                    outputArray[2] = input * 251.99587;
                    outputArray[3] = input * 1055.05585262;
                    outputArray[4] = input * 1.0550558526;
                    return outputArray;
                };
                break;
            case 'cal':
                this.title = 'Energy Conversion (cal)';
                this.inputs[0].name = 'cal';
                this.outputs[0].name = 'W·h';
                this.outputs[1].name = 'kW·h';
                this.outputs[2].name = 'Btu';
                this.outputs[3].name = 'J';
                this.outputs[4].name = 'kJ';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null, null];
                    outputArray[0] = input * 0.0011629995;
                    outputArray[1] = input * 0.000001163;
                    outputArray[2] = input * 0.003968319;
                    outputArray[3] = input * 4.1867982;
                    outputArray[4] = input * 0.0041867982;
                    return outputArray;
                };
                break;
            case 'J':
                this.title = 'Energy Conversion (J)';
                this.inputs[0].name = 'J';
                this.outputs[0].name = 'W·h';
                this.outputs[1].name = 'kW·h';
                this.outputs[2].name = 'Btu';
                this.outputs[3].name = 'cal';
                this.outputs[4].name = 'kJ';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null, null];
                    outputArray[0] = input * 0.0002777778;
                    outputArray[1] = input * 0.0000002777778;
                    outputArray[2] = input * 0.0009478171;
                    outputArray[3] = input * 0.238846;
                    outputArray[4] = input * 0.001;
                    return outputArray;
                };
                break;
            case 'kJ':
                this.title = 'Energy Conversion (kJ)';
                this.inputs[0].name = 'kJ';
                this.outputs[0].name = 'W·h';
                this.outputs[1].name = 'kW·h';
                this.outputs[2].name = 'Btu';
                this.outputs[3].name = 'cal';
                this.outputs[4].name = 'J';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null, null];
                    outputArray[0] = input * 0.2777777778;
                    outputArray[1] = input * 0.0002777778;
                    outputArray[2] = input * 0.9478171203;
                    outputArray[3] = input * 238.846;
                    outputArray[4] = input * 1000;
                    return outputArray;
                };
                break;
            default:
                this.title = 'Energy Conversion (W·h)';
                this.inputs[0].name = 'W·h';
                this.outputs[0].name = 'kW·h';
                this.outputs[1].name = 'Btu';
                this.outputs[2].name = 'cal';
                this.outputs[3].name = 'J';
                this.outputs[4].name = 'kJ';
                this.conversionFunction = input => {
                    let outputArray = [null, null, null, null, null];
                    outputArray[0] = input * 0.001;
                    outputArray[1] = input * 3.4121416331;
                    outputArray[2] = input * 859.8456;
                    outputArray[3] = input * 3600;
                    outputArray[4] = input * 3.6;
                    return outputArray;
                };
        }
    }
}
container_1.Container.registerNodeType('hvac/energy-conversion', EnergyUnitConversionNode);
//# sourceMappingURL=energy-conversion.js.map