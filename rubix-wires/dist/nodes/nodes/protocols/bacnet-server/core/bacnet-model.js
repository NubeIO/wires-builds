"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_model_1 = require("../../../../../backend/models/point-model");
const helper_1 = require("../../../../../utils/helper");
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
exports.PointKindOpts = Object.entries(PointKind).map(kv => {
    return { text: kv[0].toLowerCase().replace('_', '-'), value: parseInt(kv[1]) };
});
class BacnetPointCreator {
    constructor() {
    }
}
exports.BacnetPointCreator = BacnetPointCreator;
BacnetPointCreator.from = (json) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (helper_1.isNull(json)) {
        return null;
    }
    let pv = (_a = json) === null || _a === void 0 ? void 0 : _a.pointValue;
    return BacnetPointCreator.create((_b = json) === null || _b === void 0 ? void 0 : _b.enabled, (_c = json) === null || _c === void 0 ? void 0 : _c.objectInstance, (_d = json) === null || _d === void 0 ? void 0 : _d.objectType, (_e = json) === null || _e === void 0 ? void 0 : _e.objectName, (_f = pv) === null || _f === void 0 ? void 0 : _f.presentValue, (_g = pv) === null || _g === void 0 ? void 0 : _g.priority, (_h = pv) === null || _h === void 0 ? void 0 : _h.priorityArray);
};
BacnetPointCreator.create = (enabled, objectInstance, objectType, objectName, presentValue, priority, priorityArray) => {
    return BacnetPointCreator.by(enabled, objectInstance, objectType, objectName, point_model_1.PointValueCreator.create(presentValue, priority, priorityArray));
};
BacnetPointCreator.by = (enabled, objectInstance, objectType, objectName, pointValue) => {
    return new DefaultBacnetPoint(enabled, objectInstance, objectType, objectName, pointValue);
};
class DefaultBacnetPoint {
    constructor(enabled, objectInstance, objectType, objectName, pointValue) {
        this.enabled = enabled || false;
        this.objectInstance = objectInstance;
        this.objectType = objectType;
        this.objectName = objectName;
        this.pointValue = pointValue;
    }
    identifier() {
        return `${this.objectType}:${this.objectInstance}`;
    }
    mightOnlyValueChanged(bp) {
        var _a, _b, _c, _d;
        return (this.enabled === ((_a = bp) === null || _a === void 0 ? void 0 : _a.enabled) && this.objectInstance === ((_b = bp) === null || _b === void 0 ? void 0 : _b.objectInstance) &&
            this.objectType === ((_c = bp) === null || _c === void 0 ? void 0 : _c.objectType) && this.objectName === ((_d = bp) === null || _d === void 0 ? void 0 : _d.objectName));
    }
    equals(bp) {
        var _a;
        return this.identifier() === ((_a = bp) === null || _a === void 0 ? void 0 : _a.identifier());
    }
}
//# sourceMappingURL=bacnet-model.js.map