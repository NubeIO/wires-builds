"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment-timezone");
const formats_1 = require("./formats");
const common_1 = require("./common");
exports.dateTimeFormat = (dateInUtc, options) => toTz(dateInUtc, common_1.getTimeZone(options)).format(getFormat(options));
exports.dateTimeFormatISO = (dateInUtc, options) => toTz(dateInUtc, common_1.getTimeZone(options)).format();
exports.dateTimeFormatTimeAgo = (dateInUtc, options) => toTz(dateInUtc, common_1.getTimeZone(options)).fromNow();
exports.dateTimeFormatWithAbbrevation = (dateInUtc, options) => toTz(dateInUtc, common_1.getTimeZone(options)).format(`${formats_1.DEFAULT_DATE_TIME_FORMAT} z`);
exports.timeZoneAbbrevation = (dateInUtc, options) => toTz(dateInUtc, common_1.getTimeZone(options)).format('z');
const getFormat = (options) => {
    var _a, _b, _c, _d, _e;
    if ((_a = options) === null || _a === void 0 ? void 0 : _a.defaultWithMS) {
        return _c = (_b = options) === null || _b === void 0 ? void 0 : _b.format, (_c !== null && _c !== void 0 ? _c : formats_1.MS_DATE_TIME_FORMAT);
    }
    return _e = (_d = options) === null || _d === void 0 ? void 0 : _d.format, (_e !== null && _e !== void 0 ? _e : formats_1.DEFAULT_DATE_TIME_FORMAT);
};
const toTz = (dateInUtc, timeZone) => {
    const date = dateInUtc;
    const zone = moment.tz.zone(timeZone);
    if (zone && zone.name) {
        return moment.utc(date).tz(zone.name);
    }
    switch (timeZone) {
        case 'utc':
            return moment.utc(date);
        default:
            return moment.utc(date).local();
    }
};
//# sourceMappingURL=formatter.js.map