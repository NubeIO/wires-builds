"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const psychrolib = require('../../lib/psychrolib');
class TempConvertNode extends node_1.Node {
    constructor() {
        super();
        this.psychro = new psychrolib();
        this.title = 'Temperature Conversion (C-> F)';
        this.description =
            'This node converts between Temperature units: Celsius, Fahrenheit, Kelvin, and Rankine .  Input type can be selected from settings. Outputs will change based on selected input type.';
        this.addInput('input', node_1.Type.NUMBER);
        this.addOutput('output', node_1.Type.NUMBER);
        this.settings['convertType'] = {
            description: 'Conversion Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'C_to_F', text: 'Celsius to Fahrenheit' },
                    { value: 'C_to_K', text: 'Celsius to Kelvin' },
                    { value: 'C_to_R', text: 'Celsius to Rankine' },
                    { value: 'F_to_C', text: 'Fahrenheit to Celsius' },
                    { value: 'F_to_K', text: 'Fahrenheit to Kelvin' },
                    { value: 'F_to_R', text: 'Fahrenheit to Rankine' },
                    { value: 'K_to_C', text: 'Kelvin to Celsius' },
                    { value: 'K_to_F', text: 'Kelvin to Fahrenheit' },
                    { value: 'K_to_R', text: 'Kelvin to Rankine' },
                    { value: 'R_to_C', text: 'Rankine to Celsius' },
                    { value: 'R_to_F', text: 'Rankine to Fahrenheit' },
                    { value: 'R_to_K', text: 'Rankine to Kelvin' },
                ],
            },
            value: 'C_to_F',
        };
        this.settings['precision'] = { description: 'Precision', type: node_1.SettingType.NUMBER, value: 2 };
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
        const input = Number(this.getInputData(0));
        if (!utils_1.default.hasInput(input)) {
            this.setOutputData(0, null);
            return;
        }
        const precision = Math.abs(this.settings['precision'].value);
        const output = Number(this.conversionFunction(input)).toFixed(precision);
        this.setOutputData(0, output);
    }
    setConversionFunction() {
        const conversion = this.settings['convertType'].value;
        console.log(conversion, ': converstion');
        switch (conversion) {
            case 'C_to_F':
                this.title = 'Temperature Conversion (C-> F)';
                this.conversionFunction = this.psychro.GetTFahrenheitFromTCelsius;
                break;
            case 'C_to_K':
                this.title = 'Temperature Conversion (C-> K)';
                console.log('C_to_K');
                this.conversionFunction = this.psychro.GetTKelvinFromTCelsius;
                break;
            case 'C_to_R':
                this.title = 'Temperature Conversion (C-> R)';
                this.conversionFunction = this.psychro.GetTRankineFromTCelsius;
                break;
            case 'F_to_C':
                this.title = 'Temperature Conversion (F-> C)';
                this.conversionFunction = this.psychro.GetTCelsiusFromTFahrenheit;
                break;
            case 'F_to_K':
                this.title = 'Temperature Conversion (F-> K)';
                this.conversionFunction = this.psychro.GetTKelvinFromTFahrenheit;
                break;
            case 'F_to_R':
                this.title = 'Temperature Conversion (F-> R)';
                this.conversionFunction = this.psychro.GetTRankineFromTFahrenheit;
                break;
            case 'K_to_C':
                this.title = 'Temperature Conversion (K-> C)';
                this.conversionFunction = this.psychro.GetTCelsiusFromTKelvin;
                break;
            case 'K_to_F':
                this.title = 'Temperature Conversion (K-> F)';
                this.conversionFunction = this.psychro.GetTFahrenheitFromTKelvin;
                break;
            case 'K_to_R':
                this.title = 'Temperature Conversion (K-> R)';
                this.conversionFunction = this.psychro.GetTRankineFromTKelvin;
                break;
            case 'R_to_C':
                this.title = 'Temperature Conversion (R-> C)';
                this.conversionFunction = this.psychro.GetTCelsiusFromTRankine;
                break;
            case 'R_to_F':
                this.title = 'Temperature Conversion (R-> F)';
                this.conversionFunction = this.psychro.GetTFahrenheitFromTRankine;
                break;
            case 'R_to_K':
                this.title = 'Temperature Conversion (R-> K)';
                this.conversionFunction = this.psychro.GetTKelvinFromTRankine;
                break;
            default:
                this.title = 'Temperature Conversion (C-> F)';
                this.conversionFunction = this.psychro.GetTFahrenheitFromTCelsius;
        }
    }
}
container_1.Container.registerNodeType('hvac/temperature-conversion', TempConvertNode);
//# sourceMappingURL=temperature-conversion.js.map