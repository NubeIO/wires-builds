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
    }
    onAdded() {
        this.inputs[2]['name'] = `[interval] (${this.settings['time'].value})`;
        this.setOutputData(0, false);
        this.setOutputData(1, 0);
        this.onInputUpdated();
    }
    onExecute() {
        let interval = this.getInputData(2);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        const elapsed = Date.now() - this.startTime;
        if (this.enabled) {
            const remaining = interval - elapsed;
            this.setOutputData(1, remaining, true);
        }
        if (elapsed >= interval) {
            this.setOutputData(0, false, true);
            this.setOutputData(1, 0, true);
            this.enabled = false;
        }
    }
    onInputUpdated() {
        let reset = this.getInputData(1);
        if (reset == null)
            reset = false;
        if (reset == true && reset != this.lastResetValue) {
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
                this.startTime = Date.now();
                this.setOutputData(0, true);
                this.setOutputData(1, this.getInputData(1));
                this.enabled = true;
            }
        }
        this.lastFireValue = fire;
        this.onExecute();
    }
    onAfterSettingsChange() {
        this.inputs[2]['name'] = `[interval] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('boolean/one-shot', OneShotNode);
//# sourceMappingURL=one-shot.js.map