"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PointFunc {
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    static decimals(value, decimals) {
        if (value === undefined)
            return;
        if (typeof value === 'string')
            return;
        if (decimals > 5)
            decimals = 5;
        if (decimals < 0)
            decimals = 0;
        const out = value.toFixed(decimals);
        parseFloat(out);
        return out;
    }
    static trueToOne(value) {
        try {
            if (value === undefined)
                return;
            if (typeof value === 'boolean') {
                return value ? 1 : 0;
            }
        }
        catch (err) { }
    }
    static oneToTrue(value) {
        try {
            if (value === undefined)
                return;
            if (typeof value === 'number') {
                return value ? true : false;
            }
        }
        catch (err) { }
    }
    static invert(value) {
        try {
            if (value === undefined)
                return;
            if (typeof value === 'boolean') {
                return !value;
            }
        }
        catch (err) { }
    }
    static mathSwitch(caseIn, val, mathValue) {
        let out;
        switch (caseIn) {
            case 0:
                out = 0;
                break;
            case 1:
                out = val + mathValue;
                break;
            case 2:
                out = val - mathValue;
                break;
            case 3:
                out = val * mathValue;
                break;
            case 4:
                out = val / mathValue;
                break;
            case 5:
                out = 1;
                break;
            case 6:
                out = 1;
                break;
            case 7:
                out = PointFunc.invert(val);
                break;
            case 8:
                out = PointFunc.oneToTrue(val);
                break;
            case 9:
                out = PointFunc.trueToOne(val);
                break;
            case 10:
                out = PointFunc.numInvert(val);
                break;
        }
        return out;
    }
    static alarmSwitch(caseIn, val, alarmValSP) {
        let out;
        switch (caseIn) {
            case 0:
                out = false;
                break;
            case 1:
                out = false;
                break;
            case 2:
                if (val >= alarmValSP) {
                    out = true;
                }
                else
                    out = false;
                break;
            case 3:
                out = false;
                break;
        }
        return out;
    }
}
exports.default = PointFunc;
PointFunc.numInvert = (val) => {
    return (val ^= 1);
};
PointFunc.validateNumbers = (a, b) => {
    if (isNaN(a) || isNaN(b)) {
        return false;
    }
    return true;
};
//# sourceMappingURL=pointFunc.js.map