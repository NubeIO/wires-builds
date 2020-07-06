"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CheckTypes {
    static formatValueReturnType(val) {
        if (val == null)
            return '';
        return this.formatAsPerValueReturnType(val);
    }
    static formatAsPerValueReturnType(val) {
        if (typeof val === 'boolean') {
            val = val ? true : false;
        }
        else if (typeof val === 'number') {
            val = parseFloat(val.toFixed(3));
        }
        else if (typeof val === 'object') {
            try {
                JSON.parse(JSON.stringify(val));
            }
            catch (e) {
                return '[object]';
            }
            val = val;
        }
        return val;
    }
}
exports.default = CheckTypes;
//# sourceMappingURL=check-types.js.map