"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const time_1 = require("../types/time");
let defaultTimeZoneResolver = () => time_1.DefaultTimeZone;
exports.setTimeZoneResolver = (resolver) => {
    defaultTimeZoneResolver = (resolver !== null && resolver !== void 0 ? resolver : defaultTimeZoneResolver);
};
exports.getTimeZone = (options) => {
    var _a, _b, _c;
    return _c = (_b = (_a = options) === null || _a === void 0 ? void 0 : _a.timeZone, (_b !== null && _b !== void 0 ? _b : defaultTimeZoneResolver())), (_c !== null && _c !== void 0 ? _c : time_1.DefaultTimeZone);
};
//# sourceMappingURL=common.js.map