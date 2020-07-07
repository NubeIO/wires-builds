"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationResult_1 = require("../ValidationResult");
class RangeValidation {
    constructor(min, max, reason) {
        this._min = min;
        this._max = max;
        this._reason = reason;
    }
    validate(input) {
        if (typeof input === 'number') {
            if (input <= this._max && input >= this._min) {
                return ValidationResult_1.default.success();
            }
            else {
                return ValidationResult_1.default.failure(this._reason);
            }
        }
        return ValidationResult_1.default.failure('Invalid input type to be used with RangeValidation');
    }
}
exports.default = RangeValidation;
//# sourceMappingURL=RangeValidation.js.map