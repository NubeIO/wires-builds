"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_model_1 = require("../model/point-model");
class MqttPointCreator {
    constructor() {
    }
}
exports.MqttPointCreator = MqttPointCreator;
MqttPointCreator.from = (json) => {
    var _a, _b, _c, _d, _e;
    let mqttPoint = new DefaultMqttPoint();
    mqttPoint.mqttTopic = (_a = json) === null || _a === void 0 ? void 0 : _a.mqttTopic;
    let pv = (_b = json) === null || _b === void 0 ? void 0 : _b.pointValue;
    mqttPoint.pointValue = point_model_1.PointValueCreator.create((_c = pv) === null || _c === void 0 ? void 0 : _c.presentValue, (_d = pv) === null || _d === void 0 ? void 0 : _d.priority, (_e = pv) === null || _e === void 0 ? void 0 : _e.priorityArray);
    return mqttPoint;
};
MqttPointCreator.by = (mqttTopic, pointValue) => {
    let mqttPoint = new DefaultMqttPoint();
    mqttPoint.mqttTopic = mqttTopic;
    mqttPoint.pointValue = pointValue;
    return mqttPoint;
};
class DefaultMqttPoint {
    identifier() {
        return this.mqttTopic;
    }
    mightOnlyValueChanged(point) {
        var _a;
        return this.mqttTopic === ((_a = point) === null || _a === void 0 ? void 0 : _a.mqttTopic);
    }
    equals(point) {
        var _a;
        return this.identifier() === ((_a = point) === null || _a === void 0 ? void 0 : _a.identifier());
    }
}
//# sourceMappingURL=mqtt-model.js.map