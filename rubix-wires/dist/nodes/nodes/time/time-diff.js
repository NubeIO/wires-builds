"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const moment = require("moment");
var TIME_TYPE;
(function (TIME_TYPE) {
    TIME_TYPE["TIME"] = "time string as input (YY:MM:DD)";
    TIME_TYPE["EPOCH"] = "time epoch as input (1597662977823)";
})(TIME_TYPE || (TIME_TYPE = {}));
class TimeDiffNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Date Difference';
        this.description =
            `## Description\n ` +
                ` The is node is used to compare the difference between two timestamps\n ` +
                `## Inputs\n ` +
                ` The inputs can either be sent as a unix timestamp ***epoch*** or as a date string ***YYYY:MM:DD:HH:MM:SS***. Change the settings ***Time input type*** for different input type \n ` +
                `## Outputs (return data type is ***JSON***)\n ` +
                ` ***out-difference-time*** will return the time difference in for example: ***hours: 1, minutes: 30 ***\n ` +
                ` ***out-difference-totals*** will return the time difference in for example: ***hours: 1, minutes: 90 ***\n `;
        this.addInput('time-compare-1', node_1.Type.ANY);
        this.addInput('time-compare-2', node_1.Type.ANY);
        this.addOutput('out-difference-time', node_1.Type.ANY);
        this.addOutput('out-difference-totals', node_1.Type.ANY);
        this.settings['time'] = {
            description: 'Time input type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: TIME_TYPE.TIME, text: TIME_TYPE.TIME },
                    { value: TIME_TYPE.EPOCH, text: TIME_TYPE.EPOCH },
                ],
            },
            value: TIME_TYPE.TIME,
        };
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        const date1 = this.getInputData(0);
        const date2 = this.getInputData(1);
        const timeType = this.settings['time'].value;
        try {
            if (timeType === TIME_TYPE.TIME) {
                this.setOutputData(0, this.diffTime(moment(date1), date2));
                this.setOutputData(1, this.diffTotals(moment(date1), date2));
            }
            else if (timeType === TIME_TYPE.EPOCH) {
                this.setOutputData(0, this.diffTime(moment(parseInt(date1)), moment(parseInt(date2))));
                this.setOutputData(1, this.diffTotals(moment(parseInt(date1)), moment(parseInt(date2))));
            }
        }
        catch (e) {
            this.debugWarn(`ERROR: trying to convert a timezone ${e}`);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
    diffTime(date1, date2) {
        let years = date1.diff(date2, 'year');
        date2.add(years, 'years');
        let months = date1.diff(date2, 'months');
        date2.add(months, 'months');
        let days = date1.diff(date2, 'days');
        date2.add(days, 'days');
        let hours = date1.diff(date2, 'hours');
        date2.add(hours, 'hours');
        let minutes = date1.diff(date2, 'minutes');
        date2.add(minutes, 'minutes');
        let seconds = date1.diff(date2, 'seconds');
        let ms = date1.diff(date2);
        return { years, months, days, hours, minutes, seconds, ms };
    }
    diffTotals(date1, date2) {
        let years = date1.diff(date2, 'year');
        let months = date1.diff(date2, 'months');
        let days = date1.diff(date2, 'days');
        let hours = date1.diff(date2, 'hours');
        let minutes = date1.diff(date2, 'minutes');
        let seconds = date1.diff(date2, 'seconds');
        let ms = date1.diff(date2);
        return { years, months, days, hours, minutes, seconds, ms };
    }
}
exports.TimeDiffNode = TimeDiffNode;
container_1.Container.registerNodeType('time/date-difference', TimeDiffNode);
//# sourceMappingURL=time-diff.js.map