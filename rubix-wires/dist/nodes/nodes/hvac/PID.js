"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const time_utils_1 = require("../../utils/time-utils");
const PID = require('../../lib/pid-controller');
class PIDFunctionNode extends node_1.Node {
    constructor() {
        super();
        this.lastResetVal = false;
        this.pid = new PID(1, 1, 1, 0, 0, 'reverse');
        this.title = 'PID';
        this.description =
            "This node generates a PID ‘output’ based on input parameter settings. Inputs: Enable, Setpoint, Process Variable, inP (Proportional), inI (Integral), inD (Derivative), Direction, Interval, MaxOut, MinOut, Manual, and Bias. If 'direction' is 'true' the PID will be a Direct loop ('output' increases when 'processVariable' > 'setpoint'), if 'direction' is 'false' the PID will be a Reverse loop ('output' increases when 'processVariable' < 'setpoint'). 'interval' is the period that the PID output is re-calculated. 'bias' value is added to 'output'. 'manual' will be the 'output' value when 'enable' is 'false'. PID integral factor will be reset to 0 when 'reset' transitions from 'false' to 'true'.  'interval’ units can be configured from settings.  Maximum ‘interval’ setting is 587 hours.";
        this.addInput('enable', node_io_1.Type.BOOLEAN);
        this.addInput('processVariable', node_io_1.Type.NUMBER);
        this.addInputWithSettings('setpoint', node_io_1.Type.NUMBER, 1, 'setpoint');
        this.addInputWithSettings('minOut', node_io_1.Type.NUMBER, 0, 'minOut');
        this.addInputWithSettings('maxOut', node_io_1.Type.NUMBER, 100, 'maxOut');
        this.addInputWithSettings('inP', node_io_1.Type.NUMBER, 1, 'P');
        this.addInputWithSettings('inI', node_io_1.Type.NUMBER, 0, 'I');
        this.addInputWithSettings('inD', node_io_1.Type.NUMBER, 0, 'D');
        this.addInputWithSettings('direction', node_io_1.Type.BOOLEAN, true, 'Direction (OFF = Reverse, ON = Direct)');
        this.addInputWithSettings('interval', node_io_1.Type.NUMBER, 1, 'Interval (min 500ms)');
        this.addInputWithSettings('bias', node_io_1.Type.NUMBER, 0, 'Bias');
        this.addInputWithSettings('manual', node_io_1.Type.NUMBER, 0, "Manual ('output' value on disabled)");
        this.addInput('reset', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.NUMBER);
        this.settings['time'] = {
            description: 'Time',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'milliseconds', text: 'Milliseconds' },
                    { value: 'seconds', text: 'Seconds' },
                    { value: 'minutes', text: 'Minutes' },
                    { value: 'hours', text: 'Hours' },
                ],
            },
            value: 'seconds',
        };
        this.setSettingsConfig({
            groups: [
                { minOut: {}, maxOut: {} },
                { inP: {}, inI: {}, inD: {} },
                { time: {}, interval: { weight: 2 } },
            ],
        });
        this.startTime = Date.now();
        this.pid.setSampleTime(1000);
        this.pid.setOutputLimits(0, 100);
        this.pid.setMode('MANUAL');
        this.pid.setOutput(0);
        this.pid.setBias(0);
    }
    onAdded() {
        this.inputs[9]['name'] = `[interval] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
    onExecute() {
        if (this.pid.compute())
            this.setOutputData(0, this.pid.getOutput().toFixed(1), true);
    }
    onInputUpdated() {
        const reset = this.getInputData(12);
        if (reset && !this.lastResetVal)
            this.pid.initialize();
        this.lastResetVal = reset;
        let enable = this.getInputData(0);
        if (!enable) {
            this.pid.setMode('MANUAL');
            const manual = this.getInputData(11) || 0;
            this.setOutputData(0, manual.toFixed(1));
            this.pid.setOutput(manual);
            return;
        }
        let processVariable = this.getInputData(1);
        if (processVariable === null ||
            processVariable === undefined ||
            typeof processVariable !== node_io_1.Type.NUMBER) {
            this.pid.setMode('MANUAL');
            const manual = this.getInputData(11) || 0;
            this.setOutputData(0, manual.toFixed(1), true);
            this.pid.setOutput(manual);
            return;
        }
        const setpoint = this.getInputData(2);
        const minOut = this.getInputData(3);
        const maxOut = this.getInputData(4);
        const inP = this.getInputData(5);
        const inI = this.getInputData(6);
        const inD = this.getInputData(7);
        let direction = this.getInputData(8);
        if (direction == true)
            direction = 'direct';
        else
            direction = 'reverse';
        let interval = this.getInputData(9);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        interval = Math.max(500, interval);
        const bias = this.getInputData(10);
        this.pid.setBias(bias);
        this.pid.setSampleTime(interval);
        this.pid.setOutputLimits(minOut, maxOut);
        this.pid.setPoint(setpoint);
        this.pid.setTunings(inP, inI, inD);
        this.pid.setControllerDirection(direction);
        this.pid.setMode('auto');
        this.pid.setInput(processVariable);
        this.pid.compute();
        this.setOutputData(0, this.calculatePidOutput(), true);
    }
    onAfterSettingsChange() {
        this.inputs[9]['name'] = `[interval] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
    calculatePidOutput() {
        return this.pid.getOutput().toFixed(1);
    }
}
container_1.Container.registerNodeType('hvac/PID', PIDFunctionNode);
//# sourceMappingURL=PID.js.map