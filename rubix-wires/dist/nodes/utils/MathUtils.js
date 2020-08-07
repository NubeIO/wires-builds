"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MATH_FUNC_TYPE;
(function (MATH_FUNC_TYPE) {
    MATH_FUNC_TYPE[MATH_FUNC_TYPE["NA"] = 0] = "NA";
    MATH_FUNC_TYPE[MATH_FUNC_TYPE["ADD"] = 1] = "ADD";
    MATH_FUNC_TYPE[MATH_FUNC_TYPE["SUBTRACT"] = 2] = "SUBTRACT";
    MATH_FUNC_TYPE[MATH_FUNC_TYPE["MULTIPLY"] = 3] = "MULTIPLY";
    MATH_FUNC_TYPE[MATH_FUNC_TYPE["DIVIDE"] = 4] = "DIVIDE";
    MATH_FUNC_TYPE[MATH_FUNC_TYPE["REMAINDER"] = 5] = "REMAINDER";
    MATH_FUNC_TYPE[MATH_FUNC_TYPE["EXP"] = 6] = "EXP";
    MATH_FUNC_TYPE[MATH_FUNC_TYPE["BOOL_INVERT"] = 7] = "BOOL_INVERT";
    MATH_FUNC_TYPE[MATH_FUNC_TYPE["ONE_TO_TRUE"] = 8] = "ONE_TO_TRUE";
    MATH_FUNC_TYPE[MATH_FUNC_TYPE["TRUE_TO_ONE"] = 9] = "TRUE_TO_ONE";
    MATH_FUNC_TYPE[MATH_FUNC_TYPE["NUMBER_INVERT"] = 10] = "NUMBER_INVERT";
})(MATH_FUNC_TYPE = exports.MATH_FUNC_TYPE || (exports.MATH_FUNC_TYPE = {}));
class MathUtils {
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    static decimals(value, decimals) {
        if (isNaN(value))
            return undefined;
        const out = value.toFixed(MathUtils.clamp(decimals, 0, 5));
        parseFloat(out);
        return out;
    }
    static numInvert(value) {
        return value ^ 1;
    }
    static trueToOne(value) {
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }
        return undefined;
    }
    static oneToTrue(value) {
        if (typeof value === 'number') {
            return !!value;
        }
        return undefined;
    }
    static invert(value) {
        if (typeof value === 'boolean') {
            return !value;
        }
        return undefined;
    }
    static mathSwitch(mathFuncType, val, mathValue) {
        let out;
        switch (mathFuncType) {
            case MATH_FUNC_TYPE.NA:
                out = 0;
                break;
            case MATH_FUNC_TYPE.ADD:
                out = val + mathValue;
                break;
            case MATH_FUNC_TYPE.SUBTRACT:
                out = val - mathValue;
                break;
            case MATH_FUNC_TYPE.MULTIPLY:
                out = val * mathValue;
                break;
            case MATH_FUNC_TYPE.DIVIDE:
                out = val / mathValue;
                break;
            case MATH_FUNC_TYPE.REMAINDER:
                out = 1;
                break;
            case MATH_FUNC_TYPE.EXP:
                out = 1;
                break;
            case MATH_FUNC_TYPE.BOOL_INVERT:
                out = MathUtils.invert(val);
                break;
            case MATH_FUNC_TYPE.ONE_TO_TRUE:
                out = MathUtils.oneToTrue(val);
                break;
            case MATH_FUNC_TYPE.TRUE_TO_ONE:
                out = MathUtils.trueToOne(val);
                break;
            case MATH_FUNC_TYPE.NUMBER_INVERT:
                out = MathUtils.numInvert(val);
                break;
        }
        return out;
    }
}
exports.default = MathUtils;
MathUtils.validateNumbers = (...values) => {
    return values.every(x => !isNaN(x));
};
//# sourceMappingURL=MathUtils.js.map