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
            .second(0)
            .millisecond(0);
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
    static timeConvertPlus(d) {
        try {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            let dts = d.toDateString();
            let e = d.getTime();
            let mnu = this.pad(d.getMonth() + 1, 2);
            let mnt = d.getMonth();
            let mn = monthNames[mnt];
            let dy = dayNames[d.getDay()];
            let dt = this.pad(d.getDate(), 2);
            let yr = d.getFullYear();
            let hr = d.getHours();
            let mi = d.getMinutes();
            let ny = Math.ceil((d - new Date(d.getFullYear(), 0, 1)) / 86400000);
            let h = this.pad(hr, 2);
            let m = this.pad(mi, 2);
            let s = this.pad(d.getSeconds(), 2);
            let mil = this.pad(d.getMilliseconds(), 3);
            let thr = null;
            if (hr === 0) {
                thr = 12;
            }
            else if (hr > 12) {
                thr = hr - 12;
            }
            else {
                thr = hr;
            }
            thr = '' + thr;
            let amp = hr * 60 + mi;
            if (amp < 720) {
                amp = 'AM';
            }
            else {
                amp = 'PM';
            }
            let hm = h + ':' + m;
            let hms = h + ':' + m + ':' + s;
            let ms = m + ':' + s;
            let date = dts;
            let yearMonthDay = '' + yr + '-' + mnu + '-' + dt;
            let year = '' + yr;
            let month = mn;
            let monthAsNumber = mnu;
            let dayAsNumber = dt;
            let dayOfYearNumber = '' + ny;
            let day = dy;
            let hourAsAmPm = thr;
            let hour = h;
            let timeHourMin = hm;
            let time = hms;
            let minute = m;
            let minutesSeconds = ms;
            let seconds = s;
            let milliseconds = mil;
            let epoch = '' + e;
            let rawDate = d;
            let pmOrAm = amp;
            return {
                date: date,
                yearMonthDay: yearMonthDay,
                year: year,
                month: month,
                monthAsNumber: monthAsNumber,
                dayAsNumber: dayAsNumber,
                dayOfYearNumber: dayOfYearNumber,
                day: day,
                pmOrAm: pmOrAm,
                hourAsAmPm: hourAsAmPm,
                hour: hour,
                timeHourMin: timeHourMin,
                time: time,
                minute: minute,
                minutesSeconds: minutesSeconds,
                seconds: seconds,
                milliseconds: milliseconds,
                epoch: epoch,
                rawDate: rawDate,
            };
        }
        catch (error) {
            console.log(error);
        }
    }
    static pad(num, size) {
        let s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    }
}
exports.default = TimeUtils;
//# sourceMappingURL=time-utils.js.map