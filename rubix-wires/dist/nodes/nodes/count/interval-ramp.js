"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const time_utils_1 = require("../../utils/time-utils");
class IntervalRampNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Interval Ramp';
        this.description =
            "‘output' changes at every 'interval' period, while 'enable' is set to 'true'. 'output' will change by the 'step' value on each change (if a full 'step' would cause the output to be greater than 'max', or less than 'min' it will be limited by 'max' or 'min' respectively). 'output' will first ramp up to 'max' then it will change directions and ramp down to 'min'. 'output' will be reset to 'min' when 'reset' transitions from 'false' to 'true. If ‘Ramp Up Only’ setting is ticked, the ramp down stage will be bypassed and ‘output’ will be reset back to ‘min’ value when it reaches the ‘max’ value. 'interval’ units can be configured from settings.  Maximum ‘interval’ setting is 587 hours.";
        this.addInputWithSettings('enable', node_io_1.Type.BOOLEAN, 0, 'Enable', false);
        this.addInputWithSettings('min', node_io_1.Type.NUMBER, 0, 'min', false);
        this.addInputWithSettings('max', node_io_1.Type.NUMBER, 10, 'max', false);
        this.addInputWithSettings('step', node_io_1.Type.NUMBER, 1, 'Step Size', false);
        this.addInputWithSettings('interval', node_io_1.Type.NUMBER, 1, 'Count Interval', false);
        this.addInput('reset', node_io_1.Type.BOOLEAN);
        this.addOutput('out', node_io_1.Type.NUMBER);
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
            groups: [{ interval: { weight: 2 }, time: {} }],
        });
        this.settings['rampUpOnly'] = {
            description: 'Ramp Up Only',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.countUp = true;
        this.lastInterval = 1000;
        this.lastReset = false;
        this.lastEnable = true;
        this.currentVal = 0;
    }
    onAdded() {
        this.timeoutFunc = setInterval(() => {
            const min = this.getInputData(1);
            const max = this.getInputData(2);
            this.count(min, max);
            this.setOutputData(0, this.currentVal, true);
        }, this.lastInterval);
        this.inputs[4]['name'] = `[interval] (${this.settings['time'].value})`;
    }
    onInputUpdated() {
        const min = this.getInputData(1);
        const max = this.getInputData(2);
        this.currentVal = Number(this.currentVal);
        if (this.currentVal < min)
            this.currentVal = min;
        else if (this.currentVal > max)
            this.currentVal = max;
        const reset = Boolean(this.getInputData(5));
        if (reset && !this.lastReset)
            this.currentVal = min;
        this.countUp = true;
        this.lastReset = reset;
        let interval = this.getInputData(4);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        const enable = this.getInputData(0);
        if (enable && !this.lastEnable) {
            this.timeoutFunc = setInterval(() => {
                this.count(min, max);
                this.setOutputData(0, this.currentVal, true);
            }, interval);
        }
        else if (!enable && this.lastEnable) {
            clearInterval(this.timeoutFunc);
            this.setOutputData(0, null);
        }
        else if (enable && this.lastEnable && interval !== this.lastInterval) {
            clearInterval(this.timeoutFunc);
            this.timeoutFunc = setInterval(() => {
                this.count(min, max);
                this.setOutputData(0, this.currentVal, true);
            }, interval);
        }
        this.lastInterval = interval;
        this.lastEnable = enable;
    }
    count(min, max) {
        const step = this.getInputData(3);
        if (this.countUp && this.currentVal + step > max) {
            if (this.settings['rampUpOnly'].value) {
                this.countUp = true;
                this.currentVal = min - step;
            }
            else
                this.countUp = false;
        }
        else if (!this.countUp && this.currentVal - step < min)
            this.countUp = true;
        if (this.countUp)
            this.currentVal += step;
        else
            this.currentVal -= step;
    }
    onAfterSettingsChange() {
        this.inputs[4]['name'] = `[interval] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('count/interval-ramp', IntervalRampNode);
//# sourceMappingURL=interval-ramp.js.map