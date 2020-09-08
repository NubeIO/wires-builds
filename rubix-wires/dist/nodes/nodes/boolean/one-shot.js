"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const time_utils_1 = require("../../utils/time-utils");
class OneShotNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'One Shot';
        this.description =
            "Triggers output to 'true' for 'interval' duration when 'trigger' input transitions from 'false' to 'true.  Output is reset to 'false' when 'reset' transitions from 'false' to 'true. 'interval' units can be configured from settings. Maximum ‘interval’ setting is 587 hours. (See Figure A.).  If 'Retrigger While Output Is 'true'' setting is false, then 'fire' input transitions will have an effect when output is 'false'.";
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addInput('reset', node_io_1.Type.BOOLEAN);
        this.addInputWithSettings('interval', node_io_1.Type.NUMBER, 1, 'Interval (Max is 597 Hours)');
        this.addOutput('output', node_io_1.Type.BOOLEAN);
        this.addOutput('remaining', node_io_1.Type.NUMBER);
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
            groups: [{ interval: { weight: 2 }, time: {} }],
        });
        this.settings['retrigger'] = {
            description: "Retrigger While Output is 'true'?",
            value: true,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    onCreated() {
        this.setOutputData(0, false);
        this.setOutputData(1, 0);
        this.lastFireValue = false;
        this.lastResetValue = false;
        this.enabled = false;
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onAfterSettingsChange() {
        this.timeUnits = this.settings['time'].value;
        this.inputs[2]['name'] = `[interval] (${this.settings['time'].value})`;
        this.outputs[1]['name'] = `[remaining] (${this.timeUnits})`;
        this.onInputUpdated();
    }
    onInputUpdated() {
        let reset = this.getInputData(1);
        if (reset == null)
            reset = false;
        if (reset == true && reset != this.lastResetValue) {
            this.clearTimers();
            this.setOutputData(0, false);
            this.setOutputData(1, 0);
            this.enabled = false;
        }
        this.lastResetValue = reset;
        let fire = this.getInputData(0);
        if (fire == null)
            fire = false;
        if (fire == true && fire != this.lastFireValue) {
            const retrigger = this.settings['retrigger'].value;
            if (retrigger || this.enabled === false) {
                const delay = this.getInputData(2);
                const delayMilli = time_utils_1.default.timeConvert(delay, this.timeUnits);
                this.clearTimers();
                this.setOutputData(0, true);
                this.setOutputData(1, delay);
                this.enabled = true;
                this.timeoutFunc = setTimeout(() => {
                    this.enabled = false;
                    this.setOutputData(0, false);
                    this.setOutputData(1, 0);
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
                    const remaining = this.outputs[1].data - this.remainingUpdateSize;
                    this.setOutputData(1, remaining);
                }, this.remainingUpdateMillis);
            }
        }
        this.lastFireValue = fire;
    }
    clearTimers() {
        if (this.timeoutFunc)
            clearTimeout(this.timeoutFunc);
        if (this.remainingFunc)
            clearInterval(this.remainingFunc);
    }
}
container_1.Container.registerNodeType('boolean/one-shot', OneShotNode);
//# sourceMappingURL=one-shot.js.map