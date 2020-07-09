"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EdgeGPIOUtils {
    static scale420maToRange(value_420, min_target, max_target) {
        const limit = true, min_range = 4, max_range = 20;
        const slope = (max_target - min_target) / (max_range - min_range);
        if (limit)
            if (value_420 <= min_range)
                return min_target;
            else if (value_420 >= max_range)
                return max_target;
        return (value_420 - min_range) * slope + min_target;
    }
    static scaleUI420ma(ui_value, min_range, max_range) {
        const min_target = 4, max_target = 20, limit = true;
        const slope = max_target / (max_range - min_range);
        const value_420 = (ui_value - min_range) * slope;
        if (limit)
            if (value_420 <= min_target)
                return min_target;
            else if (value_420 >= max_target)
                return max_target;
        return value_420;
    }
}
exports.default = EdgeGPIOUtils;
EdgeGPIOUtils.scaleToGPIOValue = (val, minOutput, maxOutput, minInput = 120, maxInput = 0) => {
    let value = val;
    let pinValue = ((maxOutput - minOutput) * (value - minInput)) / (maxInput - minInput) + minOutput;
    if (pinValue > maxOutput) {
        pinValue = maxOutput;
        value = maxInput;
    }
    else if (pinValue < minOutput) {
        pinValue = minOutput;
        value = minInput;
    }
    return pinValue;
};
EdgeGPIOUtils.scaleFromGPIOValue = (pinValue, minOutput, maxOutput, minInput = 0, maxInput = 1) => {
    return ((maxOutput - minOutput) * (pinValue - minInput)) / (maxInput - minInput) + minOutput;
};
EdgeGPIOUtils.uiAsDI = (val) => {
    if (val > 0.6) {
        return 0;
    }
    if (val < 0.2) {
        return 1;
    }
};
EdgeGPIOUtils.diInvert = (val) => {
    return (val ^= 1);
};
//# sourceMappingURL=edge-gpio-utils.js.map