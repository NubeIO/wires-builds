"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const time_utils_1 = require("../../utils/time-utils");
class RateLimitNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Rate-Limit';
        this.description =
            'This node makes a rate limited transition from its current output value to the ‘input’ value.  When ‘enable’ is ‘true’,  ‘output’ is permitted to change towards the ‘input’ value based on settings values.  ‘output’ can change by ‘step’ size every ‘interval’ period.  ‘output’ will be ‘null’ when ‘enable’ is ‘false’.';
        this.addInput('input', node_1.Type.NUMBER);
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, true, 'Enable', false);
        this.addInputWithSettings('step', node_1.Type.NUMBER, 1, 'Step Size', false);
        this.addInputWithSettings('interval', node_1.Type.NUMBER, 1, 'Update Interval', false);
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
        this.addOutput('output', node_1.Type.NUMBER);
        this.lastInterval = 1000;
        this.lastEnable = true;
        this.currentVal = 0;
    }
    onAdded() {
        this.lastInterval = 1000;
        this.lastEnable = true;
        this.currentVal = 0;
        this.setOutputData(0, null);
        this.inputs[3]['name'] = `[interval] (${this.settings['time'].value})`;
        this.timeoutFunc = setInterval(() => {
            this.step();
        }, this.lastInterval);
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        if (input == null) {
            clearInterval(this.timeoutFunc);
            this.setOutputData(0, null);
            this.lastEnable = false;
            return;
        }
        let interval = this.getInputData(3);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        const enable = this.getInputData(1);
        if (enable && !this.lastEnable) {
            this.currentVal = 0;
            this.timeoutFunc = setInterval(() => {
                this.step();
            }, interval);
        }
        else if (!enable && this.lastEnable) {
            clearInterval(this.timeoutFunc);
            this.setOutputData(0, null);
        }
        else if (enable && this.lastEnable && interval !== this.lastInterval) {
            clearInterval(this.timeoutFunc);
            this.timeoutFunc = setInterval(() => {
                this.step();
            }, interval);
        }
        this.lastInterval = interval;
        this.lastEnable = enable;
    }
    step() {
        const step = this.getInputData(2);
        let input = this.getInputData(0);
        if (input >= this.currentVal) {
            this.currentVal = this.currentVal + step;
            if (this.currentVal > input)
                this.currentVal = input;
            this.setOutputData(0, this.currentVal);
        }
        else if (input < this.currentVal) {
            this.currentVal = this.currentVal - step;
            if (this.currentVal < input)
                this.currentVal = input;
            this.setOutputData(0, this.currentVal);
        }
    }
    onAfterSettingsChange() {
        this.inputs[3]['name'] = `[interval] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('num-transform/rate-limit', RateLimitNode);
//# sourceMappingURL=rate-limit.js.map