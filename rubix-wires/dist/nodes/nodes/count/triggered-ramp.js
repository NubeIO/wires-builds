"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class TriggeredRamp extends node_1.Node {
    constructor() {
        super();
        this.title = 'Triggered Ramp';
        this.description =
            "'output' changes on every time 'trigger' transitions from 'false' to 'true'. If 'count on true->false?' setting is enabled, 'output' will also change on 'false' to 'true' transition.   'output' will change by the 'step' value on each change (if a full 'step' would cause the output to be greater than 'max', or less than 'min' it will be limited by 'max' or 'min' respectively).  'output' will first ramp up to 'max' then it will change directions and ramp down to 'min'.  'output' will be reset to 'min' when 'reset' transitions from 'false' to 'true. ";
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addInputWithSettings('min', node_io_1.Type.NUMBER, 0, 'min', false);
        this.addInputWithSettings('max', node_io_1.Type.NUMBER, 10, 'max', false);
        this.addInputWithSettings('step', node_io_1.Type.NUMBER, 1, 'Step Size', false);
        this.addInput('reset', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.NUMBER);
        this.settings['countOnFalse'] = {
            description: 'Also count on true->false?',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.countUp = false;
        this.lastTrigger = false;
        this.lastReset = false;
        this.currentVal = 0;
        this.settings['rampUpOnly'] = {
            description: 'Ramp Up Only',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const min = this.getInputData(1);
        const max = this.getInputData(2);
        this.currentVal = Number(this.currentVal);
        if (this.currentVal < min)
            this.currentVal = min;
        else if (this.currentVal > max)
            this.currentVal = max;
        const reset = this.getInputData(4);
        if (reset && !this.lastReset)
            this.currentVal = min;
        this.lastReset = reset;
        const trigger = this.getInputData(0);
        if (trigger != this.lastTrigger) {
            if (this.settings['countOnFalse'].value || trigger) {
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
            this.lastTrigger = trigger;
        }
        this.setOutputData(0, this.currentVal, true);
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('count/triggered-ramp', TriggeredRamp);
//# sourceMappingURL=triggered-ramp.js.map