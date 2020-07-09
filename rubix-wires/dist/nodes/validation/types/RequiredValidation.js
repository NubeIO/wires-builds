"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationResult_1 = require("../ValidationResult");
class RequiredValidation {
    constructor() {
        this._reason = 'Required field';
    }
    validate(input) {
        if (typeof input === 'string') {
            if (input != '' && input != null) {
                return ValidationResult_1.default.success();
            }
            else {
                return ValidationResult_1.default.failure(this._reason);
            }
        }
        else if (typeof input === 'number') {
            if (input != null) {
                return ValidationResult_1.default.success();
            }
            else {
                return ValidationResult_1.default.failure(this._reason);
            }
        }
        return ValidationResult_1.default.failure('Can only be applied to this type of input');
    }
}
exports.default = RequiredValidation;
//# sourceMappingURL=RequiredValidation.js.map