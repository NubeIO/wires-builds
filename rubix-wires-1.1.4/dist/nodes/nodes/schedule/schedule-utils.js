"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment-timezone");
const utils_1 = require("../../utils");
class ScheduleUtils {
    static checkEventsSchedule(eventSchedule, dt) {
        if (eventSchedule && Object.prototype.hasOwnProperty.call(eventSchedule, 'dates')) {
            let eventOutput = false;
            let nextOn = null;
            let nextOff = null;
            let scheduleValue = null;
            for (let i = 0; i < eventSchedule.dates.length; i++) {
                const dtUTC = dt.clone().tz('Etc/UTC');
                const startMoment = moment.tz(eventSchedule.dates[i].start, 'Etc/UTC');
                const endMoment = moment.tz(eventSchedule.dates[i].end, 'Etc/UTC');
                if (dtUTC.isAfter(startMoment) && dtUTC.isBefore(endMoment)) {
                    eventOutput = true;
                    if (eventSchedule && Object.prototype.hasOwnProperty.call(eventSchedule, 'value'))
                        scheduleValue = eventSchedule.value;
                    if (nextOff == null || endMoment.isBefore(nextOff)) {
                        nextOff = endMoment;
                    }
                }
                else if (dtUTC.isBefore(startMoment) && dtUTC.isBefore(endMoment)) {
                    if (nextOn == null || startMoment.isBefore(nextOn)) {
                        nextOn = startMoment;
                    }
                    if (nextOff == null || endMoment.isBefore(nextOff)) {
                        nextOff = endMoment;
                    }
                }
            }
            return {
                scheduleStatus: eventOutput,
                nextStart: nextOn,
                nextStop: nextOff,
                value: scheduleValue,
            };
        }
        return { scheduleStatus: false, nextStart: null, nextStop: null, value: null };
    }
    static checkWeeklySchedule(weeklySchedule, dt) {
        let weeklyOutput = false;
        let nextOn = null;
        let nextOff = null;
        let scheduleValue = null;
        if (weeklySchedule) {
            const dtUTC = dt.clone().tz('Etc/UTC');
            let daysArray = weeklySchedule.days.map(day => {
                return utils_1.default.getISOday(day);
            });
            let startArray = weeklySchedule.start.split(':').map(part => {
                return Number(part);
            });
            let endArray = weeklySchedule.end.split(':').map(part => {
                return Number(part);
            });
            let rolloverFlag = 0;
            if (startArray[0] > endArray[0]) {
                rolloverFlag = 1;
            }
            const date = dtUTC.format('YYYY-MM-DD');
            let startMomentArray = daysArray.map(day => {
                return moment.tz(`${date}T${weeklySchedule.start}:00.000Z`, 'Etc/UTC').isoWeekday(day);
            });
            let endMomentArray = daysArray.map(day => {
                return moment
                    .tz(`${date}T${weeklySchedule.end}:00.000Z`, 'Etc/UTC')
                    .isoWeekday(day + rolloverFlag);
            });
            if (rolloverFlag) {
                for (let i = 0; i < endMomentArray.length; i++) {
                    if (dtUTC
                        .clone()
                        .add(1, 'weeks')
                        .isBefore(endMomentArray[i])) {
                        endMomentArray[i].subtract(1, 'weeks');
                        startMomentArray[i].subtract(1, 'weeks');
                        break;
                    }
                }
            }
            if (startMomentArray.every(start => {
                return start.isBefore(dtUTC);
            }) &&
                endMomentArray.every(end => {
                    return end.isBefore(dtUTC);
                })) {
                startMomentArray.map(start => {
                    return start.add(1, 'weeks');
                });
                endMomentArray.map(end => {
                    return end.add(1, 'weeks');
                });
            }
            else if (startMomentArray.every(start => {
                return start.isBefore(dtUTC);
            })) {
                for (let j = 0; j < endMomentArray.length; j++) {
                    if (endMomentArray[j].isBefore(dtUTC)) {
                        endMomentArray[j].add(1, 'weeks');
                        startMomentArray[j].add(1, 'weeks');
                    }
                }
            }
            for (let x = 0; x < startMomentArray.length; x++) {
                if (startMomentArray[x].isBefore(dtUTC) && endMomentArray[x].isAfter(dtUTC)) {
                    weeklyOutput = true;
                    if (weeklySchedule && Object.prototype.hasOwnProperty.call(weeklySchedule, 'value'))
                        scheduleValue = weeklySchedule.value;
                    nextOff = endMomentArray[x];
                }
                else if (startMomentArray[x].isAfter(dtUTC) &&
                    (nextOn == null || startMomentArray[x].isBefore(nextOn))) {
                    nextOn = startMomentArray[x];
                }
                if (endMomentArray[x].isAfter(dtUTC) &&
                    (nextOff == null || endMomentArray[x].isBefore(nextOff))) {
                    nextOff = endMomentArray[x];
                }
            }
        }
        return {
            scheduleStatus: weeklyOutput,
            nextStart: nextOn,
            nextStop: nextOff,
            value: scheduleValue,
        };
    }
}
exports.ScheduleUtils = ScheduleUtils;
//# sourceMappingURL=schedule-utils.js.map