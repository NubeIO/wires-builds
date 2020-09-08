"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class DeadbandNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Deadband';
        this.description =
            "This node applies a Hysteresis function (see hysteresis node), with a deadband centered at 'setpoint'.  The ON direction can be reversed from settings.";
        this.addInput('input', node_io_1.Type.NUMBER);
        this.addInputWithSettings('setpoint', node_io_1.Type.NUMBER, 0, 'Setpoint');
        this.addInputWithSettings('deadband', node_io_1.Type.NUMBER, 0, 'Deadband');
        this.addOutput('out', node_io_1.Type.BOOLEAN);
        this.addOutput('out not', node_io_1.Type.BOOLEAN);
        this.settings['invert'] = {
            description: 'Reverses ON direction when true',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    onAdded() {
        this.setOutputData(0, false);
    }
    onInputUpdated() {
        const input = this.getInputData(0);
        const setpoint = this.getInputData(1);
        let deadband = this.getInputData(2);
        const invert = this.settings['invert'].value;
        if (invert == true)
            deadband = deadband * -1;
        const risingEdge = setpoint + deadband / 2;
        const fallingEdge = setpoint - deadband / 2;
        if (risingEdge > fallingEdge) {
            if (input <= fallingEdge) {
                this.setOutputData(0, false, true);
            }
            if (input >= risingEdge) {
                this.setOutputData(0, true, true);
            }
        }
        else if (risingEdge < fallingEdge) {
            if (input >= fallingEdge) {
                this.setOutputData(0, false, true);
            }
            if (input <= risingEdge) {
                this.setOutputData(0, true, true);
            }
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('hvac/deadband', DeadbandNode);
//# sourceMappingURL=deadband.js.map