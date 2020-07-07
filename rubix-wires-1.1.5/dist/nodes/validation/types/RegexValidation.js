"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationResult_1 = require("../ValidationResult");
class RegexValidation {
    constructor(regex, reason) {
        this._regex = regex;
        this._reason = reason;
    }
    validate(input) {
        if (typeof input === 'string') {
            if (this._regex.test(input)) {
                return ValidationResult_1.default.success();
            }
            else {
                return ValidationResult_1.default.failure(this._reason);
            }
        }
        return ValidationResult_1.default.failure('Can only be applied to string type of inputs');
    }
}
exports.default = RegexValidation;
//# sourceMappingURL=RegexValidation.js.map