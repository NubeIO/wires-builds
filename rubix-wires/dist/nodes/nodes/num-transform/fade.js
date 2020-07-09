"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const time_utils_1 = require("../../utils/time-utils");
class TimeFadeNode extends node_1.Node {
    constructor() {
        super();
        this.updateInterval = 500;
        this.title = 'Fade';
        this.description =
            "This node makes a smooth transition from 'from' to 'to' over the 'interval' period when 'enable' transitions from 'false' to 'true'; after this 'interval' period 'output' will match the 'to' value while 'enable' is 'true'.  During the 'interval' period, the rate of 'output' change cannot be changed.  Once the 'interval' period is complete 'out=to' becomes 'true' until 'enable' becomes 'false' again.";
        this.addInput('enable', node_1.Type.BOOLEAN);
        this.addInputWithSettings('interval', node_1.Type.NUMBER, 1, 'Interval', false);
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
        this.addInputWithSettings('from', node_1.Type.NUMBER, 0, 'To Value', false);
        this.addInputWithSettings('to', node_1.Type.NUMBER, 100, 'From Value', false);
        this.addOutput('output');
        this.addOutput('out=to');
        this.updateInterval = 250;
    }
    onAdded() {
        this.lastEnable = false;
        this.timerFinished = false;
        this.setOutputData(1, false);
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
    onAfterSettingsChange() {
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
    }
    onInputUpdated() {
        const enable = this.getInputData(0);
        if (!enable && this.lastEnable) {
            clearInterval(this.timeoutFunc);
            this.setOutputData(0, 0);
            this.setOutputData(1, false);
            this.timerFinished = false;
            this.lastEnable = enable;
            return;
        }
        else if (!enable) {
            this.setOutputData(0, 0, true);
            this.setOutputData(1, false, true);
            return;
        }
        const to = this.getInputData(3);
        if (enable && this.timerFinished) {
            this.setOutputData(0, to, true);
            this.setOutputData(1, true, true);
            return;
        }
        const from = this.getInputData(2);
        let interval = this.getInputData(1);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        if (enable && !this.lastEnable) {
            this.stepSize = (to - from) / (interval / this.updateInterval);
            this.currentVal = from;
            this.timeoutFunc = setInterval(() => {
                this.update();
            }, this.updateInterval);
        }
        else if (!enable && this.lastEnable) {
            clearInterval(this.timeoutFunc);
            this.setOutputData(0, 0);
            this.timerFinished = false;
        }
        this.lastEnable = enable;
    }
    update() {
        let to = this.getInputData(3);
        const val = this.currentVal + this.stepSize;
        if (val >= to) {
            clearInterval(this.timeoutFunc);
            this.setOutputData(0, to);
            this.setOutputData(1, true);
            this.timerFinished = true;
            this.currentVal = 0;
            return;
        }
        else {
            this.currentVal = val;
            this.setOutputData(0, val);
        }
    }
}
container_1.Container.registerNodeType('num-transform/fade', TimeFadeNode);
//# sourceMappingURL=fade.js.map