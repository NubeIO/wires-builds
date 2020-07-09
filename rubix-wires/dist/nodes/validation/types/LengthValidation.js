"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationResult_1 = require("../ValidationResult");
class LengthValidation {
    constructor(length, reason) {
        this._length = length;
        this._reason = reason;
    }
    validate(input) {
        if (typeof input === 'string') {
            if (input.length === this._length) {
                return ValidationResult_1.default.success();
            }
            else {
                return ValidationResult_1.default.failure(this._reason);
            }
        }
        return ValidationResult_1.default.failure('Invalid input type to be used with LengthValidation');
    }
}
exports.default = LengthValidation;
//# sourceMappingURL=LengthValidation.js.map