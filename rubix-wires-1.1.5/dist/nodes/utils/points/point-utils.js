"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PointUtils {
    static configItemsString(arr) {
        const configItems = [];
        Array(arr.length)
            .fill(null)
            .map((_, i) => configItems.push({ value: arr[i], text: arr[i] }));
        return configItems;
    }
    static configItemsStrValNum(arr) {
        const configItems = [];
        Array(arr.length)
            .fill(null)
            .map((_, i) => configItems.push({ value: i, text: arr[i] }));
        return configItems;
    }
    static configItemsNum(num) {
        const configItems = [];
        Array(num)
            .fill(null)
            .map((_, i) => configItems.push({ value: i + 1, text: (i + 1).toString() }));
        return configItems;
    }
}
exports.default = PointUtils;
//# sourceMappingURL=point-utils.js.map