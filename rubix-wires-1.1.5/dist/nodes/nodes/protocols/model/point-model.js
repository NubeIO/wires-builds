"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PointValueCreator {
    constructor() {
    }
}
exports.PointValueCreator = PointValueCreator;
PointValueCreator.create = (presentValue, priority, priorityArray) => {
    let pv = {};
    pv.presentValue = presentValue;
    pv.priority = priority || 16;
    pv.priorityArray = PointValueCreator.normalizePriorityArray(priorityArray);
    if (pv.priority < 1 || pv.priority > 16) {
        throw new Error('Priority must be in range [1, 16]');
    }
    let highestValue = Object.entries(pv.priorityArray).find(pa => pa[1]);
    pv.priorityArray[pv.priority] = pv.presentValue;
    if (highestValue && parseInt(highestValue[0]) === pv.priority && pv.presentValue === null) {
        highestValue = Object.entries(pv.priorityArray).find(pa => pa[1]);
    }
    if (highestValue && (pv.priority > parseInt(highestValue[0]) || pv.presentValue === null)) {
        pv.priority = parseInt(highestValue[0]);
        pv.presentValue = highestValue[1];
    }
    return pv;
};
PointValueCreator.createPriorityArray = () => {
    return Array.from({ length: 16 }, (v, k) => k + 1).reduce((o, k) => (o[k] = null, o), {});
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
        return priorityArray.reduce((o, k, i) => (o[i + 1] = k, o), {});
    }
    if (typeof priorityArray !== 'object') {
        throw new Error('Invalid priority array');
    }
    let pa = PointValueCreator.createPriorityArray();
    for (let key in pa) {
        if (priorityArray.hasOwnProperty(key)) {
            pa[key] = priorityArray[key];
        }
    }
    return pa;
};
//# sourceMappingURL=point-model.js.map