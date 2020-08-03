"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SettingUtils {
    static insertIntoObjectAtPosition(object, insert, after = '', before = '') {
        if (before === '' && after === '') {
            Object.assign(object, insert);
            return object;
        }
        const newObj = {};
        let insertAfter = false;
        const matchBoth = before !== '' && after !== '';
        let foundFlag = false;
        for (let prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (!foundFlag && matchBoth && insertAfter && before === prop) {
                    Object.assign(newObj, insert);
                    foundFlag = true;
                    insertAfter = false;
                }
                else if (!foundFlag && !matchBoth && (insertAfter || before === prop)) {
                    Object.assign(newObj, insert);
                    foundFlag = true;
                    insertAfter = false;
                }
                else if (!foundFlag && prop === after) {
                    insertAfter = true;
                }
                newObj[prop] = object[prop];
            }
        }
        if (!foundFlag)
            Object.assign(newObj, insert);
        return newObj;
    }
}
exports.default = SettingUtils;
//# sourceMappingURL=setting-utils.js.map