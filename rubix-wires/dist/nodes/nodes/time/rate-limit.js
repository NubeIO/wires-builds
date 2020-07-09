"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const time_utils_1 = require("../../utils/time-utils");
class RateLimitNode extends node_1.Node {
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
        this.throttleType = 'rate';
        this.timeLimitType = 'seconds';
        this.timeLimit = Number(5);
        this.countLimit = Number(5);
        this.blockSize = Number(5);
        this.locked = false;
        this.time = this.locked ? Math.floor(Date.now()) : 0;
        this.count = this.locked ? 1 : 0;
        this.block = this.locked ? this.blockSize + 1 : 0;
        this.reset = !!this.locked;
        this.title = 'Rate Limit';
        this.description = '';
        this.settings['type'] = {
            description: 'Function Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'time', text: 'time' },
                    { value: 'count', text: 'count' },
                    { value: 'block', text: 'block' },
                    { value: 'reset', text: 'reset' },
                ],
            },
            value: 'time',
        };
        this.addInput('run', node_1.Type.BOOLEAN);
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addInputWithSettings('interval', node_1.Type.NUMBER, 1, 'Count Interval', false);
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
        this.addOutput('out', node_1.Type.NUMBER);
        this.addOutput('locked', node_1.Type.BOOLEAN);
        this.addOutput('messages', node_1.Type.STRING);
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
        this.settings['count'] = {
            description: 'Count Setting',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['block'] = {
            description: 'Block size',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.setOutputData(0, null);
    }
    onAdded() {
        this.updateTitle();
        this.inputs[2]['name'] = `[interval] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
    onInputUpdated() {
        let msg = this.getInputData(0);
        let reset = this.getInputData(1);
        this.throttleType = this.settings['type'].value;
        this.timeLimitType = this.settings['time'].value;
        let interval = this.getInputData(2);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        this.timeLimit = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        this.countLimit = this.settings['count'].value;
        if (this.throttleType === 'time') {
            if (isNaN(this.timeLimit) || !isFinite(this.timeLimit)) {
            }
            let now = Math.floor(Date.now());
            if (this.time + this.timeLimit < now) {
                this.time = now;
                this.setOutputData(0, msg);
                this.setOutputData(1, false);
                this.setOutputData(2, 'pass messages');
            }
            else {
                this.setOutputData(1, true);
                this.setOutputData(2, `locked please wait ${interval} ${this.settings['time'].value}`);
            }
        }
        else if (this.throttleType === 'count') {
            if (isNaN(this.countLimit) || !isFinite(this.countLimit)) {
            }
            ++this.count;
            if (this.count >= this.countLimit) {
                this.count = 0;
            }
            if (this.countLimit === 0 || this.countLimit === 1 || this.count === 1) {
                this.setOutputData(0, msg);
                this.setOutputData(1, false);
            }
            else
                this.setOutputData(1, true);
        }
        else if (this.throttleType === 'block') {
            if (isNaN(this.blockSize) || !isFinite(this.blockSize)) {
            }
            ++this.block;
            if (this.block <= this.blockSize) {
                let bockCalc = this.blockSize - this.block;
                this.setOutputData(0, msg);
                this.setOutputData(1, false);
                this.setOutputData(2, 'block size is full in ' + bockCalc + ' ' + 'messages');
            }
            else if (reset) {
                this.block = 0;
            }
            else
                this.setOutputData(1, true);
            this.setOutputData(2, 'locked in use the reset input on unlock');
        }
        else if (this.throttleType === 'reset') {
            if (!this.reset) {
                this.reset = true;
                this.setOutputData(0, msg);
                this.setOutputData(1, false);
                this.setOutputData(2, 'not locked');
            }
            else if (reset) {
                this.reset = false;
            }
            else
                this.setOutputData(1, true);
            this.setOutputData(2, 'locked in use the reset input on unlock');
        }
        else {
            this.setOutputData(2, "unknown throttle type '" + this.throttleType + "'", msg);
        }
    }
    onAfterSettingsChange() {
        this.updateTitle();
        this.inputs[2]['name'] = `[interval] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
    updateTitle() {
        let title = this.settings['type'].value;
        this.title = 'Rate Limit (Type =' + ' ' + title + ')';
    }
}
container_1.Container.registerNodeType('time/rate-limit', RateLimitNode);
//# sourceMappingURL=rate-limit.js.map