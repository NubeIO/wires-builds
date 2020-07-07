"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const moment_wrapper_1 = require("./moment_wrapper");
const units = ['y', 'M', 'w', 'd', 'h', 'm', 's'];
function isMathString(text) {
    if (!text) {
        return false;
    }
    if (typeof text === 'string' && (text.substring(0, 3) === 'now' || text.indexOf('||'))) {
        return true;
    }
    else {
        return false;
    }
}
exports.isMathString = isMathString;
function parse(text, roundUp, timezone) {
    if (!text) {
        return undefined;
    }
    if (typeof text !== 'string') {
        if (moment_wrapper_1.isDateTime(text)) {
            return text;
        }
        if (lodash_1.isDate(text)) {
            return moment_wrapper_1.dateTime(text);
        }
        return undefined;
    }
    else {
        let time;
        let mathString = '';
        let index;
        let parseString;
        if (text.substring(0, 3) === 'now') {
            time = moment_wrapper_1.dateTimeForTimeZone(timezone);
            mathString = text.substring('now'.length);
        }
        else {
            index = text.indexOf('||');
            if (index === -1) {
                parseString = text;
                mathString = '';
            }
            else {
                parseString = text.substring(0, index);
                mathString = text.substring(index + 2);
            }
            time = moment_wrapper_1.dateTime(parseString, moment_wrapper_1.ISO_8601);
        }
        if (!mathString.length) {
            return time;
        }
        return parseDateMath(mathString, time, roundUp);
    }
}
exports.parse = parse;
function isValid(text) {
    const date = parse(text);
    if (!date) {
        return false;
    }
    if (moment_wrapper_1.isDateTime(date)) {
        return date.isValid();
    }
    return false;
}
exports.isValid = isValid;
function parseDateMath(mathString, time, roundUp) {
    const strippedMathString = mathString.replace(/\s/g, '');
    const dateTime = time;
    let i = 0;
    const len = strippedMathString.length;
    while (i < len) {
        const c = strippedMathString.charAt(i++);
        let type;
        let num;
        let unit;
        if (c === '/') {
            type = 0;
        }
        else if (c === '+') {
            type = 1;
        }
        else if (c === '-') {
            type = 2;
        }
        else {
            return undefined;
        }
        if (isNaN(parseInt(strippedMathString.charAt(i), 10))) {
            num = 1;
        }
        else if (strippedMathString.length === 2) {
            num = strippedMathString.charAt(i);
        }
        else {
            const numFrom = i;
            while (!isNaN(parseInt(strippedMathString.charAt(i), 10))) {
                i++;
                if (i > 10) {
                    return undefined;
                }
            }
            num = parseInt(strippedMathString.substring(numFrom, i), 10);
        }
        if (type === 0) {
            if (num !== 1) {
                return undefined;
            }
        }
        unit = strippedMathString.charAt(i++);
        if (units === undefined || unit === undefined) {
            return undefined;
        }
        else {
            if (type === 0) {
                if (roundUp) {
                    dateTime.endOf(unit);
                }
                else {
                    dateTime.startOf(unit);
                }
            }
            else if (type === 1) {
                dateTime.add(num, unit);
            }
            else if (type === 2) {
                dateTime.subtract(num, unit);
            }
        }
    }
    return dateTime;
}
exports.parseDateMath = parseDateMath;
//# sourceMappingURL=datemath.js.map