function scaleUI420ma(ui_value, min_target = 4, max_target = 20, min_range = 0, max_range = 1, limit = true) {
    let slope = max_target / (max_range - min_range);
    let value_420 = (ui_value - min_range) * slope;
    if (limit)
        if (value_420 <= min_target)
            return min_target;
        else if (value_420 >= max_target)
            return max_target;
    return value_420;
}
function scale420maToRange(value_420, min_target = 0.0, max_target = 100.0, min_range = 4.0, max_range = 20.0, limit = true) {
    let slope = (max_target - min_target) / (max_range - min_range);
    if (limit)
        if (value_420 <= min_range)
            return min_target;
        else if (value_420 >= max_range)
            return max_target;
    return (value_420 - min_range) * slope;
}
let raw = scaleUI420ma(0.3864614183);
console.log(raw);
let scaledResult = scale420maToRange(raw);
console.log(scaledResult);
//# sourceMappingURL=ma_40-20ma-test.js.map