"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const psychrolib = require('../../lib/psychrolib');
class AtmosphericPressureNode extends node_1.Node {
    constructor() {
        super();
        this.psychro = new psychrolib();
        this.title = 'Atmospheric Pressure (Meters-> Pa)';
        this.description =
            "This node converts 'altitude' to Atmospheric Pressure in various units: Pascal (Pa), Standard Atmosphere (atm), Bar (bar), and Pound-force per square inch (lbf/in2) . 'altitude' units can be set from settings to be in:  Metric/SI (Meters-> Pa),  or Imperial/IP (Feet-> Psi).";
        this.addInput('altitude', node_1.Type.NUMBER);
        this.addOutput('pressure', node_1.Type.NUMBER);
        this.settings['units'] = {
            description: 'Select Units',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'SI', text: 'Metric/SI (Meters-> Pa)' },
                    { value: 'IP', text: 'Imperial/IP (Feet-> Psi)' },
                ],
            },
            value: 'SI',
        };
        this.settings['precision'] = { description: 'Precision', type: node_1.SettingType.NUMBER, value: 2 };
        this.psychro.SetUnitSystem(this.psychro.SI);
    }
    onAdded() {
        this.updateTitleAndFunction();
        this.onInputUpdated();
    }
    onInputUpdated() {
        this.onInputOrSettingsChange();
    }
    onAfterSettingsChange() {
        this.updateTitleAndFunction();
        this.onInputOrSettingsChange();
    }
    updateTitleAndFunction() {
        const units = this.settings['units'].value;
        if (units == 'IP') {
            this.title = 'Atmospheric Pressure (Feet-> Psi)';
            this.psychro.SetUnitSystem(this.psychro.IP);
        }
        else {
            this.title = 'Atmospheric Pressure (Meters-> Pa)';
            this.psychro.SetUnitSystem(this.psychro.SI);
        }
    }
    onInputOrSettingsChange() {
        const altitude = this.getInputData(0);
        if (!utils_1.default.hasInput(altitude)) {
            this.setOutputData(0, null);
            return;
        }
        const pressure = this.psychro.GetStandardAtmPressure(altitude);
        const precision = Math.abs(this.settings['precision'].value);
        this.setOutputData(0, Number(pressure).toFixed(precision));
    }
}
container_1.Container.registerNodeType('hvac/atmospheric-pressure', AtmosphericPressureNode);
//# sourceMappingURL=atm-pressure-conversion.js.map