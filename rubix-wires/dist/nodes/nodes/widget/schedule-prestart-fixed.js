"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const time_utils_1 = require("../../utils/time-utils");
class SchedulePrestartFixedNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Schedule Prestart Fixed';
        this.description =
            'This node provides a pre-start function based on fixed settings.  Conditions are evaluated every 30 seconds.';
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, true, 'Enable');
        this.addInput('temp', node_1.Type.NUMBER);
        this.addInput('SP', node_1.Type.NUMBER);
        this.addInput('scheduleNextStart', node_1.Type.NUMBER);
        this.addInput('reset', node_1.Type.NUMBER);
        this.addOutput('output', node_1.Type.STRING);
        this.settings['condition1_range1'] = {
            description: 'temp > (SP + ?):',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition1_range2'] = {
            description: 'temp <= (SP + ?)',
            value: 2.5,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition1_time'] = {
            description: 'Prestart Time (Mins)',
            value: 20,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition2_range1'] = {
            description: 'temp > (SP + ?):',
            value: 2.5,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition2_range2'] = {
            description: 'temp <= (SP + ?)',
            value: 5,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition2_time'] = {
            description: 'Prestart Time (Mins)',
            value: 40,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition3_range1'] = {
            description: 'temp > (SP + ?):',
            value: 5,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition3_range2'] = {
            description: 'temp <= (SP + ?)',
            value: 100,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition3_time'] = {
            description: 'Prestart Time (Mins)',
            value: 60,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition4_range1'] = {
            description: 'temp > (SP + ?):',
            value: null,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition4_range2'] = {
            description: 'temp <= (SP + ?)',
            value: null,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition4_time'] = {
            description: 'Prestart Time (Mins)',
            value: null,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition5_range1'] = {
            description: 'temp > (SP + ?):',
            value: null,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition5_range2'] = {
            description: 'temp <= (SP + ?)',
            value: null,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition5_time'] = {
            description: 'Prestart Time (Mins)',
            value: null,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition6_range1'] = {
            description: 'temp < (SP + ?):',
            value: -1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition6_range2'] = {
            description: 'temp >= (SP + ?)',
            value: -2.5,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition6_time'] = {
            description: 'Prestart Time (Mins)',
            value: 30,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition7_range1'] = {
            description: 'temp < (SP + ?):',
            value: -2.5,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition7_range2'] = {
            description: 'temp >= (SP + ?)',
            value: -5,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition7_time'] = {
            description: 'Prestart Time (Mins)',
            value: 40,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition8_range1'] = {
            description: 'temp < (SP + ?):',
            value: -5,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition8_range2'] = {
            description: 'temp >= (SP + ?)',
            value: -100,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition8_time'] = {
            description: 'Prestart Time (Mins)',
            value: 60,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition9_range1'] = {
            description: 'temp < (SP + ?):',
            value: null,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition9_range2'] = {
            description: 'temp >= (SP + ?)',
            value: null,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition9_time'] = {
            description: 'Prestart Time (Mins)',
            value: null,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition10_range1'] = {
            description: 'temp < (SP + ?):',
            value: null,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition10_range2'] = {
            description: 'temp >= (SP + ?)',
            value: null,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['condition10_time'] = {
            description: 'Prestart Time (Mins)',
            value: null,
            type: node_1.SettingType.NUMBER,
        };
        this.setSettingsConfig({
            groups: [
                { condition1_range1: {}, condition1_range2: {}, condition1_time: {} },
                { condition2_range1: {}, condition2_range2: {}, condition2_time: {} },
                { condition3_range1: {}, condition3_range2: {}, condition3_time: {} },
                { condition4_range1: {}, condition4_range2: {}, condition4_time: {} },
                { condition5_range1: {}, condition5_range2: {}, condition5_time: {} },
                { condition6_range1: {}, condition6_range2: {}, condition6_time: {} },
                { condition7_range1: {}, condition7_range2: {}, condition7_time: {} },
                { condition8_range1: {}, condition8_range2: {}, condition8_time: {} },
                { condition9_range1: {}, condition9_range2: {}, condition9_time: {} },
                { condition10_range1: {}, condition10_range2: {}, condition10_time: {} },
            ],
        });
    }
    onCreated() {
        this.enabled = false;
        this.EXECUTE_INTERVAL = 30000;
    }
    onAdded() {
        this.EXECUTE_INTERVAL = 30000;
        this.onInputUpdated();
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
        this.onExecute();
    }
    onExecute() {
        const now = new Date().valueOf();
        const enable = this.getInputData(0);
        if (!enable || this.nextStart == null || this.nextStart - now < 0) {
            this.setOutputData(0, false);
            this.enabled = false;
            return;
        }
        if (this.enabled)
            return;
        const temp = this.getInputData(1);
        const setpoint = this.getInputData(2);
        if (temp == null || setpoint == null)
            return;
        for (var i = 1; i <= 10; i++) {
            var fromRange = this.settings[`condition${i}_range1`].value;
            var toRange = this.settings[`condition${i}_range2`].value;
            var time = this.settings[`condition${i}_time`].value;
            if (fromRange == null || toRange == null || time == null)
                continue;
            time = time_utils_1.default.timeConvert(time, 'minutes');
            if (this.nextStart - now <= time) {
                if (i <= 5 && temp > setpoint + fromRange && temp <= setpoint + toRange) {
                    this.enabled = true;
                    this.setOutputData(0, true);
                    return;
                }
                if (i > 5 && temp < setpoint + fromRange && temp >= setpoint + toRange) {
                    this.enabled = true;
                    this.setOutputData(0, true);
                    return;
                }
            }
        }
    }
    onInputUpdated() {
        const enable = this.getInputData(0);
        if (!enable) {
            this.setOutputData(0, false);
            this.enabled = false;
            return;
        }
        const reset = this.getInputData(4);
        if (reset && this.inputs[4].updated) {
            this.enabled = false;
            this.setOutputData(0, false);
        }
        const nextStart = this.getInputData(3);
        if (nextStart == null || nextStart !== this.nextStart) {
            this.nextStart = nextStart;
            this.setOutputData(0, false);
            this.enabled = false;
        }
    }
}
container_1.Container.registerNodeType('widget/schedule-prestart-fixed', SchedulePrestartFixedNode);
//# sourceMappingURL=schedule-prestart-fixed.js.map