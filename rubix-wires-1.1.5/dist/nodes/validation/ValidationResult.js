"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationResult {
    constructor(validationState, reason) {
        this._validationState = validationState;
        this._reason = reason;
    }
    get validationState() {
        return this._validationState;
    }
    get reason() {
        return this._reason;
    }
    static success() {
        return new ValidationResult(ValidationState.VALID);
    }
    static failure(reason) {
        return new ValidationResult(ValidationState.INVALID, reason);
    }
}
exports.default = ValidationResult;
var ValidationState;
(function (ValidationState) {
    ValidationState[ValidationState["VALID"] = 0] = "VALID";
    ValidationState[ValidationState["INVALID"] = 1] = "INVALID";
})(ValidationState = exports.ValidationState || (exports.ValidationState = {}));
//# sourceMappingURL=ValidationResult.js.map