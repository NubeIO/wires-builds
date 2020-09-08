"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const time_utils_1 = require("../../utils/time-utils");
class WaveformNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Waveform';
        this.description =
            "This node generates a sequence of numbers based on the selected settings; these sequences (waveforms) are of the form 'Ramp', 'Sine', 'Square', 'Triangle', and 'Sawtooth'. While 'enable' is 'true', 'output' will produce the next number in the sequence after every 'interval' duration. The period (how often the waveform pattern repeats) is defined by 'period'. The amplitude of the waveform is defined by 'amplitude'. The waveform can be inverted by setting 'Invert Output' to 'true' in settings. The waveform will reset to its starting position if 'reset' transitions from 'false' to 'true'.  'interval' and ‘period’ units can be configured from settings.  Maximum 'interval' and ‘period’ setting is 587 hours.";
        this.addInputWithSettings('enable', node_io_1.Type.BOOLEAN, 0, 'min', false);
        this.settings['signalType'] = {
            description: 'Signal Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'Ramp', text: 'Ramp' },
                    { value: 'Sine', text: 'Sine' },
                    { value: 'Square', text: 'Square' },
                    { value: 'Triangle', text: 'Triangle' },
                    { value: 'Sawtooth', text: 'Sawtooth' },
                ],
            },
            value: 'Ramp',
        };
        this.addInputWithSettings('interval', node_io_1.Type.NUMBER, 1, 'Interval', false);
        this.addInputWithSettings('period', node_io_1.Type.NUMBER, 10, 'Period', false);
        this.addInputWithSettings('amplitude', node_io_1.Type.NUMBER, 1, 'Amplitude', false);
        this.addInput('reset', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.BOOLEAN);
        this.settings['intervalTime'] = {
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
        this.settings['periodTime'] = {
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
            groups: [
                { interval: { weight: 2 }, intervalTime: {} },
                { period: { weight: 2 }, periodTime: {} },
                { amplitude: {} },
            ],
        });
        this.settings['enable'] = { description: 'Enable', value: true, type: node_1.SettingType.BOOLEAN };
        this.settings['invert'] = {
            description: 'Invert Output',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.lastReset = false;
        this.startTime = Date.now();
    }
    onAdded() {
        this.updateTitle();
        this.inputs[1]['name'] = `[interval] (${this.settings['intervalTime'].value})`;
        this.inputs[2]['name'] = `[period] (${this.settings['periodTime'].value})`;
        this.onInputUpdated();
    }
    onExecute() {
        if (!this.getInputData(0))
            return;
        let interval = this.getInputData(1);
        interval = time_utils_1.default.timeConvert(interval, this.settings['intervalTime'].value);
        const now = Date.now();
        if (!this.lastTime) {
            this.lastTime = now;
        }
        if (now - this.lastTime >= interval) {
            this.recalculate();
        }
    }
    onInputUpdated() {
        const reset = this.getInputData(4);
        if (reset && !this.lastReset) {
            this.setOutputData(0, 0, false);
            this.startTime = Date.now();
        }
        this.lastReset = reset;
        if (!this.getInputData(0)) {
            return;
        }
        this.recalculate();
    }
    recalculate() {
        const now = Date.now();
        const signalType = this.settings['signalType'].value || 'Ramp';
        let period = this.getInputData(2);
        period = time_utils_1.default.timeConvert(period, this.settings['periodTime'].value) / 1000;
        const amplitude = this.getInputData(3);
        const invert = this.settings['invert'].value ? -1 : 1;
        let time = (now - this.startTime) / 1000;
        let t = (time % period) / period;
        let value = 0;
        switch (signalType) {
            case 'Sine':
                value = Math.sin(2 * Math.PI * t);
                break;
            case 'Square':
                value = Math.sign(Math.sin(2 * Math.PI * t));
                if (value === -1) {
                    value = 0;
                }
                break;
            case 'Triangle':
                value = 1 - 4 * Math.abs(Math.round(t - 0.25) - (t - 0.25));
                break;
            case 'Sawtooth':
                value = t;
                break;
            case 'Ramp':
                value = 2 * Math.abs(Math.round(t) - t);
                break;
        }
        value = invert * amplitude * value;
        this.lastTime = now;
        this.setOutputData(0, value);
    }
    onAfterSettingsChange() {
        this.updateTitle();
        this.inputs[1]['name'] = `[interval] (${this.settings['intervalTime'].value})`;
        this.inputs[2]['name'] = `[period] (${this.settings['periodTime'].value})`;
    }
    updateTitle() {
        if (!this.settings['signalType'].value)
            return;
        const signalType = this.settings['signalType'].value;
        this.title = 'Waveform' + ' ' + '(' + signalType + ')';
    }
}
container_1.Container.registerNodeType('count/waveform', WaveformNode);
//# sourceMappingURL=waveform.js.map