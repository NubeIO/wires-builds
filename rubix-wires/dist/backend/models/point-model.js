"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../utils/helper");
class PointValueCreator {
    constructor() {
    }
}
exports.PointValueCreator = PointValueCreator;
PointValueCreator.init = (presentValue, priority, priorityArray) => {
    if (priority < 1 || priority > 16) {
        throw new Error('Priority must be in range [1, 16]');
    }
    let pv = new DefaultPointValue();
    pv.presentValue = (presentValue !== null && presentValue !== void 0 ? presentValue : null);
    pv.priority = (priority !== null && priority !== void 0 ? priority : 16);
    pv.priorityArray = PointValueCreator.normalizePriorityArray(priorityArray);
    return pv;
};
PointValueCreator.create = (presentValue, priority, priorityArray) => {
    let pv = PointValueCreator.init(presentValue, priority, priorityArray);
    let highestValue = Object.entries(pv.priorityArray).find(pa => pa[1]);
    pv.priorityArray[pv.priority] = pv.presentValue;
    if (highestValue && helper_1.convertToNumber(highestValue[0]) === pv.priority && pv.presentValue === null) {
        highestValue = Object.entries(pv.priorityArray).find(pa => pa[1]);
    }
    if (highestValue && (pv.priority > helper_1.convertToNumber(highestValue[0]) || pv.presentValue === null)) {
        pv.priority = helper_1.convertToNumber(highestValue[0]);
        pv.presentValue = highestValue[1];
    }
    return pv;
};
PointValueCreator.createPriorityArray = () => {
    return Array.from({ length: 16 }, (v, k) => k + 1).reduce((o, k) => ((o[k] = null), o), {});
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
var HistoryMode;
(function (HistoryMode) {
    HistoryMode[HistoryMode["COV"] = 0] = "COV";
    HistoryMode[HistoryMode["TRIGGERED"] = 1] = "TRIGGERED";
})(HistoryMode = exports.HistoryMode || (exports.HistoryMode = {}));
class DefaultPointValue {
    changedOfValue(prev) {
        if (this.presentValue !== prev.presentValue || this.priority !== prev.priority) {
            return this;
        }
        let pv = {};
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
}
//# sourceMappingURL=point-model.js.map