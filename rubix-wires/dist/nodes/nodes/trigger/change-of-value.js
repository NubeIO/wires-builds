"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const time_utils_1 = require("../../utils/time-utils");
class COVNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Change Of Value';
        this.description =
            "when 'input' changes value, output becomes 'true' for 'interval' duration, then 'output' changes back to 'false'.  For Numeric 'input' values, the change of value must be greater than the 'threshold' value to trigger the output.";
        this.addInput('input', node_io_1.Type.ANY);
        this.addInputWithSettings('interval', node_io_1.Type.NUMBER, 1, 'Interval');
        this.addInputWithSettings('threshold', node_io_1.Type.NUMBER, 0, 'COV Threshold');
        this.addOutput('output', node_io_1.Type.BOOLEAN);
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
    }
    onAdded() {
        this.setOutputData(0, false);
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
    }
    onInputUpdated() {
        const input = this.getInputData(0);
        const isNumber = typeof input === 'number';
        if (this.inputs[0].updated && input !== this.lastValue) {
            if (typeof this.lastValue !== 'number' ||
                !isNumber ||
                (isNumber && Math.abs(input - this.lastValue) >= this.getInputData(2))) {
                this.lastValue = input;
                this.setOutputData(0, true);
                const interval = time_utils_1.default.timeConvert(this.getInputData(1), this.settings['time'].value);
                if (this.timeoutFunc)
                    clearTimeout(this.timeoutFunc);
                this.timeoutFunc = setTimeout(() => {
                    this.setOutputData(0, false);
                }, interval);
            }
        }
    }
    onAfterSettingsChange() {
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
    }
}
container_1.Container.registerNodeType('trigger/change-of-value', COVNode);
//# sourceMappingURL=change-of-value.js.map