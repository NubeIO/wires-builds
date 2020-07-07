"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const time_utils_1 = require("../../utils/time-utils");
class MinOnOffNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Min On Off';
        this.description =
            "‘output’ matches ‘input’ but is delayed by the 'minOn' and 'minOff' durations. ‘output’ will remain 'true' for 'minOn' duration then match the ‘input’ value. ‘output’ will remain 'false' for 'minOff' duration then match the ‘input’ value. 'minOn' and 'minOff' delays are cancelled when 'reset' transitions from 'false' to 'true. ‘minOn active’ is ‘true’ during ‘minOn’ periods. ‘minOff active’ is ‘true’ during ‘minOff’ periods.  'minOn' and 'minOff' units can be configured from settings. Maximum ‘minOn’ and ‘'minOff'’ setting is 587 hours.   (See Figure A.)";
        this.addInput('input', node_1.Type.BOOLEAN);
        this.addInputWithSettings('minOn', node_1.Type.NUMBER, 1, 'Minimum On Time');
        this.addInputWithSettings('minOff', node_1.Type.NUMBER, 1, 'Minimum Off Time');
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.addOutput('minOn active', node_1.Type.BOOLEAN);
        this.addOutput('minOff active', node_1.Type.BOOLEAN);
        this.settings['timeMinOn'] = {
            description: 'Units',
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
        this.settings['timeMinOff'] = {
            description: 'Units',
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
                { minOn: { weight: 2 }, timeMinOn: {} },
                { minOff: { weight: 2 }, timeMinOff: {} },
            ],
        });
        this.setOutputData(0, false);
        this.setOutputData(1, false);
        this.setOutputData(2, false);
        this.timeOn = null;
        this.timeOff = null;
        this.minOnEnabled = false;
        this.minOffEnabled = false;
        this.lastResetValue = false;
    }
    onCreated() {
        this.setOutputData(0, false);
        this.setOutputData(1, false);
        this.setOutputData(2, false);
    }
    onAdded() {
        this.inputs[1]['name'] = `[minOn] (${this.settings['timeMinOn'].value})`;
        this.inputs[2]['name'] = `[minOff] (${this.settings['timeMinOff'].value})`;
        this.onInputUpdated();
    }
    onExecute() {
        let elapsed = null;
        if (this.minOnEnabled) {
            elapsed = Date.now() - this.timeOn;
            if (elapsed >= this.minOnTime) {
                this.minOnEnabled = false;
                this.onInputUpdated();
                this.setOutputData(1, false);
            }
        }
        if (this.minOffEnabled) {
            elapsed = Date.now() - this.timeOff;
            if (elapsed >= this.minOffTime) {
                this.minOffEnabled = false;
                this.onInputUpdated();
                this.setOutputData(2, false);
            }
        }
    }
    onInputUpdated() {
        let reset = this.getInputData(3);
        if (reset == null)
            reset = false;
        if (reset == true && reset != this.lastResetValue) {
            this.setOutputData(0, false);
            this.minOnEnabled = false;
            this.minOffEnabled = false;
            this.setOutputData(1, false);
            this.setOutputData(2, false);
        }
        this.lastResetValue = reset;
        let minOn = this.getInputData(1);
        minOn = time_utils_1.default.timeConvert(minOn, this.settings['timeMinOn'].value);
        this.minOnTime = minOn;
        let minOff = this.getInputData(2);
        minOff = time_utils_1.default.timeConvert(minOff, this.settings['timeMinOff'].value);
        this.minOffTime = minOff;
        let input = this.getInputData(0);
        if (!utils_1.default.hasInput(input))
            input = false;
        if (!this.minOnEnabled && !this.minOffEnabled) {
            this.setOutputData(0, input, true);
            if (input && input != this.lastValue) {
                this.timeOn = Date.now();
                this.minOnEnabled = true;
                this.setOutputData(1, true);
            }
            else if (!input && input != this.lastValue) {
                this.timeOff = Date.now();
                this.minOffEnabled = true;
                this.setOutputData(2, true);
            }
            this.lastValue = input;
        }
    }
    onAfterSettingsChange() {
        this.inputs[1]['name'] = `[minOn] (${this.settings['timeMinOn'].value})`;
        this.inputs[2]['name'] = `[minOff] (${this.settings['timeMinOff'].value})`;
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('boolean/min-on-off', MinOnOffNode);
//# sourceMappingURL=min-on-off.js.map