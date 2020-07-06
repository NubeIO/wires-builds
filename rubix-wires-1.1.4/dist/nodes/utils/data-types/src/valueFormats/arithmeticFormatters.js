"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const valueFormats_1 = require("./valueFormats");
function toPercent(size, decimals) {
    if (size === null) {
        return { text: '' };
    }
    return { text: valueFormats_1.toFixed(size, decimals), suffix: '%' };
}
exports.toPercent = toPercent;
function toPercentUnit(size, decimals) {
    if (size === null) {
        return { text: '' };
    }
    return { text: valueFormats_1.toFixed(100 * size, decimals), suffix: '%' };
}
exports.toPercentUnit = toPercentUnit;
function toHex0x(value, decimals) {
    if (value == null) {
        return { text: '' };
    }
    const asHex = toHex(value, decimals);
    if (asHex.text.substring(0, 1) === '-') {
        asHex.text = '-0x' + asHex.text.substring(1);
    }
    else {
        asHex.text = '0x' + asHex.text;
    }
    return asHex;
}
exports.toHex0x = toHex0x;
function toHex(value, decimals) {
    if (value == null) {
        return { text: '' };
    }
    return {
        text: parseFloat(valueFormats_1.toFixed(value, decimals))
            .toString(16)
            .toUpperCase(),
    };
}
exports.toHex = toHex;
function sci(value, decimals) {
    if (value == null) {
        return { text: '' };
    }
    return { text: value.toExponential(decimals) };
}
exports.sci = sci;
//# sourceMappingURL=arithmeticFormatters.js.map