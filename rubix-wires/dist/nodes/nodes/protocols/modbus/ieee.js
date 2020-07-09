var LN2 = Math.LN2, abs = Math.abs, floor = Math.floor, log = Math.log, max = Math.max, min = Math.min, pow = Math.pow, round = Math.round;
function unpackF64(b) {
    return unpackIEEE754(b, 11, 52);
}
function packF64(v) {
    return packIEEE754(v, 11, 52);
}
function unpackF32(b) {
    return unpackIEEE754(b, 8, 23);
}
function packF32(v) {
    return packIEEE754(v, 8, 23);
}
function packIEEE754(v, ebits, fbits) {
    var bias = (1 << (ebits - 1)) - 1;
    function roundToEven(n) {
        var w = floor(n), f = n - w;
        if (f < 0.5)
            return w;
        if (f > 0.5)
            return w + 1;
        return w % 2 ? w + 1 : w;
    }
    var s, e, f;
    if (v !== v) {
        e = (1 << ebits) - 1;
        f = pow(2, fbits - 1);
        s = 0;
    }
    else if (v === Infinity || v === -Infinity) {
        e = (1 << ebits) - 1;
        f = 0;
        s = v < 0 ? 1 : 0;
    }
    else if (v === 0) {
        e = 0;
        f = 0;
        s = 1 / v === -Infinity ? 1 : 0;
    }
    else {
        s = v < 0;
        v = abs(v);
        if (v >= pow(2, 1 - bias)) {
            e = min(floor(log(v) / LN2), 1023);
            var significand = v / pow(2, e);
            if (significand < 1) {
                e -= 1;
                significand *= 2;
            }
            if (significand >= 2) {
                e += 1;
                significand /= 2;
            }
            var d = pow(2, fbits);
            f = roundToEven(significand * d) - d;
            e += bias;
            if (f / d >= 1) {
                e += 1;
                f = 0;
            }
            if (e > 2 * bias) {
                e = (1 << ebits) - 1;
                f = 0;
            }
        }
        else {
            e = 0;
            f = roundToEven(v / pow(2, 1 - bias - fbits));
        }
    }
    var bits = [], i;
    for (i = fbits; i; i -= 1) {
        bits.push(f % 2 ? 1 : 0);
        f = floor(f / 2);
    }
    for (i = ebits; i; i -= 1) {
        bits.push(e % 2 ? 1 : 0);
        e = floor(e / 2);
    }
    bits.push(s ? 1 : 0);
    bits.reverse();
    var str = bits.join('');
    var bytes = [];
    while (str.length) {
        bytes.unshift(parseInt(str.substring(0, 8), 2));
        str = str.substring(8);
    }
    return bytes;
}
function unpackIEEE754(bytes, ebits, fbits) {
    var bits = [], i, j, b, str, bias, s, e, f;
    for (i = 0; i < bytes.length; ++i) {
        b = bytes[i];
        for (j = 8; j; j -= 1) {
            bits.push(b % 2 ? 1 : 0);
            b = b >> 1;
        }
    }
    bits.reverse();
    str = bits.join('');
    bias = (1 << (ebits - 1)) - 1;
    s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
    e = parseInt(str.substring(1, 1 + ebits), 2);
    f = parseInt(str.substring(1 + ebits), 2);
    if (e === (1 << ebits) - 1) {
        return f !== 0 ? NaN : s * Infinity;
    }
    else if (e > 0) {
        return s * pow(2, e - bias) * (1 + f / pow(2, fbits));
    }
    else if (f !== 0) {
        return s * pow(2, -(bias - 1)) * (f / pow(2, fbits));
    }
    else {
        return s < 0 ? -0 : 0;
    }
}
exports.unpackF64 = unpackF64;
exports.unpackF32 = unpackF32;
exports.packF64 = packF64;
exports.packF32 = packF32;
//# sourceMappingURL=ieee.js.map