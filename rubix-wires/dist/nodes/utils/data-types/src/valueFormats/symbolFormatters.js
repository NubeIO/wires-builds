"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const valueFormats_1 = require("./valueFormats");
function currency(symbol, asSuffix) {
    const units = ['', 'K', 'M', 'B', 'T'];
    const scaler = valueFormats_1.scaledUnits(1000, units);
    return (size, decimals, scaledDecimals) => {
        if (size === null) {
            return { text: '' };
        }
        const scaled = scaler(size, decimals, scaledDecimals);
        if (asSuffix) {
            scaled.suffix = scaled.suffix !== undefined ? `${scaled.suffix}${symbol}` : undefined;
        }
        else {
            scaled.prefix = symbol;
        }
        return scaled;
    };
}
exports.currency = currency;
function getOffsetFromSIPrefix(c) {
    switch (c) {
        case 'f':
            return -5;
        case 'p':
            return -4;
        case 'n':
            return -3;
        case 'μ':
        case 'µ':
            return -2;
        case 'm':
            return -1;
        case '':
            return 0;
        case 'k':
            return 1;
        case 'M':
            return 2;
        case 'G':
            return 3;
        case 'T':
            return 4;
        case 'P':
            return 5;
        case 'E':
            return 6;
        case 'Z':
            return 7;
        case 'Y':
            return 8;
    }
    return 0;
}
exports.getOffsetFromSIPrefix = getOffsetFromSIPrefix;
function binarySIPrefix(unit, offset = 0) {
    const prefixes = ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi'].slice(offset);
    const units = prefixes.map(p => {
        return ' ' + p + unit;
    });
    return valueFormats_1.scaledUnits(1024, units);
}
exports.binarySIPrefix = binarySIPrefix;
function decimalSIPrefix(unit, offset = 0) {
    let prefixes = ['f', 'p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    prefixes = prefixes.slice(5 + (offset || 0));
    const units = prefixes.map(p => {
        return ' ' + p + unit;
    });
    return valueFormats_1.scaledUnits(1000, units);
}
exports.decimalSIPrefix = decimalSIPrefix;
//# sourceMappingURL=symbolFormatters.js.map