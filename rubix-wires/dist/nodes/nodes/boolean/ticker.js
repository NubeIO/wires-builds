"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const time_utils_1 = require("../../utils/time-utils");
class TickerNode extends node_1.Node {
    constructor() {
        super();
        this.lastInterval = 1000;
        this.state = false;
        this.runState = true;
        this.title = 'Ticker';
        this.description =
            "While 'enable' is 'true', ‘output’ will change to 'true' at every 'interval' period. If 'Generate False' setting is set to ‘true’, ‘output’ will be 'false' for the second half of the 'interval' period. When 'enable' is 'false', ‘output’ will be 'false'. 'interval' units can be configured from settings.  Maximum ‘interval’ setting is 587 hours.  (See Figure A.)";
        this.addInputWithSettings('enable', node_io_1.Type.BOOLEAN, true, 'Enable');
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
        this.settings['false'] = {
            description: 'Generate False',
            value: true,
            type: node_1.SettingType.BOOLEAN,
        };
        this.setOutputData(0, false);
    }
    onAdded() {
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
        clearInterval(this.timeoutFunc);
        let enable = this.getInputData(0);
        if (!enable) {
            this.setOutputData(0, false);
            this.runState = false;
            return;
        }
        let interval = this.getInputData(1);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        this.timeoutFunc = setInterval(() => {
            this.state = !this.state;
            if (!this.state && this.settings['false'].value) {
                this.setOutputData(0, false);
                return;
            }
            if (this.state)
                this.setOutputData(0, true);
        }, interval / 2);
        this.onInputUpdated();
    }
    onInputUpdated() {
        let enable = this.getInputData(0);
        if (!enable && this.runState) {
            clearInterval(this.timeoutFunc);
            this.setOutputData(0, false, true);
            this.runState = false;
            this.state = false;
            return;
        }
        else if (!enable && !this.runState) {
            this.setOutputData(0, false, true);
            this.runState = false;
            this.state = false;
            return;
        }
        else if (enable) {
            let interval = this.getInputData(1);
            interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
            if (this.runState) {
                if (interval != this.lastInterval) {
                    this.lastInterval = interval;
                    clearInterval(this.timeoutFunc);
                    this.timeoutFunc = setInterval(() => {
                        this.state = !this.state;
                        if (!this.state && this.settings['false'].value) {
                            this.setOutputData(0, false);
                            return;
                        }
                        if (this.state)
                            this.setOutputData(0, true);
                    }, interval / 2);
                }
                return;
            }
            else if (!this.runState) {
                this.runState = true;
                this.state = true;
                this.setOutputData(0, true);
                this.timeoutFunc = setInterval(() => {
                    this.state = !this.state;
                    if (!this.state && this.settings['false'].value) {
                        this.setOutputData(0, false);
                        return;
                    }
                    if (this.state)
                        this.setOutputData(0, true);
                }, interval / 2);
            }
        }
    }
    onAfterSettingsChange() {
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('boolean/ticker', TickerNode);
//# sourceMappingURL=ticker.js.map