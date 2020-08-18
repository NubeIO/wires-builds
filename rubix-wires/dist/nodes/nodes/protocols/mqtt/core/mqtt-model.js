"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_model_1 = require("../../../../../backend/models/point-model");
const helper_1 = require("../../../../../utils/helper");
class MqttPointCreator {
    constructor() {
    }
}
exports.MqttPointCreator = MqttPointCreator;
MqttPointCreator.from = (json) => {
    var _a, _b, _c, _d, _e, _f;
    if (helper_1.isNull(json)) {
        return null;
    }
    let pv = (_a = json) === null || _a === void 0 ? void 0 : _a.pointValue;
    return MqttPointCreator.by((_b = json) === null || _b === void 0 ? void 0 : _b.enabled, (_c = json) === null || _c === void 0 ? void 0 : _c.mqttTopic, point_model_1.PointValueCreator.create((_d = pv) === null || _d === void 0 ? void 0 : _d.presentValue, (_e = pv) === null || _e === void 0 ? void 0 : _e.priority, (_f = pv) === null || _f === void 0 ? void 0 : _f.priorityArray));
};
MqttPointCreator.by = (enabled, mqttTopic, pointValue) => {
    return new DefaultMqttPoint(enabled, mqttTopic, pointValue);
};
class DefaultMqttPoint {
    constructor(enabled, mqttTopic, pointValue) {
        this.enabled = enabled || false;
        this.mqttTopic = mqttTopic;
        this.pointValue = pointValue;
    }
    identifier() {
        return this.mqttTopic;
    }
    mightOnlyValueChanged(point) {
        var _a, _b;
        return this.enabled === ((_a = point) === null || _a === void 0 ? void 0 : _a.enabled) && this.mqttTopic === ((_b = point) === null || _b === void 0 ? void 0 : _b.mqttTopic);
    }
    equals(point) {
        var _a;
        return this.identifier() === ((_a = point) === null || _a === void 0 ? void 0 : _a.identifier());
    }
}
class MqttPointValue {
    constructor(value, priority) {
        this.value = value;
        this.priority = priority;
    }
    static by(pv) {
        var _a, _b, _c;
        return new MqttPointValue((_a = pv) === null || _a === void 0 ? void 0 : _a.presentValue, (_c = (_b = pv) === null || _b === void 0 ? void 0 : _b.priority, (_c !== null && _c !== void 0 ? _c : 16)));
    }
    static parse(message) {
        var _a, _b;
        try {
            let payload = helper_1.isJSON(message) ? message : JSON.parse(message);
            return new MqttPointValue((_a = payload) === null || _a === void 0 ? void 0 : _a.value, (_b = payload) === null || _b === void 0 ? void 0 : _b.priority);
        }
        catch (e) {
            throw new Error('Invalid JSON when parsing MQTTMessage');
        }
    }
    to() {
        return point_model_1.PointValueCreator.init(this.value, this.priority);
    }
    toString() {
        return JSON.stringify(this);
    }
}
exports.MqttPointValue = MqttPointValue;
class SillyMqttPoint extends DefaultMqttPoint {
    constructor(mqttPoint, isReqRes) {
        super(mqttPoint.enabled, mqttPoint.mqttTopic, mqttPoint.pointValue);
        this.isReqRes = false;
        this.isReqRes = isReqRes;
    }
    mightOnlyValueChanged(point) {
        var _a;
        return super.mightOnlyValueChanged(point) && this.isReqRes === ((_a = point) === null || _a === void 0 ? void 0 : _a.isReqRes);
    }
    subscribedTopic() {
        return this.isReqRes ? `${this.mqttTopic}/req` : this.mqttTopic;
    }
    publishedTopic() {
        return this.isReqRes ? `${this.mqttTopic}/res` : this.mqttTopic;
    }
}
exports.SillyMqttPoint = SillyMqttPoint;
SillyMqttPoint.by = (mqttPoint, isReqRes) => {
    return helper_1.isNull(mqttPoint) ? null : new SillyMqttPoint(mqttPoint, isReqRes);
};
//# sourceMappingURL=mqtt-model.js.map