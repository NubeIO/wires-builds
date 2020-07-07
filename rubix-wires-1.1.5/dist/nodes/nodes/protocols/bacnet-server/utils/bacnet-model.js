"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PointKind;
(function (PointKind) {
    PointKind["ANALOG_INPUT"] = "0";
    PointKind["ANALOG_OUTPUT"] = "1";
    PointKind["ANALOG_VALUE"] = "2";
    PointKind["BINARY_INPUT"] = "3";
    PointKind["BINARY_OUTPUT"] = "4";
    PointKind["BINARY_VALUE"] = "5";
    PointKind["MULTI_STATE_INPUT"] = "13";
    PointKind["MULTI_STATE_OUTPUT"] = "14";
    PointKind["MULTI_STATE_VALUE"] = "19";
})(PointKind = exports.PointKind || (exports.PointKind = {}));
class BacnetPointCreator {
    constructor() {
    }
}
exports.BacnetPointCreator = BacnetPointCreator;
BacnetPointCreator.from = (json) => {
    var _a, _b, _c, _d, _e, _f, _g;
    let bp = new DefaultBacnetPoint();
    bp.objectInstance = (_a = json) === null || _a === void 0 ? void 0 : _a.objectInstance;
    bp.objectType = (_b = json) === null || _b === void 0 ? void 0 : _b.objectType;
    bp.objectName = (_c = json) === null || _c === void 0 ? void 0 : _c.objectName;
    let pv = (_d = json) === null || _d === void 0 ? void 0 : _d.pointValue;
    bp.pointValue = BacnetPointCreator.createPointValue((_e = pv) === null || _e === void 0 ? void 0 : _e.presentValue, (_f = pv) === null || _f === void 0 ? void 0 : _f.priority, (_g = pv) === null || _g === void 0 ? void 0 : _g.priorityArray);
    return bp;
};
BacnetPointCreator.create = (objectInstance, objectType, objectName, presentValue, priority, priorityArray) => {
    let bp = new DefaultBacnetPoint();
    bp.objectInstance = objectInstance;
    bp.objectType = objectType;
    bp.objectName = objectName;
    bp.pointValue = BacnetPointCreator.createPointValue(presentValue, priority, priorityArray);
    return bp;
};
BacnetPointCreator.createPointValue = (presentValue, priority, priorityArray) => {
    const createPriorityArray = () => Array.from({ length: 16 }, (v, k) => k + 1).reduce((o, k) => (o[k] = null, o), {});
    const normalizePriorityArray = (priorityArray) => {
        if (!priorityArray) {
            return createPriorityArray();
        }
        if (priorityArray instanceof Array) {
            let len = priorityArray.length;
            if (len === 0) {
                return createPriorityArray();
            }
            if (len !== 16) {
                throw new Error('Invalid priority array');
            }
            return priorityArray.reduce((o, k, i) => (o[i + 1] = k, o), {});
        }
        if (typeof priorityArray !== 'object') {
            throw new Error('Invalid priority array');
        }
        let pa = createPriorityArray();
        for (let key in pa) {
            if (priorityArray.hasOwnProperty(key)) {
                pa[key] = priorityArray[key];
            }
        }
        return pa;
    };
    let pv = {};
    pv.presentValue = presentValue;
    pv.priority = priority || 16;
    pv.priorityArray = normalizePriorityArray(priorityArray);
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
class DefaultBacnetPoint {
    identifier() {
        return `${this.objectType}:${this.objectInstance}`;
    }
    mightOnlyValueChanged(bp) {
        var _a, _b, _c;
        return this.objectInstance === ((_a = bp) === null || _a === void 0 ? void 0 : _a.objectInstance) && this.objectType === ((_b = bp) === null || _b === void 0 ? void 0 : _b.objectType) && this.objectName === ((_c = bp) === null || _c === void 0 ? void 0 : _c.objectName);
    }
    equals(bp) {
        var _a;
        return this.identifier() === ((_a = bp) === null || _a === void 0 ? void 0 : _a.identifier());
    }
}
exports.PointKindOpts = Object.entries(PointKind).map(kv => {
    return { 'text': kv[0].toLowerCase().replace('_', '-'), 'value': parseInt(kv[1]) };
});
//# sourceMappingURL=bacnet-model.js.map