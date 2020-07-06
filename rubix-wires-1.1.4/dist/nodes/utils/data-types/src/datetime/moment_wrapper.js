"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
exports.ISO_8601 = moment.ISO_8601;
exports.setLocale = (language) => {
    moment.locale(language);
};
exports.getLocaleData = () => {
    return moment.localeData();
};
exports.isDateTime = (value) => {
    return moment.isMoment(value);
};
exports.toUtc = (input, formatInput) => {
    return moment.utc(input, formatInput);
};
exports.toDuration = (input, unit) => {
    return moment.duration(input, unit);
};
exports.dateTime = (input, formatInput) => {
    return moment(input, formatInput);
};
exports.dateTimeAsMoment = (input) => {
    return exports.dateTime(input);
};
exports.dateTimeForTimeZone = (timezone, input, formatInput) => {
    if (timezone === 'utc') {
        return exports.toUtc(input, formatInput);
    }
    return exports.dateTime(input, formatInput);
};
//# sourceMappingURL=moment_wrapper.js.map