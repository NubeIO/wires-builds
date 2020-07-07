"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class ThermostatNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Heat/Cool Thermostat';
        this.description =
            "This node functions as a Heat/Cool thermostat. While 'enable' is set to 'true', the node will function as follows: 'CLG Mode' will be set to 'true' if 'input' is greater than 'setpoint' + 'CLG offset', 'CLG Mode' will be set to 'false' if 'input' is less than 'setpoint'.  'HTG Mode' will be set to 'true' if 'input' is less than 'setpoint' - 'HTG offset', 'HTG Mode' will be set to 'false' if 'input' is greater than 'setpoint'.  If 'enable' is 'false', 'CLG Mode' and 'HTG Mode' will both be set to 'false'. ";
        this.addInput('input', node_1.Type.NUMBER);
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, true, 'Enable');
        this.addInputWithSettings('setpoint', node_1.Type.NUMBER, 20, 'Setpoint');
        this.addInputWithSettings('CLG offset', node_1.Type.NUMBER, 1, 'CLG offset');
        this.addInputWithSettings('HTG offset', node_1.Type.NUMBER, 1, 'HTG offset');
        this.addOutput('CLG Mode', node_1.Type.BOOLEAN);
        this.addOutput('HTG Mode', node_1.Type.BOOLEAN);
        this.setOutputData(0, false);
        this.setOutputData(1, false);
        this.clgMode = false;
        this.htgMode = false;
    }
    onAdded() {
        this.setOutputData(0, false);
        this.setOutputData(1, false);
        this.onInputUpdated();
    }
    onInputUpdated() {
        let enable = this.getInputData(1);
        if (!enable) {
            this.setOutputData(0, false, true);
            this.setOutputData(1, false, true);
            this.clgMode = false;
            this.htgMode = false;
            return;
        }
        const input = this.getInputData(0);
        const setpoint = this.getInputData(2);
        const clgOffset = this.getInputData(3);
        const htgOffset = this.getInputData(4);
        const clgSP = setpoint + clgOffset;
        const htgSP = setpoint - htgOffset;
        if (input < htgSP) {
            this.setOutputData(0, false, true);
            this.setOutputData(1, true, true);
            this.htgMode = true;
            this.clgMode = false;
        }
        else if (input > clgSP) {
            this.setOutputData(0, true, true);
            this.setOutputData(1, false, true);
            this.clgMode = true;
            this.htgMode = false;
        }
        else if ((this.clgMode && input < setpoint) || (this.htgMode && input > setpoint)) {
            this.setOutputData(0, false, true);
            this.setOutputData(1, false, true);
            this.clgMode = false;
            this.htgMode = false;
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('hvac/thermostat', ThermostatNode);
//# sourceMappingURL=thermostat.js.map