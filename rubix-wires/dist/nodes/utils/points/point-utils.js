"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MathUtils_1 = require("../../utils/MathUtils");
class PointUtils {
    static sendPointValue(self, pointDebugSet, outNum, outPayload, JSONNum, JSONPayload) {
        const debug = pointDebugSet;
        if (debug) {
            self.setOutputData(outNum, outPayload);
            self.setOutputData(JSONNum, JSONPayload);
        }
        else {
            self.setOutputData(outNum, outPayload, true);
            self.setOutputData(JSONNum, JSONPayload, true);
        }
    }
    static pointOffset(val, offsetSet) {
        if (!this.validateNumbers(val, offsetSet))
            return;
        let offset = offsetSet;
        if (offset === null) {
            offset = 0;
        }
        return parseFloat(val) + parseFloat(offset);
    }
    static pointLimit(val, min, max) {
        if (!this.validateNumbers(val, min, max))
            return;
        let out;
        if (val >= max) {
            out = max;
        }
        else if (val <= min) {
            out = min;
        }
        else {
            out = val;
        }
        ;
        return out;
    }
    ;
    static validateNumbers(...values) {
        return MathUtils_1.default.validateNumbers(values);
    }
    static decimals(val, decimals) {
        if (!this.validateNumbers(val, decimals))
            return;
        return MathUtils_1.default.decimals(val, decimals);
    }
    ;
}
exports.default = PointUtils;
PointUtils.pointScale = (pinValue, minOutput, maxOutput, minInput = 0, maxInput = 1) => {
    return ((maxOutput - minOutput) * (pinValue - minInput)) / (maxInput - minInput) + minOutput;
};
//# sourceMappingURL=point-utils.js.map