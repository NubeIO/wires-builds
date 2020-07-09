"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const valueFormats_1 = require("./valueFormats");
const moment_wrapper_1 = require("../datetime/moment_wrapper");
console.log(valueFormats_1.toFixed(22.66666666, 1));
const result = valueFormats_1.getValueFormat('celsius')(23.2234234, 4);
const full = valueFormats_1.formattedValueToString(result);
console.log(result);
console.log(full);
const tests = [
    {
        id: 'time:YYYY.MM.DD.HH.MM.SS.MS',
        decimals: 0,
        value: moment_wrapper_1.dateTime(new Date()).valueOf(),
        timeZone: 'America/Los_Angeles',
    },
];
const test = tests[0];
const result1 = valueFormats_1.getValueFormat(test.id)(test.value, test.decimals, 0, test.timeZone);
const full1 = valueFormats_1.formattedValueToString(result1);
console.log(result1);
console.log(full1);
const unitGroups = valueFormats_1.getValueFormats();
const groupOptions = unitGroups.map(group => {
    const options = group.submenu.map(unit => {
        const sel = {
            value: unit.value,
            text: unit.text,
        };
        return sel;
    });
    return {
        category: group.text,
        items: options,
    };
});
//# sourceMappingURL=tests.js.map