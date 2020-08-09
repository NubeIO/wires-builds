"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLowerSnakeCase = (label) => {
    if (label === undefined || label === null) {
        return null;
    }
    return label
        .toString()
        .toLowerCase()
        .replace(/-+\s+/g, '_');
};
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
exports.isFunction = isFunction;
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
exports.isNumeric = isNumeric;
function convertToNumber(value, strict = false) {
    if (value === undefined || value === null) {
        return null;
    }
    let inString = value.toString();
    let n = +inString;
    if (isNumeric(n) && !/^\s*$/.test(inString)) {
        return n;
    }
    if (strict) {
        throw new Error('Invalid number');
    }
    return null;
}
exports.convertToNumber = convertToNumber;
exports.Generator = {
    map: (generator, mapper) => function* (...args) {
        for (const x of generator(...args))
            yield mapper(x);
    },
    filter: (generator, filter) => function* (...args) {
        for (const x of generator(...args))
            if (filter(x))
                yield x;
    },
};
exports.range = function* (from, to, step = 1) {
    let i = 0, length = ~~((to - from) / step) + 1;
    while (i < length)
        yield from + i++ * step;
};
//# sourceMappingURL=helper.js.map