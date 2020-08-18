"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const time_utils_1 = require("../../utils/time-utils");
class StopwatchNode extends node_1.Node {
    constructor() {
        super();
        this.lastRunVal = false;
        this.lastResetVal = false;
        this.lastInterval = 100;
        this.runState = false;
        this.startTime = null;
        this.elapsed = 0;
        this.units = 1;
        this.digits = 3;
        this.title = 'Stopwatch';
        this.description =
            "This node converts between Time units Days('day'), Hours('hour'), Minutes('min'), Seconds('sec'), and Milliseconds('milli'). Input type can be selected from settings. Outputs will change based on selected input type. The number of decimal places that output values have can be set from the 'Precision' setting.  ‘interval’ units can be configured from settings. Maximum ‘interval’ setting is 587 hours.";
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, 0, 'Enable', false);
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.settings['units'] = {
            description: 'Output Units',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 1, text: 'Milliseconds' },
                    { value: 1000, text: 'Seconds' },
                    { value: 60000, text: 'Minutes' },
                    { value: 3.6e6, text: 'Hours' },
                    { value: 8.64e7, text: 'Days' },
                ],
            },
            value: 1,
        };
        this.addInputWithSettings('interval', node_1.Type.NUMBER, 200, 'Count Interval', false);
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
            value: 'milliseconds',
        };
        this.setSettingsConfig({
            groups: [{ interval: { weight: 2 }, time: {} }],
        });
        this.addOutput('elapsed', node_1.Type.NUMBER);
        this.setOutputData(0, null);
        this.elapsed = 0;
    }
    onAdded() {
        this.runState = false;
        this.setOutputData(0, this.elapsed);
        this.inputs[2]['name'] = `[interval] (${this.settings['time'].value})`;
        this.outputs[0]['name'] = '[elapsed] (milliseconds)';
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        let run = this.getInputData(0);
        let reset = this.getInputData(1);
        if (reset && !this.lastResetVal) {
            this.elapsed = 0;
            this.startTime = Date.now();
            this.setOutputData(0, 0, true);
        }
        this.lastResetVal = reset;
        let interval = this.getInputData(2);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        if (interval != this.lastInterval && this.runState) {
            clearInterval(this.timeoutFunc);
            this.setOutputData(0, Date.now() - this.startTime + this.elapsed, true);
            this.timeoutFunc = setInterval(() => {
                const output = (Date.now() - this.startTime + this.elapsed) / this.units;
                this.setOutputData(0, utils_1.default.toFixedNumber(output, this.digits), true);
            }, interval);
            this.lastInterval = interval;
        }
        if (run && !this.lastRunVal) {
            this.setOutputData(0, this.elapsed, true);
            this.runState = true;
            this.startTime = Date.now();
            this.timeoutFunc = setInterval(() => {
                const output = (Date.now() - this.startTime + this.elapsed) / this.units;
                this.setOutputData(0, utils_1.default.toFixedNumber(output, this.digits), true);
            }, interval);
            this.lastRunVal = run;
        }
        else if (!run && this.lastRunVal) {
            clearInterval(this.timeoutFunc);
            this.elapsed = Date.now() - this.startTime + this.elapsed;
            this.runState = false;
            this.setOutputData(0, this.elapsed, true);
            this.lastRunVal = run;
        }
    }
    onAfterSettingsChange() {
        this.inputs[2]['name'] = `[interval] (${this.settings['time'].value})`;
        this.units = Number(this.settings['units'].value);
        switch (this.units) {
            case 1:
                this.outputs[0]['name'] = '[elapsed] (milliseconds)';
                break;
            case 1000:
                this.outputs[0]['name'] = '[elapsed] (seconds)';
                break;
            case 60000:
                this.outputs[0]['name'] = '[elapsed] (minutes)';
                break;
            case 3.6e6:
                this.outputs[0]['name'] = '[elapsed] (hours)';
                break;
            case 8.64e7:
                this.outputs[0]['name'] = '[elapsed] (days)';
                break;
            default:
                this.outputs[0]['name'] = '[elapsed] (milliseconds)';
        }
        const output = Number(this.outputs[0].data) / this.units;
        this.setOutputData(0, utils_1.default.toFixedNumber(output, this.digits), true);
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('time/stopwatch', StopwatchNode);
//# sourceMappingURL=stopwatch.js.map