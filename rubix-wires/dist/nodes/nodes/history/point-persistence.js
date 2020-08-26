"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const time_utils_1 = require("../../utils/time-utils");
class PointPersistence extends node_1.Node {
    constructor() {
        super();
        this.lastInterval = 1000;
        this.runState = true;
        this.title = 'Point Persistance';
        this.description =
            "This node is used when you want to store the node output on a restart and also to not pass to the output any null values. While 'enable' is 'true', ‘output’ will send 'input' value at every 'interval' period. When 'enable' is 'false', ‘output’ will be 'null'.  ‘interval’ units can be configured from settings. Maximum ‘interval’ setting is 587 hours. On a trigger input the output will be sent even if the enable is set to false";
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, true, 'Enable');
        this.addInput('input', node_1.Type.ANY);
        this.addInputWithSettings('interval', node_1.Type.NUMBER, 30, 'Interval');
        this.addInput('trigger', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.properties['output'] = null;
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
            this.setOutputData(0, this.properties['output']);
            this.runState = false;
            return;
        }
        let interval = this.getInputData(2);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        this.timeoutFunc = setInterval(() => {
            const message = this.getInputData(1);
            this.setOutputData(0, this.properties['output']);
        }, interval);
        this.onInputUpdated();
    }
    onInputUpdated() {
        let trigger = this.getInputData(3);
        const message = this.getInputData(1);
        if (message !== undefined && message !== null && message.length) {
            this.properties['output'] = message;
            this.setOutputData(0, this.properties['output']);
        }
        if (trigger) {
            if (this.properties['output'] !== undefined &&
                this.properties['output'] !== null &&
                this.properties['output'].length) {
                this.setOutputData(0, this.properties['output']);
            }
        }
        const enable = this.getInputData(0);
        if (!enable && this.runState) {
            clearInterval(this.timeoutFunc);
            this.setOutputData(0, this.properties['output']);
            this.runState = false;
            return;
        }
        else if (!enable && !this.runState) {
            this.setOutputData(0, this.properties['output']);
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
                        this.setOutputData(0, this.properties['output']);
                    }, interval);
                }
                return;
            }
            else if (!this.runState) {
                this.runState = true;
                this.timeoutFunc = setInterval(() => {
                    this.setOutputData(0, this.properties['output']);
                }, interval);
            }
        }
    }
    onAfterSettingsChange() {
        this.inputs[2]['name'] = `[interval] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
}
exports.PointPersistence = PointPersistence;
container_1.Container.registerNodeType('history/persistence', PointPersistence);
//# sourceMappingURL=point-persistence.js.map