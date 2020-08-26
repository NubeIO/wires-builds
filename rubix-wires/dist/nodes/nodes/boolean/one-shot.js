"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const time_utils_1 = require("../../utils/time-utils");
class OneShotNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'One Shot';
        this.description =
            "Triggers output to 'true' for 'interval' duration when 'trigger' input transitions from 'false' to 'true.  Output is reset to 'false' when 'reset' transitions from 'false' to 'true. 'interval' units can be configured from settings. Maximum ‘interval’ setting is 587 hours. (See Figure A.).  If 'Retrigger While Output Is 'true'' setting is false, then 'fire' input transitions will have an effect when output is 'false'.";
        this.addInput('trigger', node_1.Type.BOOLEAN);
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addInputWithSettings('interval', node_1.Type.NUMBER, 1, 'Interval (Max is 597 Hours)');
        this.addOutput('output', node_1.Type.BOOLEAN);
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
            groups: [{ interval: { weight: 2 }, time: {} }],
        });
        this.settings['retrigger'] = {
            description: "Retrigger While Output is 'true'?",
            value: true,
            type: node_1.SettingType.BOOLEAN,
        };
        this.setOutputData(0, false);
        this.setOutputData(1, 0);
        this.lastFireValue = false;
        this.lastResetValue = false;
        this.enabled = false;
    }
    onCreated() {
        this.setOutputData(0, false);
        this.timeUnits = 'seconds';
    }
    onAdded() {
        this.inputs[2]['name'] = `[interval] (${this.settings['time'].value})`;
        this.outputs[1]['name'] = `[remaining] (${this.settings['time'].value})`;
        this.setOutputData(0, false);
        this.setOutputData(1, 0);
        this.onInputUpdated();
    }
    onAfterSettingsChange() {
        this.timeUnits = this.settings['time'].value;
        this.inputs[2]['name'] = `[interval] (${this.settings['time'].value})`;
        this.outputs[1]['name'] = `[remaining] (${this.timeUnits})`;
        this.onInputUpdated();
    }
    onInputUpdated() {
        const delay = this.getInputData(2);
        const delayMilli = time_utils_1.default.timeConvert(delay, this.timeUnits);
        let reset = this.getInputData(1);
        if (reset == null)
            reset = false;
        if (reset == true && reset != this.lastResetValue) {
            clearTimeout(this.timeoutFunc);
            clearTimeout(this.remainingFunc);
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
                clearTimeout(this.timeoutFunc);
                clearTimeout(this.remainingFunc);
                this.setOutputData(0, true);
                this.setOutputData(1, delay);
                this.enabled = true;
                this.timeoutFunc = setTimeout(() => {
                    this.enabled = false;
                    this.setOutputData(0, false);
                    this.setOutputData(1, 0);
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
                    const remaining = this.outputs[1].data - this.remainingUpdateSize;
                    this.setOutputData(1, remaining);
                }, this.remainingUpdateMillis);
            }
        }
        this.lastFireValue = fire;
    }
}
container_1.Container.registerNodeType('boolean/one-shot', OneShotNode);
//# sourceMappingURL=one-shot.js.map