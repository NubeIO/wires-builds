"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const time_utils_1 = require("../../utils/time-utils");
class DelayNode extends node_1.Node {
    constructor() {
        super();
        this.delayedValues = [];
        this.title = 'Stream Delay';
        this.description =
            "‘input' values are passed to 'output' after a 'delay' period. Each 'input' value is delayed by the same 'delay' period. 'delay' units can be configured from settings. Maximum ‘delay’ setting is 587 hours.";
        this.addInput('input');
        this.addInputWithSettings('delay', node_io_1.Type.NUMBER, 1000, 'Delay (millis)', false);
        this.addOutput('output');
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
    }
    onAdded() {
        this.inputs[1]['name'] = `[delay] (${this.settings['time'].value})`;
    }
    onAfterSettingsChange() {
        this.inputs[1]['name'] = `[delay] (${this.settings['time'].value})`;
    }
    onInputUpdated() {
        if (this.inputs[0].updated)
            this.delayedValues.push({
                val: this.inputs[0].data,
                time: Date.now(),
            });
    }
    onExecute() {
        if (this.delayedValues.length == 0)
            return;
        let delay = this.getInputData(1);
        delay = time_utils_1.default.timeConvert(delay, this.settings['time'].value);
        const val = this.delayedValues[0];
        if (Date.now() - val.time >= delay) {
            this.delayedValues.shift();
            this.setOutputData(0, val.val);
            return;
        }
    }
}
container_1.Container.registerNodeType('streams/stream-delay', DelayNode);
//# sourceMappingURL=stream-delay.js.map