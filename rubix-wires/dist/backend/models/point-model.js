"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../utils/helper");
class PointValueCreator {
    constructor() {
    }
}
exports.PointValueCreator = PointValueCreator;
PointValueCreator.init = (presentValue, priority, priorityArray) => {
    if (priority && (priority < 1 || priority > 16)) {
        throw new Error('Priority must be in range [1, 16]');
    }
    let pv = new DefaultPointValue();
    pv.presentValue = (presentValue !== null && presentValue !== void 0 ? presentValue : null);
    pv.priority = priority === undefined ? 16 : priority;
    pv.priorityArray = PointValueCreator.normalizePriorityArray(priorityArray);
    return pv;
};
PointValueCreator.by = (priorityArray) => {
    var _a;
    let pa = PointValueCreator.normalizePriorityArray(priorityArray);
    let highestValue = (_a = Object.entries(pa).find(pa => pa[1]), (_a !== null && _a !== void 0 ? _a : [16, null]));
    return PointValueCreator.init(helper_1.convertToNumber(highestValue[1]), helper_1.convertToNumber(highestValue[0]), pa);
};
PointValueCreator.create = (presentValue, priority, priorityArray) => {
    var _a;
    let pv = PointValueCreator.init(presentValue, priority, priorityArray);
    if (pv.isResetState()) {
        return pv;
    }
    let highestValue = (_a = Object.entries(pv.priorityArray).find(pa => pa[1]), (_a !== null && _a !== void 0 ? _a : [16, null]));
    pv.priorityArray[pv.priority] = pv.presentValue;
    if (highestValue && helper_1.convertToNumber(highestValue[0]) === pv.priority && pv.presentValue === null) {
        highestValue = Object.entries(pv.priorityArray).find(([_, v]) => helper_1.isNotNull(v));
    }
    if (highestValue && (pv.priority > helper_1.convertToNumber(highestValue[0]) || pv.presentValue === null)) {
        pv.priority = helper_1.convertToNumber(highestValue[0]);
        pv.presentValue = highestValue[1];
    }
    return pv;
};
PointValueCreator.createPriorityArray = () => {
    return Array.from(helper_1.range(1, 16)).reduce((o, k) => ((o[k] = null), o), {});
};
PointValueCreator.normalizePriorityArray = (priorityArray) => {
    if (!priorityArray) {
        return PointValueCreator.createPriorityArray();
    }
    if (priorityArray instanceof Array) {
        let len = priorityArray.length;
        if (len === 0) {
            return PointValueCreator.createPriorityArray();
        }
        if (len !== 16) {
            throw new Error('Invalid priority array');
        }
        return priorityArray.reduce((o, k, i) => ((o[i + 1] = helper_1.convertToNumber(k)), o), {});
    }
    if (typeof priorityArray !== 'object') {
        throw new Error('Invalid priority array');
    }
    let pa = PointValueCreator.createPriorityArray();
    for (let key in pa) {
        if (priorityArray.hasOwnProperty(key)) {
            pa[key] = helper_1.convertToNumber(priorityArray[key]);
        }
    }
    return pa;
};
class DefaultPointValue {
    isResetState() {
        return helper_1.isNull(this.presentValue) && helper_1.isNull(this.priority);
    }
    changedOfValue(prev) {
        if (!prev) {
            return this;
        }
        if (this.presentValue !== prev.presentValue || this.priority !== prev.priority) {
            return this;
        }
        let pv = new DefaultPointValue();
        for (const priority in this.priorityArray) {
            if (this.priorityArray[priority] !== prev.priorityArray[priority]) {
                pv.priority = helper_1.convertToNumber(priority);
                pv.presentValue = this.priorityArray[priority];
                pv.priorityArray = this.priorityArray;
                return pv;
            }
        }
        return null;
    }
    merge(prev) {
        if (!prev || !prev.priorityArray) {
            return PointValueCreator.create(this.presentValue, this.priority, this.priorityArray);
        }
        if (this.isResetState()) {
            return PointValueCreator.create(null, 16);
        }
        let arr = {};
        for (const priority in this.priorityArray) {
            arr[priority] = helper_1.isNull(this.priorityArray[priority]) && helper_1.isNotNull(prev.priorityArray[priority])
                ? prev.priorityArray[priority] : this.priorityArray[priority];
        }
        return PointValueCreator.create(this.presentValue, this.priority, arr);
    }
}
//# sourceMappingURL=point-model.js.map