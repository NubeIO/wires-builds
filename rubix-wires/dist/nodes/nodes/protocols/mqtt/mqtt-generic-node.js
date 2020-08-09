"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../../../../utils/decorators");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const node_mixin_1 = require("../../node-mixin");
const mqtt_client_node_1 = require("./mqtt-client-node");
const mqtt_client_node_event_1 = require("./mqtt-client-node-event");
class MqttGenericNode extends node_mixin_1.AbleEnableNode(node_1.Node) {
    constructor(title, description) {
        super();
        this._title = this.title = title;
        this.description = description;
        this.mixinEnableInputSetting();
        this.addInputWithSettings('topic', node_1.Type.STRING, '', 'MQTT Topic');
    }
    onAdded() {
        this.handleOnUpdate(this.createPayload());
        this.updateTitle();
    }
    onAfterSettingsChange(oldSettings, oldName) {
        this.handleOnUpdate(this.createPayload(), this.createPayload(oldSettings));
        this.updateTitle();
    }
    onInputUpdated() {
        let prev = { identifier: this.settings['topic'].value, enabled: this.isEnabled() };
        this.reEvaluateSettingByInput();
        let current = this.createPayload();
        this.handleOnUpdate(current, prev);
        this.updateTitle();
    }
    onRemoved() {
        this.doRemove({
            identifier: this.settings['topic'].value,
            nodeId: registry_1.default.getId(this.cid, this.id),
        });
    }
    reEvaluateSettingByInput() {
        var _a;
        this.settings['topic'].value = (_a = this.inputs[1].data, (_a !== null && _a !== void 0 ? _a : this.settings['topic'].value));
        super.reEvaluateSettingByInput();
    }
    enableDescription() {
        return `Enable ${this._title}`;
    }
    handleOnUpdate(current, prev) {
        var _a, _b;
        if (this.side !== container_1.Side.server || (!((_a = prev) === null || _a === void 0 ? void 0 : _a.identifier) && !((_b = current) === null || _b === void 0 ? void 0 : _b.identifier))) {
            return null;
        }
        if (!prev || !prev.identifier) {
            return this.doCreate(current);
        }
        if (current.identifier !== prev.identifier || current.enabled !== prev.enabled) {
            current.prev = prev;
            return this.doUpdate(current);
        }
    }
    updateTitle() {
        this.title = `${this._title} (${this.settings['topic'].value})`;
    }
    createPayload(settings) {
        var _a, _b;
        let identifier = (_a = ((settings !== null && settings !== void 0 ? settings : this.settings))['topic']) === null || _a === void 0 ? void 0 : _a.value;
        let enabled = settings ? (_b = settings[this.enableSettingKey()]) === null || _b === void 0 ? void 0 : _b.value : this.isEnabled();
        return {
            identifier: identifier,
            enabled: enabled,
            nodeId: registry_1.default.getId(this.cid, this.id),
        };
    }
}
__decorate([
    decorators_1.ErrorHandler
], MqttGenericNode.prototype, "handleOnUpdate", null);
class MqttPublisherNode extends MqttGenericNode {
    constructor() {
        super('MQTT Publisher', `MQTT Publisher Node is used to publish MQTT message for generic purpose`);
        this.addInputWithSettings('message', node_1.Type.ANY, '', 'MQTT Message');
    }
    onConvertMessage(data) {
        var _a;
        return (_a = data) === null || _a === void 0 ? void 0 : _a.toString();
    }
    reEvaluateSettingByInput() {
        var _a;
        this.settings['message'].value = (_a = this.inputs[2].data, (_a !== null && _a !== void 0 ? _a : this.settings['message'].value));
        super.reEvaluateSettingByInput();
    }
    doCreate(payload) {
        return mqtt_client_node_event_1.default.registerPublisher(this.getParentNode(), payload);
    }
    doUpdate(payload) {
        return mqtt_client_node_event_1.default.updatePublisher(this.getParentNode(), payload);
    }
    doRemove(payload) {
        mqtt_client_node_event_1.default.unregisterPublisher(this.getParentNode(), payload);
    }
    createPayload(settings) {
        let payload = super.createPayload(settings);
        payload.callback = data => this.onConvertMessage(data);
        payload.data = this.settings['message'].value;
        return payload;
    }
    handleOnUpdate(current, prev) {
        let updated = super.handleOnUpdate(current, prev);
        if (current.enabled) {
            return mqtt_client_node_event_1.default.publishData(this.getParentNode(), current);
        }
        return updated;
    }
}
class MqttSubscriberNode extends MqttGenericNode {
    constructor() {
        super('MQTT Subscriber', `MQTT Subscriber Node is used for generic purpose`);
        this.addOutput('out', node_1.Type.ANY);
    }
    onReceiveMessage(incomingMessage, nodeId) {
        let self = (nodeId ? registry_1.default._nodes[nodeId] : this);
        if (self) {
            self.setOutputData(0, incomingMessage);
        }
    }
    doCreate(payload) {
        return mqtt_client_node_event_1.default.registerSubscriber(this.getParentNode(), payload);
    }
    doUpdate(payload) {
        return mqtt_client_node_event_1.default.updateSubscriber(this.getParentNode(), payload);
    }
    doRemove(payload) {
        return mqtt_client_node_event_1.default.unregisterSubscriber(this.getParentNode(), payload);
    }
    createPayload(settings) {
        let payload = super.createPayload(settings);
        payload.callback = (out, nodeId) => this.onReceiveMessage(out, nodeId);
        return payload;
    }
}
container_1.Container.registerNodeType('protocols/mqtt/mqtt-subscriber', MqttSubscriberNode, mqtt_client_node_1.MQTT_CLIENT_NODE);
container_1.Container.registerNodeType('protocols/mqtt/mqtt-publisher', MqttPublisherNode, mqtt_client_node_1.MQTT_CLIENT_NODE);
//# sourceMappingURL=mqtt-generic-node.js.map