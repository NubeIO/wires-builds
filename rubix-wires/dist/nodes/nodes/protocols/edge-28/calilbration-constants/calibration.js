"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calibration_constants_1 = require("./calibration-constants");
class UiCalibration {
}
exports.default = UiCalibration;
UiCalibration.calUniversalInput = (pinValue) => {
    let polyCoeff = calibration_constants_1.default.coeffUI1Cal;
    let value = 0;
    for (let i = 0; i < 11; i++) {
        const term = polyCoeff[i] * Math.pow(pinValue, i);
        value += term;
    }
    return value;
};
UiCalibration.cal10kThermistor = (pinValue) => {
    let value = 0;
    for (let i = 0; i < 11; i++) {
        const term = calibration_constants_1.default.coeff10kCal[i] * Math.pow(pinValue, i);
        value += term;
    }
    return value;
};
//# sourceMappingURL=calibration.js.map