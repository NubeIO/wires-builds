"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const time_utils_1 = require("../../utils/time-utils");
class InjectNode extends node_1.Node {
    constructor() {
        super();
        this.lastInterval = 1000;
        this.runState = true;
        this.title = 'Interval Inject';
        this.description =
            "While 'enable' is 'true', ‘output’ will send 'message' value at every 'interval' period. When 'enable' is 'false', ‘output’ will be 'null'.  ‘interval’ units can be configured from settings. Maximum ‘interval’ setting is 587 hours.";
        this.addInputWithSettings('enable', node_io_1.Type.BOOLEAN, true, 'Enable');
        this.addInputWithSettings('message', node_io_1.Type.ANY, 'true', 'Message');
        this.addInputWithSettings('interval', node_io_1.Type.NUMBER, 1, 'Interval');
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
        clearInterval(this.timeoutFunc);
        this.inputs[2]['name'] = `[interval] (${this.settings['time'].value})`;
        const enable = this.getInputData(0);
        if (!enable) {
            this.setOutputData(0, null);
            this.runState = false;
            return;
        }
        let interval = this.getInputData(2);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        this.timeoutFunc = setInterval(() => {
            const message = this.getInputData(1);
            this.setOutputData(0, message);
        }, interval);
        this.onInputUpdated();
    }
    onInputUpdated() {
        const enable = this.getInputData(0);
        if (!enable && this.runState) {
            clearInterval(this.timeoutFunc);
            this.setOutputData(0, null, true);
            this.runState = false;
            return;
        }
        else if (!enable && !this.runState) {
            this.setOutputData(0, null, true);
            this.runState = false;
            return;
        }
        else if (enable) {
            let interval = this.getInputData(2);
            interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
            if (this.runState) {
                if (interval != this.lastInterval) {
                    this.lastInterval = interval;
                    clearInterval(this.timeoutFunc);
                    this.timeoutFunc = setInterval(() => {
                        const message = this.getInputData(1);
                        this.setOutputData(0, message);
                    }, interval);
                }
                return;
            }
            else if (!this.runState) {
                this.runState = true;
                this.timeoutFunc = setInterval(() => {
                    const message = this.getInputData(1);
                    this.setOutputData(0, message);
                }, interval);
            }
        }
    }
    onAfterSettingsChange() {
        this.inputs[2]['name'] = `[interval] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
}
exports.InjectNode = InjectNode;
container_1.Container.registerNodeType('trigger/interval-inject', InjectNode);
//# sourceMappingURL=interval-inject.js.map