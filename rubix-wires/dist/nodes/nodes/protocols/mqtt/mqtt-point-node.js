"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_model_1 = require("../../../../backend/models/point-model");
const helper_1 = require("../../../../utils/helper");
const pattern_1 = require("../../../../utils/pattern");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const connection_node_mixin_1 = require("../connection-node-mixin");
const point_node_1 = require("../model/point-node");
const mqtt_model_1 = require("./core/mqtt-model");
const mqtt_client_node_1 = require("./mqtt-client-node");
const mqtt_client_node_store_1 = require("./mqtt-client-node-store");
class MqttPointNode extends connection_node_mixin_1.DependantConnectionNodeMixin(point_node_1.PointNodeMixin(node_1.Node)) {
    constructor() {
        super();
        this._iTopic = 'topic';
        this._sReqRes = 'enabledReqRes';
        this.title = 'MQTT Point';
        this.description =
            'Mqtt Point Node includes MQTT publisher and subscriber inside. ' +
                'This node connects to an MQTT Broker, subscribes to a topic, ' +
                'and can publish values once we enable the node.';
        this.mixinEnableInputSetting();
        this.mixinConnectionStatusOutput();
        this.addInputWithSettings(this._iTopic, node_1.Type.STRING, '', 'MQTT Topic');
        this.settings[this._sReqRes] = {
            description: 'Request Response mode',
            type: node_1.SettingType.BOOLEAN,
            value: false,
        };
        this.setSettingsConfig(this.mixinPointValueInputOutput());
    }
    flowHandler() {
        return this;
    }
    listener() {
        var _a;
        return _a = this.getParentNode(), (_a !== null && _a !== void 0 ? _a : pattern_1.MockCentralizedListener.LISTENER);
    }
    pointObservers() {
        return [...super.pointObservers(),
            ...this.getParentNode().pointObservers()];
    }
    notifyOutput(point, observers) {
        var _a, _b;
        if (helper_1.isNull(point)) {
            return;
        }
        let cp = this.initializePointBySettingObject();
        point.pointValue = helper_1.isNull((_a = point) === null || _a === void 0 ? void 0 : _a.pointValue) ? point_model_1.PointValueCreator.by() : point.pointValue.merge((_b = cp) === null || _b === void 0 ? void 0 : _b.pointValue);
        this.settings[this.modelSettingKey()].value = point;
        new pattern_1.DefaultObservable(observers).notify({ point: point, connStatus: { status: this.getConnectionStatus() } });
    }
    onRemoved() {
        if (this.listener() === pattern_1.MockCentralizedListener.LISTENER) {
            return;
        }
        let mqttPoint = this.initializePointBySettingObject();
        if (mqttPoint) {
            this.listener().listen({ action: mqtt_client_node_1.UNREGISTER_MQTT_POINT, payload: this.createMqttPointStoreItem(mqttPoint) });
        }
    }
    reEvaluateSettingByInput(inputs, settings) {
        settings[this._iTopic].value = inputs[this.topicInputIdx()].updated ? inputs[this.topicInputIdx()].data
            : settings[this._iTopic].value;
        super.reEvaluateSettingByInput(inputs, settings);
    }
    handleOnUpdate(current, prev) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!((_a = prev) === null || _a === void 0 ? void 0 : _a.mqttTopic) && !((_b = current) === null || _b === void 0 ? void 0 : _b.mqttTopic)) {
            return null;
        }
        if (helper_1.isEmpty(current.mqttTopic)) {
            throw new Error('Must define MQTT topic');
        }
        let payload = this.createMqttPointStoreItem(current);
        if (helper_1.isNull(prev) || this.getConnectionStatus().isError()) {
            this.listener().listen({ action: mqtt_client_node_1.REGISTER_MQTT_POINT, payload });
        }
        else if (!current.mightOnlyValueChanged(prev)) {
            if (!current.equals(prev)) {
                current.pointValue = point_model_1.PointValueCreator.by();
            }
            payload.publisher.prev = this.createMqttPointStoreItem(prev);
            payload.subscriber.prev = this.createMqttPointStoreItem(prev);
            this.listener().listen({ action: mqtt_client_node_1.UPDATE_MQTT_POINT, payload });
        }
        if (!current.enabled || (helper_1.isNull((_d = (_c = current) === null || _c === void 0 ? void 0 : _c.pointValue) === null || _d === void 0 ? void 0 : _d.presentValue) &&
            (prev && !current.equals(prev) || helper_1.isNull((_f = (_e = prev) === null || _e === void 0 ? void 0 : _e.pointValue) === null || _f === void 0 ? void 0 : _f.presentValue)))) {
            return current;
        }
        if (current.isReqRes) {
            return this.listener().listen({ action: mqtt_client_node_1.PUBLISH_MQTT_DATA, payload: payload.toPublisher() });
        }
        let cov = current.pointValue.changedOfValue((_g = prev) === null || _g === void 0 ? void 0 : _g.pointValue);
        if (cov) {
            payload.publisher.data.pointValue = cov;
        }
        return this.listener().listen({ action: mqtt_client_node_1.PUBLISH_MQTT_DATA, payload: payload.toPublisher() });
    }
    initializePointBySettingInput(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return mqtt_model_1.SillyMqttPoint.by(mqtt_model_1.MqttPointCreator.by(this.isEnabled(), st[this._iTopic].value, this.createPointValue(st)), this.settings[this._sReqRes].value);
    }
    initializePointBySettingObject(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return mqtt_model_1.SillyMqttPoint.by(mqtt_model_1.MqttPointCreator.from(st[this.modelSettingKey()].value), this.settings[this._sReqRes].value);
    }
    onConvertMessage(data) {
        var _a;
        return mqtt_model_1.MqttPointValue.by((_a = data) === null || _a === void 0 ? void 0 : _a.pointValue).toString();
    }
    onReceiveMessage(incomingMessage) {
        let pointValue = mqtt_model_1.MqttPointValue.parse(incomingMessage).to();
        let cp = this.initializePointBySettingObject();
        cp.pointValue = pointValue.merge(cp.pointValue);
        if (this.settings[this._sReqRes].value) {
            this.listener().listen({ action: mqtt_client_node_1.PUBLISH_MQTT_DATA, payload: this.createMqttPointStoreItem(cp).toPublisher() });
        }
        this.notifyOutput((this.settings[this.modelSettingKey()].value = cp), this.pointObservers());
    }
    statusOutputIdx() {
        return 0;
    }
    modelSettingKey() {
        return `mqttp`;
    }
    valueInputIdx() {
        return 2;
    }
    valueOutputIdx() {
        return 2;
    }
    computeTitle() {
        return `MQTT Point (Topic: ${this.settings[this._iTopic].value})`;
    }
    enableDescription() {
        return 'Enable MQTT Point';
    }
    topicInputIdx() {
        return 1;
    }
    createMqttPointStoreItem(mqttPoint) {
        var _a;
        return new mqtt_client_node_store_1.MqttPointStoreItem(mqttPoint.identifier(), registry_1.default.getId(this.cid, this.id), (_a = mqttPoint) === null || _a === void 0 ? void 0 : _a.enabled, {
            identifier: mqttPoint.publishedTopic(),
            data: mqttPoint,
            callback: (data) => this.onConvertMessage(data),
        }, {
            identifier: mqttPoint.subscribedTopic(),
            callback: (msg) => this.onReceiveMessage(msg),
        });
    }
}
container_1.Container.registerNodeType('protocols/mqtt/mqtt-point', MqttPointNode, mqtt_client_node_1.MQTT_CLIENT_NODE);
//# sourceMappingURL=mqtt-point-node.js.map