"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment-timezone");
class TimeUtils {
    static timeConvert(timeOut, timeType) {
        switch (timeType) {
            case 'days':
                return timeOut * 24 * 60 * 60 * 1000;
            case 'hours':
                return timeOut * 60 * 60 * 1000;
            case 'minutes':
                return timeOut * 60 * 1000;
            case 'seconds':
                return timeOut * 1000;
            case 'milliseconds':
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
    static getTimezone() {
        let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return timezone;
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