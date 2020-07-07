"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static getTimeStamp() {
        const now = new Date();
        return (now.getFullYear() +
            '-' +
            (now.getMonth() + 1) +
            '-' +
            now.getDate() +
            ' ' +
            now.getHours() +
            ':' +
            (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes() + ':' + '00'));
    }
    static onlySerializable(value) {
        return JSON.parse(JSON.stringify(value));
    }
    static cloneObject(obj, target) {
        if (obj == null)
            return null;
        let r = JSON.parse(JSON.stringify(obj));
        if (!target)
            return r;
        for (let i in r)
            target[i] = r[i];
        return target;
    }
    static distance(a, b) {
        return Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
    }
    static isInsideRectangle(x, y, left, top, width, height) {
        return left < x && left + width > x && top < y && top + height > y;
    }
    static overlapBounding([aLeft, aBottom, aRight, aTop], [bLeft, bBottom, bRight, bTop]) {
        return !(aLeft > bRight || aBottom > bTop || aRight < bLeft || aTop < bBottom);
    }
    static parseValue(val, type) {
        const typeofVal = typeof val;
        if (val === null && type === 'string' && typeofVal !== 'string')
            return '';
        if (val == null)
            return val;
        if (type === 'number' && typeofVal !== 'number') {
            if (typeofVal === 'boolean')
                return val ? 1 : 0;
            return isNaN(parseFloat(val)) ? null : parseFloat(val);
        }
        else if (type === 'string' && typeofVal !== 'string') {
            return JSON.stringify(val);
        }
        else if (type === 'boolean' && typeofVal !== 'boolean') {
            if (val === '')
                return null;
            else
                return val === 1 || val === 'true';
        }
        else if (type === 'json') {
            const originalVal = val;
            val = {};
            if (typeofVal === 'string') {
                try {
                    val = JSON.parse(originalVal);
                }
                catch (e) { }
            }
            else if (typeofVal === 'object') {
                try {
                    val = JSON.parse(JSON.stringify(originalVal));
                }
                catch (e) { }
            }
        }
        return val;
    }
    static formatValue(val) {
        if (val == null)
            return '';
        return this.formatAsPerValueType(val);
    }
    static formatNodeInOut(val) {
        if (val === null)
            return 'null';
        if (val === '')
            return 'null';
        if (val === undefined)
            return undefined;
        return this.formatAsPerValueType(val);
    }
    static formatAsPerValueType(val) {
        if (typeof val === 'boolean') {
            val = val ? 'true' : 'false';
        }
        else if (typeof val === 'number') {
            val = parseFloat(val.toFixed(3)).toString();
        }
        else if (typeof val === 'object') {
            try {
                JSON.parse(JSON.stringify(val));
            }
            catch (e) {
                return '[object]';
            }
            val = JSON.stringify(val);
        }
        return val;
    }
    static hasInput(data) {
        return data !== undefined;
    }
    static hasValidInput(data, nullable) {
        if (nullable) {
            return data !== undefined;
        }
        return data != null && data !== '';
    }
    static getTime() {
        return typeof performance != 'undefined' ? performance.now() : Date.now();
    }
    static toFixedNumber(value, digits) {
        let pow = Math.pow(10, digits);
        return +(Math.round(value * pow) / pow);
    }
    static formatAndTrimValue(val) {
        const typeofVal = typeof val;
        if (val != null && (typeofVal === 'string' || typeofVal === 'object')) {
            if (typeofVal === 'object') {
                val = JSON.stringify(val);
            }
            if (val.length > 15)
                val = val.substr(0, 15) + '...';
            return val;
        }
        return val;
    }
    static copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.textContent = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand('copy');
        }
        catch (ex) {
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
    static download(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    static getISOday(day) {
        return Utils.WEEKDAYS.indexOf(day.toLowerCase());
    }
}
exports.default = Utils;
Utils.operatorsBoolName = [
    '==',
    '!=',
    '<',
    '<=',
    '>',
    '>=',
];
Utils.operatorsMathName = ['+', '-', '/', '*', 'min', 'max'];
Utils.operatorsBool = {
    eq: function (a, b) {
        return a == b;
    },
    neq: function (a, b) {
        return a != b;
    },
    lt: function (a, b) {
        return a < b;
    },
    lte: function (a, b) {
        return a <= b;
    },
    gt: function (a, b) {
        return a > b;
    },
    gte: function (a, b) {
        return a >= b;
    },
    btwn: function (a, b, c) {
        return (a >= b && a <= c) || (a <= b && a >= c);
    },
    contains: function (a, b) {
        return (a + '').indexOf(b) != -1;
    },
    regex: function (a, b, c, d) {
        return (a + '').match(new RegExp(b, d ? 'i' : ''));
    },
    true: function (a) {
        return a === true;
    },
    false: function (a) {
        return a === false;
    },
    null: function (a) {
        return typeof a == 'undefined' || a === null;
    },
    notNull: function (a) {
        return typeof a != 'undefined' && a !== null;
    },
    empty: function (a) {
        if (typeof a === 'string' || Array.isArray(a) || Buffer.isBuffer(a)) {
            return a.length === 0;
        }
        else if (typeof a === 'object' && a !== null) {
            return Object.keys(a).length === 0;
        }
        return false;
    },
    notEmpty: function (a) {
        if (typeof a === 'string' || Array.isArray(a) || Buffer.isBuffer(a)) {
            return a.length !== 0;
        }
        else if (typeof a === 'object' && a !== null) {
            return Object.keys(a).length !== 0;
        }
        return false;
    },
};
Utils.operatorsStatName = [
    'max',
    'min',
    'range',
    'midRange',
    'sum',
    'mean',
    'median',
    'variance',
    'standardDeviation',
    'meanAbsoluteDeviation',
];
Utils.stat = {
    max: function (array) {
        return Math.max.apply(null, array);
    },
    min: function (array) {
        return Math.min.apply(null, array);
    },
    range: function (array) {
        return Utils.stat.max(array) - Utils.stat.min(array);
    },
    midRange: function (array) {
        return Utils.stat.range(array) / 2;
    },
    sum: function (array) {
        let num = 0;
        for (let i = 0, l = array.length; i < l; i++)
            num += array[i];
        return num;
    },
    mean: function (array) {
        return Utils.stat.sum(array) / array.length;
    },
    median: function (array) {
        array.sort(function (a, b) {
            return a - b;
        });
        const mid = array.length / 2;
        return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
    },
    modes: function (array) {
        if (!array.length)
            return [];
        let modeMap = {}, maxCount = 0, modes = [];
        array.forEach(function (val) {
            if (!modeMap[val])
                modeMap[val] = 1;
            else
                modeMap[val]++;
            if (modeMap[val] > maxCount) {
                modes = [val];
                maxCount = modeMap[val];
            }
            else if (modeMap[val] === maxCount) {
                modes.push(val);
                maxCount = modeMap[val];
            }
        });
        return modes;
    },
    variance: function (array) {
        const mean = Utils.stat.mean(array);
        return Utils.stat.mean(array.map(function (num) {
            return Math.pow(num - mean, 2);
        }));
    },
    standardDeviation: function (array) {
        return Math.sqrt(Utils.stat.variance(array));
    },
    meanAbsoluteDeviation: function (array) {
        const mean = Utils.stat.mean(array);
        return Utils.stat.mean(array.map(function (num) {
            return Math.abs(num - mean);
        }));
    },
    zScores: function (array) {
        const mean = Utils.stat.mean(array);
        const standardDeviation = Utils.stat.standardDeviation(array);
        return array.map(function (num) {
            return (num - mean) / standardDeviation;
        });
    },
};
Utils.buildUrl = (host, port, schema = 'http') => {
    return `${schema}://${host}${port ? `:${port}` : ''}`;
};
Utils.sum = array => array.reduce((cv, pv) => cv + pv, 0);
Utils.clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};
Utils.remap = function (value, inMin, inMax, outMin, outMax) {
    value = Number(value);
    inMin = Number(inMin);
    inMax = Number(inMax);
    outMin = Number(outMin);
    outMax = Number(outMax);
    if (value > inMax)
        value = inMax;
    else if (value < inMin)
        value = inMin;
    return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
};
Utils.renameKey = (old_key, new_key) => (instance) => {
    if (old_key === new_key)
        return instance;
    const cloned = Object.assign(Object.assign({}, instance), { [new_key]: instance[old_key] });
    delete cloned[old_key];
    return cloned;
};
Utils.pSBC = (percentageChange, fromColor, toColor = undefined, useLinear = false) => {
    let r, g, b, a, P, f, t, h, i = parseInt, m = Math.round, isToColorString = typeof toColor == 'string';
    if (typeof percentageChange != 'number' ||
        percentageChange < -1 ||
        percentageChange > 1 ||
        typeof fromColor != 'string' ||
        (fromColor[0] != 'r' && fromColor[0] != '#') ||
        (toColor && !isToColorString))
        return null;
    const pSBCr = d => {
        let n = d.length, x = { r: 0, g: 0, b: 0, a: 0 };
        if (n > 9) {
            ([r, g, b, a] = d = d.split(',')), (n = d.length);
            if (n < 3 || n > 4)
                return null;
            (x.r = i(r[3] == 'a' ? r.slice(5) : r.slice(4))),
                (x.g = i(g)),
                (x.b = i(b)),
                (x.a = a ? parseFloat(a) : -1);
        }
        else {
            if (n == 8 || n == 6 || n < 4)
                return null;
            if (n < 6)
                d = '#' + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : '');
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5)
                (x.r = (d >> 24) & 255),
                    (x.g = (d >> 16) & 255),
                    (x.b = (d >> 8) & 255),
                    (x.a = m((d & 255) / 0.255) / 1000);
            else
                (x.r = d >> 16), (x.g = (d >> 8) & 255), (x.b = d & 255), (x.a = -1);
        }
        return x;
    };
    (h = fromColor.length > 9),
        (h = isToColorString ? (toColor.length > 9 ? true : toColor == 'c' ? !h : false) : h),
        (f = pSBCr(fromColor)),
        (P = percentageChange < 0),
        (t =
            toColor && toColor != 'c'
                ? pSBCr(toColor)
                : P
                    ? { r: 0, g: 0, b: 0, a: -1 }
                    : { r: 255, g: 255, b: 255, a: -1 }),
        (percentageChange = P ? percentageChange * -1 : percentageChange),
        (P = 1 - percentageChange);
    if (!f || !t)
        return null;
    if (useLinear)
        (r = m(P * f.r + percentageChange * t.r)),
            (g = m(P * f.g + percentageChange * t.g)),
            (b = m(P * f.b + percentageChange * t.b));
    else
        (r = m(Math.pow((P * Math.pow(f.r, 2) + percentageChange * Math.pow(t.r, 2)), 0.5))),
            (g = m(Math.pow((P * Math.pow(f.g, 2) + percentageChange * Math.pow(t.g, 2)), 0.5))),
            (b = m(Math.pow((P * Math.pow(f.b, 2) + percentageChange * Math.pow(t.b, 2)), 0.5)));
    (a = f.a),
        (t = t.a),
        (f = a >= 0 || t >= 0),
        (a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * percentageChange) : 0);
    if (h)
        return ('rgb' + (f ? 'a(' : '(') + r + ',' + g + ',' + b + (f ? ',' + m(a * 1000) / 1000 : '') + ')');
    else
        return ('#' +
            (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0))
                .toString(16)
                .slice(1, f ? undefined : -2));
};
Utils.WEEKDAYS = [
    null,
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
];
Utils.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//# sourceMappingURL=utils.js.map