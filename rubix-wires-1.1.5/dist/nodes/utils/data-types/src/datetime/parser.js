"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = require("moment-timezone");
const moment_wrapper_1 = require("./moment_wrapper");
const common_1 = require("./common");
const datemath_1 = require("./datemath");
const lodash_1 = require("lodash");
exports.dateTimeParse = (value, options) => {
    if (moment_wrapper_1.isDateTime(value)) {
        return value;
    }
    if (typeof value === 'string') {
        return parseString(value, options);
    }
    return parseOthers(value, options);
};
const parseString = (value, options) => {
    var _a, _b;
    if (value.indexOf('now') !== -1) {
        if (!datemath_1.isValid(value)) {
            return moment_timezone_1.default();
        }
        const parsed = datemath_1.parse(value, (_a = options) === null || _a === void 0 ? void 0 : _a.roundUp, (_b = options) === null || _b === void 0 ? void 0 : _b.timeZone);
        return parsed || moment_timezone_1.default();
    }
    return parseOthers(value, options);
};
const parseOthers = (value, options) => {
    const date = value;
    const timeZone = common_1.getTimeZone(options);
    const zone = moment_timezone_1.default.tz.zone(timeZone);
    if (zone && zone.name) {
        return moment_timezone_1.default.tz(date, zone.name);
    }
    switch (lodash_1.lowerCase(timeZone)) {
        case 'utc':
            return moment_timezone_1.default.utc(date);
        default:
            return moment_timezone_1.default(date);
    }
};
//# sourceMappingURL=parser.js.map