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
                    { value: time_utils_1.TIME_TYPE.MILLISECONDS, text: 'Milliseconds' },
                    { value: time_utils_1.TIME_TYPE.SECONDS, text: 'Seconds' },
                    { value: time_utils_1.TIME_TYPE.MINUTES, text: 'Minutes' },
                    { value: time_utils_1.TIME_TYPE.HOURS, text: 'Hours' },
                ],
            },
            value: time_utils_1.TIME_TYPE.SECONDS,
        };
        this.setSettingsConfig({
            groups: [{ delay: { weight: 2 }, time: {} }],
        });
    }
    onCreated() {
        this.setOutputData(0, false);
        this.setOutputData(1, false);
        this.setOutputData(2, 0);
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onAfterSettingsChange() {
        this.timeUnits = this.settings['time'].value;
        this.inputs[1]['name'] = `[delay] (${this.timeUnits})`;
        this.outputs[2]['name'] = `[remaining] (${this.timeUnits})`;
        this.onInputUpdated();
    }
    onInputUpdated() {
        const delay = this.getInputData(1);
        const delayMilli = time_utils_1.default.timeConvert(delay, this.timeUnits);
        let input = this.getInputData(0);
        if (input !== true)
            input = false;
        const reset = this.getInputData(2);
        if (reset && this.inputs[2].updated && this.enabled) {
            this.clearTimers();
            this.setOutputData(0, input);
            this.setOutputData(1, false);
            this.setOutputData(2, 0);
            this.enabled = false;
        }
        if (!input && this.inputs[0].updated) {
            this.setOutputData(1, true);
            this.setOutputData(2, delay);
            this.clearTimers();
            this.enabled = true;
            this.timeoutFunc = setTimeout(() => {
                this.enabled = false;
                this.setOutputData(0, false);
                this.setOutputData(1, false);
                this.setOutputData(2, 0);
                clearInterval(this.remainingFunc);
            }, delayMilli);
            switch (this.timeUnits) {
                case time_utils_1.TIME_TYPE.MILLISECONDS:
                    this.remainingUpdateMillis = 500;
                    this.remainingUpdateSize = 500;
                    break;
                case time_utils_1.TIME_TYPE.SECONDS:
                    this.remainingUpdateMillis = 1000;
                    this.remainingUpdateSize = 1;
                    break;
                case time_utils_1.TIME_TYPE.MINUTES:
                    this.remainingUpdateMillis = 6000;
                    this.remainingUpdateSize = 0.1;
                    break;
                case time_utils_1.TIME_TYPE.HOURS:
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
                this.clearTimers();
                this.enabled = false;
            }
        }
    }
    clearTimers() {
        if (this.timeoutFunc)
            clearTimeout(this.timeoutFunc);
        if (this.remainingFunc)
            clearInterval(this.remainingFunc);
    }
}
container_1.Container.registerNodeType('boolean/off-delay', DelayOffNode);
//# sourceMappingURL=off-delay.js.map