"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const time_utils_1 = require("../../utils/time-utils");
class ClockNode extends node_1.Node {
    constructor() {
        super();
        this.lastInterval = 1000;
        this.title = 'Clock';
        this.description =
            "Outputs the System Time in various forms. Standard outputs are: Time('timeString') Hours('hour'), Minutes('min'), and Seconds('sec'). There are also Advanced outputs which can be enabled from settings. The Advanced outputs are: Milliseconds(millis), Time String including timezone ('longString'), Timezone Offset from UTC('TZOffset'), and Unix Timestamp ('epoch'). ‘interval’ is the output update frequency.   ‘interval’ units can be configured from settings. Maximum ‘interval’ setting is 587 hours.";
        this.addOutput('timeString', node_1.Type.STRING);
        this.addOutput('hour', node_1.Type.NUMBER);
        this.addOutput('min', node_1.Type.NUMBER);
        this.addOutput('sec', node_1.Type.NUMBER);
        this.addInputWithSettings('interval', node_1.Type.NUMBER, 1, 'Interval');
        this.settings['time'] = {
            description: 'Time',
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
            groups: [{ time: {}, interval: { weight: 2 } }],
        });
        this.settings['advanced'] = {
            description: 'Show Advanced Options',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.properties['advancedOutputs'] = false;
    }
    init() {
        if (this.settings['advanced'].value) {
            this.addOutputs();
        }
    }
    onAdded() {
        this.inputs[0]['name'] = `[interval] (${this.settings['time'].value})`;
        clearInterval(this.timeoutFunc);
        let interval = this.getInputData(0);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        this.timeoutFunc = setInterval(() => {
            this.recalculate();
        }, interval);
        this.lastInterval = interval;
        this.recalculate();
    }
    onInputUpdated() {
        let interval = this.getInputData(0);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        if (interval != this.lastInterval) {
            this.lastInterval = interval;
            clearInterval(this.timeoutFunc);
            this.timeoutFunc = setInterval(() => {
                this.recalculate();
            }, interval);
        }
    }
    recalculate() {
        const advanced = this.settings['advanced'].value;
        let now = new Date();
        this.setOutputData(0, now.toLocaleTimeString(), true);
        this.setOutputData(1, now.getHours(), true);
        this.setOutputData(2, now.getMinutes(), true);
        this.setOutputData(3, now.getSeconds(), true);
        if (advanced) {
            this.setOutputData(4, now.getMilliseconds(), true);
            this.setOutputData(5, now.toTimeString(), true);
            this.setOutputData(6, now.getTimezoneOffset() / -60, true);
            this.setOutputData(7, now.valueOf(), true);
        }
    }
    onAfterSettingsChange() {
        const advanced = this.settings['advanced'].value;
        this.inputs[0]['name'] = `[interval] (${this.settings['time'].value})`;
        if (advanced && !this.properties['advancedOutputs']) {
            this.addOutputs();
            this.properties['advancedOutputs'] = true;
            this.persistProperties();
        }
        else if (!advanced && this.properties['advancedOutputs']) {
            this.removeOutput(4);
            this.removeOutput(5);
            this.removeOutput(6);
            this.removeOutput(7);
            this.properties['advancedOutputs'] = false;
            this.persistProperties();
        }
        this.updateNodeOutput();
        this.onInputUpdated();
    }
    addOutputs() {
        this.addOutput('millis', node_1.Type.NUMBER);
        this.addOutput('longString', node_1.Type.STRING);
        this.addOutput('TZOffset', node_1.Type.NUMBER);
        this.addOutput('epoch', node_1.Type.NUMBER);
    }
    persistProperties() {
        if (!this.container.db)
            return;
        this.container.db.updateNode(this.id, this.container.id, {
            $set: {
                properties: this.properties,
            },
        });
    }
}
exports.ClockNode = ClockNode;
container_1.Container.registerNodeType('time/clock', ClockNode);
//# sourceMappingURL=clock.js.map