"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enumify_1 = require("enumify");
class InputMethod extends enumify_1.Enumify {
    constructor(label) {
        super();
        this.label = label;
    }
    static items() {
        return InputMethod.enumKeys.map(k => {
            return { value: k, text: InputMethod.enumValueOf(k).label };
        });
    }
}
exports.InputMethod = InputMethod;
InputMethod.VALUE_PRIORITY = new InputMethod('Value and Priority');
InputMethod.PRIORITY_ARRAY_LOT = new InputMethod('Priority Array');
InputMethod.PRIORITY_ARRAY_JSON = new InputMethod('JSON');
InputMethod._ = InputMethod.closeEnum();
//# sourceMappingURL=point-node-utils.js.map