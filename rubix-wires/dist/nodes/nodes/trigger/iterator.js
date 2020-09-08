"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const time_utils_1 = require("../../utils/time-utils");
class TimeIteratorNode extends node_1.Node {
    constructor() {
        super();
        this.state = false;
        this.runState = true;
        this.complete = false;
        this.lastStart = false;
        this.lastStop = false;
        this.count = 0;
        this.reqInterval = null;
        this.reqIterations = null;
        this.title = 'Iterator';
        this.description =
            "This node generates a sequence of 'true' messages at 'output'. If the 'Generate False' setting is ticked (default), then a 'false' message will be sent between each 'true' at 'output'. The number of 'true' messages sent will be equal to 'iterations' value; these values are sent over the 'interval' duration (unless interrupted by ‘stop’ inputs). For example, if 'interval' is set to 5 (seconds) and 'iterations' is set to 5, a 'true' message will be sent from 'output' every 1000 millis. If 'stop’ input is ‘true’ then the next ‘true’ value will not be sent from ‘output’ until ‘stop’ is ‘false’ again. ‘interval’ units can be configured from settings. Maximum ‘interval’ setting is 587 hours.";
        this.addInputWithSettings('interval', node_io_1.Type.NUMBER, 10, 'Interval', false);
        this.addInputWithSettings('iterations', node_io_1.Type.NUMBER, 5, 'Iterations', false);
        this.addInput('start', node_io_1.Type.BOOLEAN);
        this.addInput('stop', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.BOOLEAN);
        this.addOutput('complete', node_io_1.Type.BOOLEAN);
        this.addOutput('count', node_io_1.Type.NUMBER);
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
        this.settings['false'] = {
            description: 'Generate False',
            value: true,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    onAdded() {
        clearInterval(this.timeoutFunc);
        this.setOutputData(0, false);
        this.setOutputData(1, false);
        this.inputs[0]['name'] = `[interval] (${this.settings['time'].value})`;
        this.lastStart = false;
        this.lastStop = false;
        this.complete = true;
        this.count = 0;
        this.onInputUpdated();
    }
    start() {
        this.runState = true;
        if (this.settings['false'].value) {
            this.timeoutFunc = setInterval(() => {
                if (this.state == true) {
                    this.state = false;
                    this.setOutputData(0, false);
                    if (this.count >= this.reqIterations) {
                        clearInterval(this.timeoutFunc);
                        this.setOutputData(1, false);
                        this.complete = true;
                        this.runState = false;
                    }
                }
                else {
                    this.state = true;
                    this.setOutputData(0, true);
                    this.count++;
                    this.setOutputData(2, this.count);
                }
            }, this.reqInterval / (this.reqIterations * 2 - 1));
        }
        else {
            this.timeoutFunc = setInterval(() => {
                this.state = true;
                this.setOutputData(0, true);
                this.count++;
                this.setOutputData(2, this.count);
                if (this.count >= this.reqIterations) {
                    clearInterval(this.timeoutFunc);
                    this.complete = true;
                    this.runState = false;
                }
            }, this.reqInterval / (this.reqIterations - 1));
        }
    }
    onInputUpdated() {
        let stop = this.getInputData(3);
        if (stop && !this.lastStop && !this.complete) {
            this.lastStop = stop;
            if (this.settings['false'].value) {
                this.state = false;
                this.setOutputData(0, false);
            }
            clearInterval(this.timeoutFunc);
            this.runState = false;
            return;
        }
        if (!stop && this.lastStop && !this.complete) {
            this.lastStop = stop;
            this.start();
            return;
        }
        this.lastStop = stop;
        let start = this.getInputData(2);
        if (start && !this.lastStart) {
            this.lastStart = start;
            clearInterval(this.timeoutFunc);
            this.count = 0;
            if (this.settings['false'].value) {
                this.state = false;
                this.setOutputData(0, false);
            }
            let interval = this.getInputData(0);
            interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
            const iterations = this.getInputData(1);
            if (iterations <= 0 || interval <= 0) {
                this.runState = false;
                return;
            }
            this.reqInterval = interval;
            this.reqIterations = iterations;
            this.setOutputData(0, true);
            this.state = true;
            this.complete = false;
            this.count++;
            this.setOutputData(2, this.count);
            if (stop) {
                if (this.settings['false'].value) {
                    setTimeout(() => {
                        this.runState = false;
                        this.state = false;
                        this.setOutputData(0, false);
                    }, interval / (iterations * 2 - 1));
                    return;
                }
                this.runState = false;
                return;
            }
            else
                this.start();
        }
        this.lastStart = start;
    }
    onAfterSettingsChange() {
        this.inputs[0]['name'] = `[interval] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
}
exports.TimeIteratorNode = TimeIteratorNode;
container_1.Container.registerNodeType('trigger/iterator', TimeIteratorNode);
//# sourceMappingURL=iterator.js.map