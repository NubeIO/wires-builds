"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const time_utils_1 = require("../../utils/time-utils");
class DelayOffNode extends node_1.Node {
    constructor() {
        super();
        this.enabled = false;
        this.title = 'Off Delay';
        this.description =
            "‘output’ matches ‘input’, but ‘output’ transitions from 'true' to 'false' are delayed by 'delay' duration. The delay is cancelled when 'reset' transitions from 'false' to 'true. ‘offDelay active’ is ‘true’ during ‘offDelay’ periods. 'delay' units can be configured from settings.  Maximum ‘delay’ setting is 587 hours. (See Figure A.)";
        this.addInput('input', node_1.Type.BOOLEAN);
        this.addInputWithSettings('delay', node_1.Type.NUMBER, 1, 'Off Delay Duration (Max 597 Hours)');
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.addOutput('offDelay active', node_1.Type.BOOLEAN);
        this.addOutput('remaining', node_1.Type.NUMBER);
        this.settings['time'] = {
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
            groups: [{ delay: { weight: 2 }, time: {} }],
        });
        this.setOutputData(0, false);
        this.setOutputData(1, false);
        this.setOutputData(2, 0);
    }
    onCreated() {
        this.setOutputData(0, false);
        this.timeUnits = 'seconds';
    }
    onAdded() {
        this.inputs[1]['name'] = `[delay] (${this.settings['time'].value})`;
        this.outputs[2]['name'] = `[remaining] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
    onAfterSettingsChange() {
        this.timeUnits = this.settings['time'].value;
        this.inputs[1]['name'] = `[delay] (${this.settings['time'].value})`;
        this.outputs[2]['name'] = `[remaining] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
    onInputUpdated() {
        const delay = this.getInputData(1);
        const delayMilli = time_utils_1.default.timeConvert(delay, this.timeUnits);
        const input = this.getInputData(0);
        if (input == null) {
            clearTimeout(this.timeoutFunc);
            clearTimeout(this.remainingFunc);
            this.setOutputData(0, false);
            this.setOutputData(1, false);
            this.setOutputData(2, 0);
            this.enabled = false;
            return;
        }
        const reset = this.getInputData(2);
        if (reset && this.inputs[2].updated && this.enabled) {
            clearTimeout(this.timeoutFunc);
            clearTimeout(this.remainingFunc);
            this.setOutputData(0, input);
            this.setOutputData(1, false);
            this.setOutputData(2, 0);
            this.enabled = false;
        }
        if (!input && this.inputs[0].updated) {
            if (this.outputs[0].data == null) {
                this.setOutputData(0, false);
                this.setOutputData(1, false);
                this.setOutputData(2, 0);
                return;
            }
            this.setOutputData(1, true);
            this.setOutputData(2, delay);
            this.enabled = true;
            this.timeoutFunc = setTimeout(() => {
                this.enabled = false;
                this.setOutputData(0, false);
                this.setOutputData(1, false);
                this.setOutputData(2, 0);
                clearTimeout(this.remainingFunc);
            }, delayMilli);
            switch (this.timeUnits) {
                case 'milliseconds':
                    this.remainingUpdateMillis = 500;
                    this.remainingUpdateSize = 500;
                    break;
                case 'seconds':
                    this.remainingUpdateMillis = 1000;
                    this.remainingUpdateSize = 1;
                    break;
                case 'minutes':
                    this.remainingUpdateMillis = 6000;
                    this.remainingUpdateSize = 0.1;
                    break;
                case 'hours':
                    this.remainingUpdateMillis = 360000;
                    this.remainingUpdateSize = 0.1;
                    break;
            }
            this.remainingFunc = setInterval(() => {
                const remaining = this.outputs[2].data - this.remainingUpdateSize;
                this.setOutputData(2, remaining);
            }, this.remainingUpdateMillis);
        }
        if (input) {
            this.setOutputData(0, true, true);
            this.setOutputData(1, false, true);
            this.setOutputData(2, 0, true);
            if (this.inputs[0].updated && this.enabled) {
                clearTimeout(this.timeoutFunc);
                clearTimeout(this.remainingFunc);
                this.enabled = false;
            }
        }
    }
}
container_1.Container.registerNodeType('boolean/off-delay', DelayOffNode);
//# sourceMappingURL=off-delay.js.map