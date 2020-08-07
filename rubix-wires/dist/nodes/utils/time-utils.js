"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment-timezone");
var TIME_TYPE;
(function (TIME_TYPE) {
    TIME_TYPE["DAYS"] = "days";
    TIME_TYPE["HOURS"] = "hours";
    TIME_TYPE["MINUTES"] = "minutes";
    TIME_TYPE["SECONDS"] = "seconds";
    TIME_TYPE["MILLISECONDS"] = "milliseconds";
})(TIME_TYPE = exports.TIME_TYPE || (exports.TIME_TYPE = {}));
class TimeUtils {
    static timeConvert(timeOut, timeType) {
        switch (timeType) {
            case TIME_TYPE.DAYS:
                return timeOut * 24 * 60 * 60 * 1000;
            case TIME_TYPE.HOURS:
                return timeOut * 60 * 60 * 1000;
            case TIME_TYPE.MINUTES:
                return timeOut * 60 * 1000;
            case TIME_TYPE.SECONDS:
                return timeOut * 1000;
            case TIME_TYPE.MILLISECONDS:
                return timeOut;
            default:
                return -1;
        }
    }
    static nearestFutureMinutes(interval, momentValue) {
        const roundedMinutes = Math.ceil(momentValue.minute() / interval) * interval;
        return momentValue
            .clone()
            .minute(roundedMinutes)
            .second(0);
    }
    static timeDisplay(timeInMs, format = 5, timeType) {
        let duration = timeInMs;
        if (timeType && timeType != 'milliseconds')
            duration = TimeUtils.timeConvert(duration, timeType);
        const mm = moment.duration(duration);
        switch (format) {
            case 0:
                return (mm.days().toString() + ':' + mm.hours() + ':' + mm.minutes() + ':' + mm.seconds() + ':' + mm.milliseconds());
            case 1:
                return ('DD:HH:MM:SS:MS ' +
                    mm.days() +
                    ':' +
                    mm.hours() +
                    ':' +
                    mm.minutes() +
                    ':' +
                    mm.seconds() +
                    ':' +
                    mm.milliseconds());
            case 2:
                return ('DD' +
                    mm.days() +
                    ':' +
                    'HH' +
                    mm.hours() +
                    ':' +
                    'MM' +
                    mm.minutes() +
                    ':' +
                    'SS' +
                    mm.seconds() +
                    ':' +
                    'MS' +
                    mm.milliseconds());
            case 3:
                return ('DD' +
                    mm
                        .days()
                        .toString()
                        .padStart(2, '0') +
                    ':' +
                    'HH' +
                    mm
                        .hours()
                        .toString()
                        .padStart(2, '0') +
                    ':' +
                    'MM' +
                    mm
                        .minutes()
                        .toString()
                        .padStart(2, '0') +
                    ':' +
                    'SS' +
                    mm
                        .seconds()
                        .toString()
                        .padStart(2, '0') +
                    ':' +
                    'MS' +
                    mm
                        .milliseconds()
                        .toString()
                        .padStart(3, '0'));
            case 4:
                return ('D' +
                    mm.days() +
                    ':' +
                    'H' +
                    mm.hours() +
                    ':' +
                    'M' +
                    mm.minutes() +
                    ':' +
                    'S' +
                    mm.seconds() +
                    ':' +
                    'MS' +
                    mm.milliseconds());
            case 5:
                return ('D' +
                    mm
                        .days()
                        .toString()
                        .padStart(2, '0') +
                    ':' +
                    'H' +
                    mm
                        .hours()
                        .toString()
                        .padStart(2, '0') +
                    ':' +
                    'M' +
                    mm
                        .minutes()
                        .toString()
                        .padStart(2, '0') +
                    ':' +
                    'S' +
                    mm
                        .seconds()
                        .toString()
                        .padStart(2, '0') +
                    ':' +
                    'MS' +
                    mm
                        .milliseconds()
                        .toString()
                        .padStart(3, '0'));
            default:
                return (mm.days().toString() + ':' + mm.hours() + ':' + mm.minutes() + ':' + mm.seconds() + ':' + mm.milliseconds());
        }
    }
}
exports.default = TimeUtils;
//# sourceMappingURL=time-utils.js.map