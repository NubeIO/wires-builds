"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const point_node_1 = require("../model/point-node");
const ProtocolDeviceNode_1 = require("../ProtocolDeviceNode");
const mqtt_model_1 = require("./core/mqtt-model");
const mqtt_client_node_1 = require("./mqtt-client-node");
const mqtt_client_node_event_1 = require("./mqtt-client-node-event");
const mqtt_client_node_store_1 = require("./mqtt-client-node-store");
class MqttPointNode extends ProtocolDeviceNode_1.DependantConnectionNodeMixin(point_node_1.PointNodeMixin(node_1.Node)) {
    constructor() {
        super();
        this._iTopic = 'topic';
        this.title = 'MQTT Point';
        this.description =
            'Mqtt Point Node includes MQTT publisher and subscriber inside. ' +
                'This node connects to an MQTT Broker, subscribes to a topic, ' +
                'and can publish values once we enable the node.';
        this.mixinEnableInputSetting();
        this.mixinConnectionStatusOutput();
        this.addInputWithSettings(this._iTopic, node_1.Type.STRING, '', 'MQTT Topic');
        this.settings['enabledReqRes'] = {
            description: 'Enable Request Response pattern',
            type: node_1.SettingType.BOOLEAN,
            value: false,
        };
        this.setSettingsConfig(this.mixinPointValueInputOutput());
    }
    onRemoved() {
        let mqttPoint = this.initializePointBySettingObject();
        if (mqttPoint) {
            mqtt_client_node_event_1.default.unregisterPoint(this.getParentNode(), this.createMqttPointStoreItem(mqttPoint));
        }
    }
    reEvaluateSettingByInput(inputs, settings) {
        settings[this._iTopic].value = inputs[this.topicInputIdx()].updated ? inputs[this.topicInputIdx()].data
            : settings[this._iTopic].value;
        super.reEvaluateSettingByInput(inputs, settings);
    }
    handleOnUpdate(current, prev) {
        var _a, _b;
        if (this.side !== container_1.Side.server || (!((_a = prev) === null || _a === void 0 ? void 0 : _a.mqttTopic) && !((_b = current) === null || _b === void 0 ? void 0 : _b.mqttTopic))) {
            return null;
        }
        let payload = this.createMqttPointStoreItem(current);
        if (!prev) {
            return mqtt_client_node_event_1.default.registerPoint(this.getParentNode(), payload);
        }
        if (!current.mightOnlyValueChanged(prev)) {
            payload.publisher.prev = this.createMqttPointStoreItem(prev);
            payload.subscriber.prev = this.createMqttPointStoreItem(prev);
            return mqtt_client_node_event_1.default.updatePoint(this.getParentNode(), payload);
        }
        if (current.isReqRes) {
            return mqtt_client_node_event_1.default.publishData(this.getParentNode(), payload.toPublisher());
        }
        let cov = current.pointValue.changedOfValue(prev.pointValue);
        if (cov) {
            payload.publisher.data = cov;
        }
        return mqtt_client_node_event_1.default.publishData(this.getParentNode(), payload.toPublisher());
    }
    initializePointBySettingInput(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return mqtt_model_1.SillyMqttPoint.by(mqtt_model_1.MqttPointCreator.by(this.isEnabled(), st['topic'].value, this.createPointValue(st)), this.settings['enabledReqRes'].value);
    }
    initializePointBySettingObject(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return mqtt_model_1.SillyMqttPoint.by(mqtt_model_1.MqttPointCreator.from(st[this.modelSettingKey()].value), this.settings['enabledReqRes'].value);
    }
    onConvertMessage(data) {
        return mqtt_model_1.MqttPointValue.by(data).toString();
    }
    onReceiveMessage(msg, nodeId) {
        return this.updatePointValueOutput(mqtt_model_1.MqttPointValue.parse(msg).to(), nodeId);
    }
    statusOutputIdx() {
        return 0;
    }
    updatePointValueOutput(pv, nodeId) {
        let npv = super.updatePointValueOutput(pv, nodeId);
        let self = (nodeId ? registry_1.default._nodes[nodeId] : this);
        if (!self || !npv) {
            return;
        }
        let current = this.initializePointBySettingInput();
        let payload = this.createMqttPointStoreItem(current);
        if (this.settings['enabledReqRes'].value) {
            mqtt_client_node_event_1.default.publishData(this.getParentNode(), payload);
        }
        return npv;
    }
    handler() {
        return this;
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
        return `MQTT Point (Topic: ${this.settings['topic'].value})`;
    }
    enableDescription() {
        return 'Enable MQTT Point';
    }
    topicInputIdx() {
        return 1;
    }
    createMqttPointStoreItem(mqttPoint) {
        var _a, _b;
        return new mqtt_client_node_store_1.MqttPointStoreItem(mqttPoint.identifier(), registry_1.default.getId(this.cid, this.id), (_a = mqttPoint) === null || _a === void 0 ? void 0 : _a.enabled, {
            identifier: mqttPoint.publishedTopic(),
            data: (_b = mqttPoint) === null || _b === void 0 ? void 0 : _b.pointValue,
            callback: (data) => this.onConvertMessage(data),
        }, {
            identifier: mqttPoint.subscribedTopic(),
            callback: (msg, n) => this.onReceiveMessage(msg, n),
        });
    }
}
container_1.Container.registerNodeType('protocols/mqtt/mqtt-point', MqttPointNode, mqtt_client_node_1.MQTT_CLIENT_NODE);
//# sourceMappingURL=mqtt-point-node.js.map