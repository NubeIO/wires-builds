"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compareType;
(function (compareType) {
    compareType["Equals"] = "Equals";
    compareType["NotEquals"] = "Not Equal";
    compareType["GreaterThanEqual"] = "Greater Than Equal";
    compareType["GreaterThan"] = "Greater Than";
    compareType["LessThanEqual"] = "Less Than Equal";
    compareType["LessThan"] = "Less Than";
    compareType["Includes"] = "Includes";
    compareType["startsWith"] = "Starts With";
    compareType["endsWith"] = "Ends With";
})(compareType || (compareType = {}));
class jsonStringCompare {
    static compare(self, s1, s2) {
        const inputType = self.settings['function'].value;
        if (self.settings['isNumber'].value) {
            s1 = Number(s1);
            s2 = Number(s2);
        }
        switch (inputType) {
            case compareType.Equals:
                return s1 === s2;
            case compareType.NotEquals:
                return s1 !== s2;
            case compareType.GreaterThanEqual:
                return s1 >= s2;
            case compareType.GreaterThan:
                return s1 > s2;
            case compareType.LessThanEqual:
                return s1 <= s2;
            case compareType.LessThan:
                return s1 < s2;
            case compareType.LessThan:
                return s1 < s2;
            case compareType.Includes:
                return s1.includes(s2);
            case compareType.startsWith:
                return s1.startsWith(s2);
            case compareType.endsWith:
                return s1.endsWith(s2);
            default:
                return s1 === s2;
        }
    }
    static findVal(object, key) {
        let value;
        Object.keys(object).some(function (k) {
            if (k === key) {
                value = {
                    valueWithKey: { [key]: object[k] },
                    value: object[k]
                };
            }
            if (object[k] && typeof object[k] === 'object') {
                value = this.findVal(object[k], key);
                return value !== undefined;
            }
        });
        return value;
    }
}
exports.default = jsonStringCompare;
//# sourceMappingURL=string-json-compare-utils.js.map