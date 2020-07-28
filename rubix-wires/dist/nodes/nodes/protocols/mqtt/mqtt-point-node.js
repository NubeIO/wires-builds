"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../../../../decorators");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const node_mixin_1 = require("../../node-mixin");
const point_node_1 = require("../model/point-node");
const mqtt_model_1 = require("./core/mqtt-model");
const mqtt_client_node_1 = require("./mqtt-client-node");
const mqtt_client_node_event_1 = require("./mqtt-client-node-event");
class MqttPointNode extends point_node_1.PointNodeMixin(node_mixin_1.AbleEnableNode(node_1.Node)) {
    constructor() {
        super();
        this.title = 'MQTT Point';
        this.description = `Mqtt Point Node includes MQTT publisher and subscriber inside.`;
        this.mixinEnableInputSetting();
        this.addInputWithSettings('topic', node_1.Type.STRING, '', 'MQTT Topic');
        let pvSettingCfg = this.mixinPointValueInputOutput();
        this.setSettingsConfig(pvSettingCfg);
    }
    onRemoved() {
        let mqttPoint = this.initializePointBySettingInput();
        let payload = this.createStoreItem(mqttPoint);
        mqtt_client_node_event_1.default.unregisterSubscriber(this.getParentNode(), payload);
        mqtt_client_node_event_1.default.unregisterPublisher(this.getParentNode(), payload);
    }
    handleOnUpdate(current, prev) {
        var _a, _b;
        if (this.side !== container_1.Side.server || (!((_a = prev) === null || _a === void 0 ? void 0 : _a.mqttTopic) && !((_b = current) === null || _b === void 0 ? void 0 : _b.mqttTopic))) {
            return null;
        }
        let publisherPayload = this.createStoreItem(current, (data) => this.onConvertMessage(data));
        let subscribePayload = this.createStoreItem(current, (msg, n) => this.onReceiveMessage(msg, n));
        if (!prev) {
            mqtt_client_node_event_1.default.registerSubscriber(this.getParentNode(), subscribePayload);
            return mqtt_client_node_event_1.default.registerPublisher(this.getParentNode(), publisherPayload);
        }
        if (!current.mightOnlyValueChanged(prev)) {
            let prevItem = this.createStoreItem(prev);
            publisherPayload.prev = prevItem;
            subscribePayload.prev = prevItem;
            mqtt_client_node_event_1.default.updateSubscriber(this.getParentNode(), subscribePayload);
            return mqtt_client_node_event_1.default.updatePublisher(this.getParentNode(), publisherPayload);
        }
        let cov = current.pointValue.changedOfValue(prev.pointValue);
        if (cov) {
            publisherPayload.data = cov;
        }
        return mqtt_client_node_event_1.default.publishData(this.getParentNode(), publisherPayload);
    }
    initializePointBySettingInput(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return mqtt_model_1.MqttPointCreator.by(this.isEnabled(), st['topic'].value, this.createPointValue(st));
    }
    initializePointBySettingObject(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return st[this.modelSettingKey()].value
            ? mqtt_model_1.MqttPointCreator.from(st[this.modelSettingKey()].value)
            : this.initializePointBySettingInput(st);
    }
    onConvertMessage(data) {
        return mqtt_model_1.MqttPointValue.by(data).toString();
    }
    onReceiveMessage(msg, nodeId) {
        return this.updateOutput(mqtt_model_1.MqttPointValue.parse(msg).to(), nodeId);
    }
    ;
    handler() {
        return this;
    }
    modelSettingKey() {
        return `mqttp`;
    }
    presentValueInputIdx() {
        return 2;
    }
    computeTitle() {
        return `MQTT Point (Topic: ${this.settings['topic'].value})`;
    }
    enableDescription() {
        return 'Enable MQTT Point';
    }
    createStoreItem(mqttPoint, callback) {
        return {
            identifier: mqttPoint.identifier(),
            enabled: mqttPoint.enabled,
            nodeId: registry_1.default.getId(this.cid, this.id),
            data: mqttPoint.pointValue,
            callback: callback,
        };
    }
}
__decorate([
    decorators_1.ErrorHandler
], MqttPointNode.prototype, "handleOnUpdate", null);
__decorate([
    decorators_1.ErrorHandler
], MqttPointNode.prototype, "initializePointBySettingInput", null);
__decorate([
    decorators_1.ErrorHandler
], MqttPointNode.prototype, "initializePointBySettingObject", null);
container_1.Container.registerNodeType('protocols/mqtt/mqtt-point', MqttPointNode, mqtt_client_node_1.MQTT_CLIENT_NODE);
//# sourceMappingURL=mqtt-point-node.js.map