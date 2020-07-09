"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const categories_1 = require("./categories");
const dateTimeFormatters_1 = require("./dateTimeFormatters");
const symbolFormatters_1 = require("./symbolFormatters");
function formattedValueToString(val) {
    var _a, _b;
    return `${_a = val.prefix, (_a !== null && _a !== void 0 ? _a : '')}${val.text}${_b = val.suffix, (_b !== null && _b !== void 0 ? _b : '')}`;
}
exports.formattedValueToString = formattedValueToString;
let categories = [];
const index = {};
let hasBuiltIndex = false;
function toFixed(value, decimals) {
    if (value === null) {
        return '';
    }
    if (value === Number.NEGATIVE_INFINITY || value === Number.POSITIVE_INFINITY) {
        return value.toLocaleString();
    }
    const factor = decimals ? Math.pow(10, Math.max(0, decimals)) : 1;
    const formatted = String(Math.round(value * factor) / factor);
    if (formatted.indexOf('e') !== -1 || value === 0) {
        return formatted;
    }
    if (decimals != null) {
        const decimalPos = formatted.indexOf('.');
        const precision = decimalPos === -1 ? 0 : formatted.length - decimalPos - 1;
        if (precision < decimals) {
            return ((precision ? formatted : formatted + '.') + String(factor).substr(1, decimals - precision));
        }
    }
    return formatted;
}
exports.toFixed = toFixed;
function toFixedScaled(value, decimals, scaledDecimals, additionalDecimals, ext) {
    if (scaledDecimals === null || scaledDecimals === undefined) {
        return { text: toFixed(value, decimals), suffix: ext };
    }
    return {
        text: toFixed(value, scaledDecimals + additionalDecimals),
        suffix: ext,
    };
}
exports.toFixedScaled = toFixedScaled;
function toFixedUnit(unit, asPrefix) {
    return (size, decimals) => {
        if (size === null) {
            return { text: '' };
        }
        const text = toFixed(size, decimals);
        if (unit) {
            if (asPrefix) {
                return { text, prefix: unit };
            }
            return { text, suffix: ' ' + unit };
        }
        return { text };
    };
}
exports.toFixedUnit = toFixedUnit;
function scaledUnits(factor, extArray) {
    return (size, decimals, scaledDecimals) => {
        if (size === null) {
            return { text: '' };
        }
        if (size === Number.NEGATIVE_INFINITY || size === Number.POSITIVE_INFINITY || isNaN(size)) {
            return { text: size.toLocaleString() };
        }
        let steps = 0;
        const limit = extArray.length;
        while (Math.abs(size) >= factor) {
            steps++;
            size /= factor;
            if (steps >= limit) {
                return { text: 'NA' };
            }
        }
        if (steps > 0 && scaledDecimals !== null && scaledDecimals !== undefined) {
            decimals = scaledDecimals + 3 * steps;
        }
        return { text: toFixed(size, decimals), suffix: extArray[steps] };
    };
}
exports.scaledUnits = scaledUnits;
function locale(value, decimals) {
    if (value == null) {
        return { text: '' };
    }
    return {
        text: value.toLocaleString(undefined, { maximumFractionDigits: decimals }),
    };
}
exports.locale = locale;
function simpleCountUnit(symbol) {
    const units = ['', 'K', 'M', 'B', 'T'];
    const scaler = scaledUnits(1000, units);
    return (size, decimals, scaledDecimals) => {
        if (size === null) {
            return { text: '' };
        }
        const v = scaler(size, decimals, scaledDecimals);
        v.suffix += ' ' + symbol;
        return v;
    };
}
exports.simpleCountUnit = simpleCountUnit;
function buildFormats() {
    categories = categories_1.getCategories();
    for (const cat of categories) {
        for (const format of cat.formats) {
            index[format.id] = format.fn;
        }
    }
    [{ from: 'farenheit', to: 'fahrenheit' }].forEach(alias => {
        const f = index[alias.to];
        if (f) {
            index[alias.from] = f;
        }
    });
    hasBuiltIndex = true;
}
function getValueFormat(id) {
    if (!id) {
        return toFixedUnit('');
    }
    if (!hasBuiltIndex) {
        buildFormats();
    }
    const fmt = index[id];
    if (!fmt && id) {
        const idx = id.indexOf(':');
        if (idx > 0) {
            const key = id.substring(0, idx);
            const sub = id.substring(idx + 1);
            if (key === 'prefix') {
                return toFixedUnit(sub, true);
            }
            if (key === 'time') {
                return dateTimeFormatters_1.toDateTimeValueFormatter(sub);
            }
            if (key === 'si') {
                const offset = symbolFormatters_1.getOffsetFromSIPrefix(sub.charAt(0));
                const unit = offset === 0 ? sub : sub.substring(1);
                return symbolFormatters_1.decimalSIPrefix(unit, offset);
            }
            if (key === 'count') {
                return simpleCountUnit(sub);
            }
            if (key === 'currency') {
                return symbolFormatters_1.currency(sub);
            }
        }
        return toFixedUnit(id);
    }
    return fmt;
}
exports.getValueFormat = getValueFormat;
function getValueFormatterIndex() {
    if (!hasBuiltIndex) {
        buildFormats();
    }
    return index;
}
exports.getValueFormatterIndex = getValueFormatterIndex;
function getValueFormats() {
    if (!hasBuiltIndex) {
        buildFormats();
    }
    return categories.map(cat => {
        return {
            text: cat.name,
            submenu: cat.formats.map(format => {
                return {
                    text: format.name,
                    value: format.id,
                };
            }),
        };
    });
}
exports.getValueFormats = getValueFormats;
//# sourceMappingURL=valueFormats.js.map