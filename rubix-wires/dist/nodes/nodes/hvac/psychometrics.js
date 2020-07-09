"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const psychrolib = require('../../lib/psychrolib');
class PsychrometricCalculationsNode extends node_1.Node {
    constructor() {
        super();
        this.psychro = new psychrolib();
        this.title = 'Psychrometric Calcs (Metric/SI)';
        this.description =
            'This node provides psychrometric calculations based on a selection of: Dry Bulb Temp, Wet Bulb Temp, Dew Point, Relative Humidity, and Pressure.  Inputs and Outputs as follows: (i) Dry bulb temperature in °F [IP] or °C [SI]; (i) Wet bulb temperature in °F [IP] or °C [SI];  (i) Atmospheric pressure in Psi [IP] or Pa [SI];  (o) Humidity ratio in lb_H₂O lb_Air⁻¹ [IP] or kg_H₂O kg_Air⁻¹ [SI];  (o) Dew point temperature in °F [IP] or °C [SI]; \n (o) Relative humidity [0-1];  (o) Partial pressure of water vapor in moist air in Psi [IP] or Pa [SI];  (o) Moist air enthalpy in Btu lb⁻¹ [IP] or J kg⁻¹ [SI];  (o) Specific volume ft³ lb⁻¹ [IP] or in m³ kg⁻¹ [SI].  Input types can be selected from settings. Outputs will change based on selected input type.   Unit system can be set from settings to be in:  Metric/SI or Imperial/IP.';
        this.addInput('DryBulb', node_1.Type.NUMBER);
        this.addInput('RelHum(0-1)', node_1.Type.NUMBER);
        this.addInput('Pressure', node_1.Type.NUMBER);
        this.addOutput('HumRatio', node_1.Type.NUMBER);
        this.addOutput('TWetBulb', node_1.Type.NUMBER);
        this.addOutput('TDewPoint', node_1.Type.NUMBER);
        this.addOutput('VapPres', node_1.Type.NUMBER);
        this.addOutput('MoistAirEnthalpy', node_1.Type.NUMBER);
        this.addOutput('MoistAirVolume', node_1.Type.NUMBER);
        this.addOutput('DegreeOfSaturation', node_1.Type.NUMBER);
        this.addOutput('error', node_1.Type.STRING);
        this.settings['units'] = {
            description: 'Select Units',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'SI', text: 'Metric/SI' },
                    { value: 'IP', text: 'Imperial/IP' },
                ],
            },
            value: 'SI',
        };
        this.settings['inputsSelect'] = {
            description: 'Select Inputs',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'DB_RH_P', text: 'Dry Bulb, Rel. Humidity, Pressure' },
                    { value: 'DB_WB_P', text: 'Dry Bulb, Wet Bulb, Pressure' },
                    { value: 'DB_DP_P', text: 'Dry Bulb, Dew Point, Pressure ' },
                ],
            },
            value: 'DB_RH_P',
        };
        this.settings['precision'] = { description: 'Precision', type: node_1.SettingType.NUMBER, value: 4 };
        this.psychro.SetUnitSystem(this.psychro.SI);
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
        const input1 = this.getInputData(0);
        const input2 = this.getInputData(1);
        const input3 = this.getInputData(2);
        if (!utils_1.default.hasInput(input1) || !utils_1.default.hasInput(input2) || !utils_1.default.hasInput(input3)) {
            this.clearOutputs();
            this.setOutputData(7, null);
            return;
        }
        let outputArray;
        try {
            outputArray = this.conversionFunction(input1, input2, input3);
        }
        catch (error) {
            this.clearOutputs();
            this.setOutputData(7, String(error));
            return;
        }
        const precision = Math.abs(this.settings['precision'].value);
        this.setOutputData(0, Number(outputArray[0]).toFixed(precision));
        this.setOutputData(1, Number(outputArray[1]).toFixed(precision));
        this.setOutputData(2, Number(outputArray[2]).toFixed(precision));
        this.setOutputData(3, Number(outputArray[3]).toFixed(precision));
        this.setOutputData(4, Number(outputArray[4]).toFixed(precision));
        this.setOutputData(5, Number(outputArray[5]).toFixed(precision));
        this.setOutputData(6, Number(outputArray[6]).toFixed(precision));
        this.setOutputData(7, null);
    }
    clearOutputs() {
        this.setOutputData(0, null);
        this.setOutputData(1, null);
        this.setOutputData(2, null);
        this.setOutputData(3, null);
        this.setOutputData(4, null);
        this.setOutputData(5, null);
        this.setOutputData(6, null);
    }
    setConversionFunction() {
        const units = this.settings['units'].value;
        if (units == 'IP') {
            this.psychro.SetUnitSystem(this.psychro.IP);
            this.title = 'Psychrometric Calcs (Imperial/IP)';
        }
        else {
            this.psychro.SetUnitSystem(this.psychro.SI);
            this.title = 'Psychrometric Calcs (Metric/SI)';
        }
        const conversion = this.settings['inputsSelect'].value;
        switch (conversion) {
            case 'DB_RH_P':
                this.inputs[0].name = 'DryBulb';
                this.inputs[1].name = 'RelHum(0-1)';
                this.inputs[2].name = 'Pressure';
                this.outputs[0].name = 'HumRatio';
                this.outputs[1].name = 'TWetBulb';
                this.outputs[2].name = 'TDewPoint';
                this.conversionFunction = (in1, in2, in3) => {
                    return this.psychro.CalcPsychrometricsFromRelHum(in1, in2, in3);
                };
                break;
            case 'DB_WB_P':
                this.inputs[0].name = 'DryBulb';
                this.inputs[1].name = 'TWetBulb';
                this.inputs[2].name = 'Pressure';
                this.outputs[0].name = 'HumRatio';
                this.outputs[1].name = 'TDewPoint';
                this.outputs[2].name = 'RelHum';
                this.conversionFunction = (in1, in2, in3) => {
                    return this.psychro.CalcPsychrometricsFromTWetBulb(in1, in2, in3);
                };
                break;
            case 'DB_DP_P':
                this.inputs[0].name = 'DryBulb';
                this.inputs[1].name = 'TDewPoint';
                this.inputs[2].name = 'Pressure';
                this.outputs[0].name = 'HumRatio';
                this.outputs[1].name = 'TWetBulb';
                this.outputs[2].name = 'RelHum';
                this.conversionFunction = (in1, in2, in3) => {
                    return this.psychro.CalcPsychrometricsFromTDewPoint(in1, in2, in3);
                };
                break;
            default:
                this.inputs[0].name = 'DryBulb';
                this.inputs[1].name = 'RelHum(0-1)';
                this.inputs[2].name = 'Pressure';
                this.outputs[0].name = 'HumRatio';
                this.outputs[1].name = 'TWetBulb';
                this.outputs[2].name = 'TDewPoint';
                this.conversionFunction = (in1, in2, in3) => {
                    return this.psychro.CalcPsychrometricsFromRelHum(in1, in2, in3);
                };
        }
    }
}
container_1.Container.registerNodeType('hvac/psychrometrics', PsychrometricCalculationsNode);
//# sourceMappingURL=psychometrics.js.map