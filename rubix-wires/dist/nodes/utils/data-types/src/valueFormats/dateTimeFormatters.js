"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment_wrapper_1 = require("../datetime/moment_wrapper");
const valueFormats_1 = require("./valueFormats");
const datetime_1 = require("../datetime");
var Interval;
(function (Interval) {
    Interval["Year"] = "year";
    Interval["Month"] = "month";
    Interval["Week"] = "week";
    Interval["Day"] = "day";
    Interval["Hour"] = "hour";
    Interval["Minute"] = "minute";
    Interval["Second"] = "second";
    Interval["Millisecond"] = "millisecond";
})(Interval = exports.Interval || (exports.Interval = {}));
const INTERVALS_IN_SECONDS = {
    [Interval.Year]: 31536000,
    [Interval.Month]: 2592000,
    [Interval.Week]: 604800,
    [Interval.Day]: 86400,
    [Interval.Hour]: 3600,
    [Interval.Minute]: 60,
    [Interval.Second]: 1,
    [Interval.Millisecond]: 0.001,
};
function toNanoSeconds(size, decimals, scaledDecimals) {
    if (size === null) {
        return { text: '' };
    }
    if (Math.abs(size) < 1000) {
        return { text: valueFormats_1.toFixed(size, decimals), suffix: ' ns' };
    }
    else if (Math.abs(size) < 1000000) {
        return valueFormats_1.toFixedScaled(size / 1000, decimals, scaledDecimals, 3, ' µs');
    }
    else if (Math.abs(size) < 1000000000) {
        return valueFormats_1.toFixedScaled(size / 1000000, decimals, scaledDecimals, 6, ' ms');
    }
    else if (Math.abs(size) < 60000000000) {
        return valueFormats_1.toFixedScaled(size / 1000000000, decimals, scaledDecimals, 9, ' s');
    }
    else {
        return valueFormats_1.toFixedScaled(size / 60000000000, decimals, scaledDecimals, 12, ' min');
    }
}
exports.toNanoSeconds = toNanoSeconds;
function toMicroSeconds(size, decimals, scaledDecimals) {
    if (size === null) {
        return { text: '' };
    }
    if (Math.abs(size) < 1000) {
        return { text: valueFormats_1.toFixed(size, decimals), suffix: ' µs' };
    }
    else if (Math.abs(size) < 1000000) {
        return valueFormats_1.toFixedScaled(size / 1000, decimals, scaledDecimals, 3, ' ms');
    }
    else {
        return valueFormats_1.toFixedScaled(size / 1000000, decimals, scaledDecimals, 6, ' s');
    }
}
exports.toMicroSeconds = toMicroSeconds;
function toMilliSeconds(size, decimals, scaledDecimals) {
    if (size === null) {
        return { text: '' };
    }
    if (Math.abs(size) < 1000) {
        return { text: valueFormats_1.toFixed(size, decimals), suffix: ' ms' };
    }
    else if (Math.abs(size) < 60000) {
        return valueFormats_1.toFixedScaled(size / 1000, decimals, scaledDecimals, 3, ' s');
    }
    else if (Math.abs(size) < 3600000) {
        return valueFormats_1.toFixedScaled(size / 60000, decimals, scaledDecimals, 5, ' min');
    }
    else if (Math.abs(size) < 86400000) {
        return valueFormats_1.toFixedScaled(size / 3600000, decimals, scaledDecimals, 7, ' hour');
    }
    else if (Math.abs(size) < 31536000000) {
        return valueFormats_1.toFixedScaled(size / 86400000, decimals, scaledDecimals, 8, ' day');
    }
    return valueFormats_1.toFixedScaled(size / 31536000000, decimals, scaledDecimals, 10, ' year');
}
exports.toMilliSeconds = toMilliSeconds;
function trySubstract(value1, value2) {
    if (value1 !== null && value1 !== undefined && value2 !== null && value2 !== undefined) {
        return value1 - value2;
    }
    return undefined;
}
exports.trySubstract = trySubstract;
function toSeconds(size, decimals, scaledDecimals) {
    if (size === null) {
        return { text: '' };
    }
    if (Math.abs(size) < 0.000001) {
        return valueFormats_1.toFixedScaled(size * 1e9, decimals, trySubstract(scaledDecimals, decimals), -9, ' ns');
    }
    if (Math.abs(size) < 0.001) {
        return valueFormats_1.toFixedScaled(size * 1e6, decimals, trySubstract(scaledDecimals, decimals), -6, ' µs');
    }
    if (Math.abs(size) < 1) {
        return valueFormats_1.toFixedScaled(size * 1e3, decimals, trySubstract(scaledDecimals, decimals), -3, ' ms');
    }
    if (Math.abs(size) < 60) {
        return { text: valueFormats_1.toFixed(size, decimals), suffix: ' s' };
    }
    else if (Math.abs(size) < 3600) {
        return valueFormats_1.toFixedScaled(size / 60, decimals, scaledDecimals, 1, ' min');
    }
    else if (Math.abs(size) < 86400) {
        return valueFormats_1.toFixedScaled(size / 3600, decimals, scaledDecimals, 4, ' hour');
    }
    else if (Math.abs(size) < 604800) {
        return valueFormats_1.toFixedScaled(size / 86400, decimals, scaledDecimals, 5, ' day');
    }
    else if (Math.abs(size) < 31536000) {
        return valueFormats_1.toFixedScaled(size / 604800, decimals, scaledDecimals, 6, ' week');
    }
    return valueFormats_1.toFixedScaled(size / 3.15569e7, decimals, scaledDecimals, 7, ' year');
}
exports.toSeconds = toSeconds;
function toMinutes(size, decimals, scaledDecimals) {
    if (size === null) {
        return { text: '' };
    }
    if (Math.abs(size) < 60) {
        return { text: valueFormats_1.toFixed(size, decimals), suffix: ' min' };
    }
    else if (Math.abs(size) < 1440) {
        return valueFormats_1.toFixedScaled(size / 60, decimals, scaledDecimals, 2, ' hour');
    }
    else if (Math.abs(size) < 10080) {
        return valueFormats_1.toFixedScaled(size / 1440, decimals, scaledDecimals, 3, ' day');
    }
    else if (Math.abs(size) < 604800) {
        return valueFormats_1.toFixedScaled(size / 10080, decimals, scaledDecimals, 4, ' week');
    }
    else {
        return valueFormats_1.toFixedScaled(size / 5.25948e5, decimals, scaledDecimals, 5, ' year');
    }
}
exports.toMinutes = toMinutes;
function toHours(size, decimals, scaledDecimals) {
    if (size === null) {
        return { text: '' };
    }
    if (Math.abs(size) < 24) {
        return { text: valueFormats_1.toFixed(size, decimals), suffix: ' hour' };
    }
    else if (Math.abs(size) < 168) {
        return valueFormats_1.toFixedScaled(size / 24, decimals, scaledDecimals, 2, ' day');
    }
    else if (Math.abs(size) < 8760) {
        return valueFormats_1.toFixedScaled(size / 168, decimals, scaledDecimals, 3, ' week');
    }
    else {
        return valueFormats_1.toFixedScaled(size / 8760, decimals, scaledDecimals, 4, ' year');
    }
}
exports.toHours = toHours;
function toDays(size, decimals, scaledDecimals) {
    if (size === null) {
        return { text: '' };
    }
    if (Math.abs(size) < 7) {
        return { text: valueFormats_1.toFixed(size, decimals), suffix: ' day' };
    }
    else if (Math.abs(size) < 365) {
        return valueFormats_1.toFixedScaled(size / 7, decimals, scaledDecimals, 2, ' week');
    }
    else {
        return valueFormats_1.toFixedScaled(size / 365, decimals, scaledDecimals, 3, ' year');
    }
}
exports.toDays = toDays;
function toDuration(size, decimals, timeScale) {
    if (size === null) {
        return { text: '' };
    }
    if (size === 0) {
        return { text: '0', suffix: ' ' + timeScale + 's' };
    }
    if (size < 0) {
        const v = toDuration(-size, decimals, timeScale);
        if (!v.suffix) {
            v.suffix = '';
        }
        v.suffix += ' ago';
        return v;
    }
    const units = [
        { long: Interval.Year },
        { long: Interval.Month },
        { long: Interval.Week },
        { long: Interval.Day },
        { long: Interval.Hour },
        { long: Interval.Minute },
        { long: Interval.Second },
        { long: Interval.Millisecond },
    ];
    size *= INTERVALS_IN_SECONDS[timeScale] * 1000;
    const strings = [];
    let decrementDecimals = false;
    let decimalsCount = 0;
    if (decimals !== null || decimals !== undefined) {
        decimalsCount = decimals;
    }
    for (let i = 0; i < units.length && decimalsCount >= 0; i++) {
        const interval = INTERVALS_IN_SECONDS[units[i].long] * 1000;
        const value = size / interval;
        if (value >= 1 || decrementDecimals) {
            decrementDecimals = true;
            const floor = Math.floor(value);
            const unit = units[i].long + (floor !== 1 ? 's' : '');
            strings.push(floor + ' ' + unit);
            size = size % interval;
            decimalsCount--;
        }
    }
    return { text: strings.join(', ') };
}
exports.toDuration = toDuration;
function toClock(size, decimals) {
    if (size === null) {
        return { text: '' };
    }
    if (size < 1000) {
        return {
            text: moment_wrapper_1.toUtc(size).format('SSS\\m\\s'),
        };
    }
    if (size < 60000) {
        let format = 'ss\\s:SSS\\m\\s';
        if (decimals === 0) {
            format = 'ss\\s';
        }
        return { text: moment_wrapper_1.toUtc(size).format(format) };
    }
    if (size < 3600000) {
        let format = 'mm\\m:ss\\s:SSS\\m\\s';
        if (decimals === 0) {
            format = 'mm\\m';
        }
        else if (decimals === 1) {
            format = 'mm\\m:ss\\s';
        }
        return { text: moment_wrapper_1.toUtc(size).format(format) };
    }
    let format = 'mm\\m:ss\\s:SSS\\m\\s';
    const hours = `${('0' + Math.floor(moment_wrapper_1.toDuration(size, 'milliseconds').asHours())).slice(-2)}h`;
    if (decimals === 0) {
        format = '';
    }
    else if (decimals === 1) {
        format = 'mm\\m';
    }
    else if (decimals === 2) {
        format = 'mm\\m:ss\\s';
    }
    const text = format ? `${hours}:${moment_wrapper_1.toUtc(size).format(format)}` : hours;
    return { text };
}
exports.toClock = toClock;
function toDurationInMilliseconds(size, decimals) {
    return toDuration(size, decimals, Interval.Millisecond);
}
exports.toDurationInMilliseconds = toDurationInMilliseconds;
function toDurationInSeconds(size, decimals) {
    return toDuration(size, decimals, Interval.Second);
}
exports.toDurationInSeconds = toDurationInSeconds;
function toDurationInHoursMinutesSeconds(size) {
    if (size < 0) {
        const v = toDurationInHoursMinutesSeconds(-size);
        if (!v.suffix) {
            v.suffix = '';
        }
        v.suffix += ' ago';
        return v;
    }
    const strings = [];
    const numHours = Math.floor(size / 3600);
    const numMinutes = Math.floor((size % 3600) / 60);
    const numSeconds = Math.floor((size % 3600) % 60);
    numHours > 9 ? strings.push('' + numHours) : strings.push('0' + numHours);
    numMinutes > 9 ? strings.push('' + numMinutes) : strings.push('0' + numMinutes);
    numSeconds > 9 ? strings.push('' + numSeconds) : strings.push('0' + numSeconds);
    return { text: strings.join(':') };
}
exports.toDurationInHoursMinutesSeconds = toDurationInHoursMinutesSeconds;
function toTimeTicks(size, decimals, scaledDecimals) {
    return toSeconds(size / 100, decimals, scaledDecimals);
}
exports.toTimeTicks = toTimeTicks;
function toClockMilliseconds(size, decimals) {
    return toClock(size, decimals);
}
exports.toClockMilliseconds = toClockMilliseconds;
function toClockSeconds(size, decimals) {
    return toClock(size * 1000, decimals);
}
exports.toClockSeconds = toClockSeconds;
function toDateTimeValueFormatter(pattern, todayPattern) {
    return (value, decimals, scaledDecimals, timeZone) => {
        if (todayPattern) {
            if (moment_wrapper_1.dateTime().isSame(value, 'day')) {
                return {
                    text: datetime_1.dateTimeFormat(value, { format: todayPattern, timeZone }),
                };
            }
        }
        return { text: datetime_1.dateTimeFormat(value, { format: pattern, timeZone }) };
    };
}
exports.toDateTimeValueFormatter = toDateTimeValueFormatter;
exports.dateTimeAsIso = toDateTimeValueFormatter('YYYY-MM-DD HH:mm:ss', 'HH:mm:ss');
exports.dateTimeAsUS = toDateTimeValueFormatter('MM/DD/YYYY h:mm:ss a', 'h:mm:ss a');
function dateTimeFromNow(value, decimals, scaledDecimals, timeZone) {
    return { text: datetime_1.dateTimeFormatTimeAgo(value, { timeZone }) };
}
exports.dateTimeFromNow = dateTimeFromNow;
//# sourceMappingURL=dateTimeFormatters.js.map