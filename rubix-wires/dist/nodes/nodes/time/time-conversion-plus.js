"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const time_utils_1 = require("../../utils/time-utils");
var TIME_TYPE;
(function (TIME_TYPE) {
    TIME_TYPE["TIME"] = "time string as input";
    TIME_TYPE["EPOCH"] = "time epoch as input";
    TIME_TYPE["NEW_TS"] = "time now";
})(TIME_TYPE || (TIME_TYPE = {}));
class TimeConvertPlusNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Time Conversion Json';
        this.description =
            `## Description\n ` +
                ` This node will let you convert a timestamp or unix (epoch) timestamp into date and time parts \n ` +
                ` ## Example output\n ` +
                ` ***{"date":"Mon Aug 17 2020","yearMonthDay":"2020-08-17","year":"2020","month":"Aug","monthAsNumber":"08","dayAsNumber":"17","dayOfYearNumber":"230","day":"Mon","pmOrAm":"PM","hourAsAmPm":"8","hour":"20","timeHourMin":"20:26","time":"20:26:49","minute":"26","minutesSeconds":"26:49","seconds":"49","milliseconds":"000","epoch":"1597660009000","rawDate":"2020-08-17T10:26:49.000Z"}***\n `;
        this.addInput('input', node_io_1.Type.ANY);
        this.addOutput('out-json', node_io_1.Type.JSON);
        this.settings['time'] = {
            description: 'Time',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: TIME_TYPE.TIME, text: TIME_TYPE.TIME },
                    { value: TIME_TYPE.EPOCH, text: TIME_TYPE.EPOCH },
                    { value: TIME_TYPE.NEW_TS, text: TIME_TYPE.NEW_TS },
                ],
            },
            value: TIME_TYPE.TIME,
        };
    }
    onInputUpdated() {
        const input = this.getInputData(0);
        const result = this.timeSelection(input);
        const out = time_utils_1.default.timeConvertPlus(result);
        this.setOutputData(0, out);
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
    timeSelection(input) {
        const timeType = this.settings['time'].value;
        let timeSelection = null;
        if (timeType === TIME_TYPE.TIME) {
            timeSelection = new Date(input);
        }
        else if (timeType === TIME_TYPE.EPOCH) {
            timeSelection = new Date(parseInt(input));
        }
        else if (timeType === TIME_TYPE.NEW_TS) {
            timeSelection = new Date();
        }
        return timeSelection;
    }
}
exports.TimeConvertPlusNode = TimeConvertPlusNode;
container_1.Container.registerNodeType('time/conversion-plus', TimeConvertPlusNode);
//# sourceMappingURL=time-conversion-plus.js.map