"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../../../utils/helper");
const pattern_1 = require("../../../../utils/pattern");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const node_mixin_1 = require("../../node-mixin");
const connection_node_mixin_1 = require("../connection-node-mixin");
const mqtt_client_node_1 = require("./mqtt-client-node");
function MqttGenericNodeMixin(Base) {
    class MqttGenericNodeMixinBase extends node_mixin_1.AbleEnableNode(Base) {
        constructor() {
            super(...arguments);
            this._iTopic = 'topic';
        }
        onAdded() {
            if (this.side !== container_1.Side.server) {
                return;
            }
            this.handleOnUpdate(this.createPayload());
            this.updateTitle();
        }
        onAfterSettingsChange(oldSettings, oldName) {
            if (this.side !== container_1.Side.server) {
                return;
            }
            this.handleOnUpdate(this.createPayload(), this.createPayload(oldSettings));
            this.updateTitle();
        }
        onInputUpdated() {
            if (this.side !== container_1.Side.server) {
                return;
            }
            let prev = this.createPayload();
            this.reEvaluateSettingByInput(this.inputs, this.settings);
            this.handleOnUpdate(this.createPayload(), prev);
            this.updateTitle();
        }
        onRemoved() {
            if (this.listener() === pattern_1.MockCentralizedListener.LISTENER) {
                return;
            }
            this.listener().listen({ action: this.unregisterAction(), payload: this.createPayload() });
        }
        reEvaluateSettingByInput(inputs, settings) {
            settings[this._iTopic].value = inputs[this.topicInputIdx()].updated ? inputs[this.topicInputIdx()].data
                : settings[this._iTopic].value;
            if (helper_1.isFunction(super['reEvaluateSettingByInput'])) {
                super['reEvaluateSettingByInput'](inputs, settings);
            }
        }
        listener() {
            var _a;
            return _a = this.getParentNode(), (_a !== null && _a !== void 0 ? _a : pattern_1.MockCentralizedListener.LISTENER);
        }
        mixinMqttTopicInputSetting() {
            this.addInputWithSettings(this._iTopic, node_1.Type.STRING, '', 'MQTT Topic');
        }
        handleOnUpdate(current, prev) {
            var _a, _b;
            if (!((_a = prev) === null || _a === void 0 ? void 0 : _a.identifier) && !((_b = current) === null || _b === void 0 ? void 0 : _b.identifier)) {
                return;
            }
            if (helper_1.isEmpty(current.identifier)) {
                throw new Error('Must define MQTT topic');
            }
            if (this.shouldRegister(prev)) {
                this.listener().listen({ action: this.registerAction(), payload: current });
            }
            else if (current.identifier !== prev.identifier || current.enabled !== prev.enabled) {
                current.prev = prev;
                this.listener().listen({ action: this.updateAction(), payload: current });
            }
            this.doAfterUpdate(current, prev);
        }
        createPayload(settings) {
            var _a, _b;
            let identifier = (_a = ((settings !== null && settings !== void 0 ? settings : this.settings))['topic']) === null || _a === void 0 ? void 0 : _a.value;
            let enabled = settings ? (_b = settings[this.enableSettingKey()]) === null || _b === void 0 ? void 0 : _b.value : this.isEnabled();
            return {
                identifier: identifier,
                nodeId: registry_1.default.getId(this.cid, this.id),
                enabled: enabled,
            };
        }
        shouldRegister(prev) {
            return !prev || !prev.identifier;
        }
    }
    return MqttGenericNodeMixinBase;
}
class MqttGenericNode extends connection_node_mixin_1.DependantConnectionNodeMixin(MqttGenericNodeMixin(node_1.Node)) {
    constructor(title, description) {
        super();
        this._title = this.title = title;
        this.description = description;
        this.mixinEnableInputSetting();
        this.mixinConnectionStatusOutput();
        this.mixinMqttTopicInputSetting();
    }
    statusOutputIdx() {
        return 0;
    }
    enableDescription() {
        return `Enable ${this._title}`;
    }
    updateTitle() {
        this.title = `${this._title} (${this.settings['topic'].value})`;
    }
    topicInputIdx() {
        return 1;
    }
    shouldRegister(prev) {
        return super.shouldRegister(prev) || this.getConnectionStatus().isError();
    }
    handleError(err, func) {
        super.handleError(err, func);
    }
}
class MqttPublisherNode extends MqttGenericNode {
    constructor() {
        super('MQTT Publisher', `MQTT Publisher Node is used to publish MQTT message for generic purpose`);
        this.addInputWithSettings('is-json', node_1.Type.BOOLEAN, false, 'MQTT Message is JSON type');
        this.addInputWithSettings('message', node_1.Type.ANY, '', 'MQTT Message');
    }
    onConvertMessage(data) {
        var _a;
        return helper_1.isJSON(data) ? JSON.stringify(data) : (_a = data) === null || _a === void 0 ? void 0 : _a.toString();
    }
    reEvaluateSettingByInput(inputs, settings) {
        super.reEvaluateSettingByInput(inputs, settings);
        this.settings['is-json'].value = this.inputs[2].updated ? this.inputs[2].data : this.settings['is-json'].value;
        this.settings['message'].value = this.inputs[3].updated ? this.inputs[3].data : this.settings['message'].value;
    }
    registerAction() {
        return mqtt_client_node_1.REGISTER_MQTT_PUBLISHER;
    }
    updateAction() {
        return mqtt_client_node_1.UPDATE_MQTT_PUBLISHER;
    }
    unregisterAction() {
        return mqtt_client_node_1.UNREGISTER_MQTT_PUBLISHER;
    }
    createPayload(settings) {
        let payload = super.createPayload(settings);
        payload.callback = data => this.onConvertMessage(data);
        payload.data = this.settings['message'].value;
        return payload;
    }
    doAfterUpdate(current, prev) {
        var _a, _b, _c, _d;
        if (helper_1.isEmpty((_a = current) === null || _a === void 0 ? void 0 : _a.data) && (((_b = prev) === null || _b === void 0 ? void 0 : _b.identifier) && current.identifier !== prev.identifier || helper_1.isEmpty((_c = prev) === null || _c === void 0 ? void 0 : _c.data))) {
            return current;
        }
        if ((_d = current) === null || _d === void 0 ? void 0 : _d.enabled) {
            if (this.settings['is-json'].value && !helper_1.isJSON(current.data)) {
                try {
                    current.data = helper_1.isEmpty(current.data) ? {} : JSON.parse(current.data);
                }
                catch (err) {
                    this.debug(err);
                    throw new Error(`Payload is invalid JSON in MQTT publisher on topic ${current.identifier}`);
                }
            }
            return this.listener().listen({ action: mqtt_client_node_1.PUBLISH_MQTT_DATA, payload: current });
        }
    }
}
class MqttSubscriberNode extends MqttGenericNode {
    constructor() {
        super('MQTT Subscriber', `MQTT Subscriber Node is used for generic purpose`);
        this.addOutput('out', node_1.Type.ANY);
    }
    onReceiveMessage(incomingMessage) {
        this.setOutputData(this.errorOutputIdx() + 1, incomingMessage);
    }
    registerAction() {
        return mqtt_client_node_1.REGISTER_MQTT_SUBSCRIBER;
    }
    updateAction() {
        return mqtt_client_node_1.UPDATE_MQTT_SUBSCRIBER;
    }
    unregisterAction() {
        return mqtt_client_node_1.UNREGISTER_MQTT_SUBSCRIBER;
    }
    createPayload(settings) {
        let payload = super.createPayload(settings);
        payload.callback = (out) => this.onReceiveMessage(out);
        return payload;
    }
    doAfterUpdate(current, prev) {
    }
}
container_1.Container.registerNodeType('protocols/mqtt/mqtt-subscriber', MqttSubscriberNode, mqtt_client_node_1.MQTT_CLIENT_NODE);
container_1.Container.registerNodeType('protocols/mqtt/mqtt-publisher', MqttPublisherNode, mqtt_client_node_1.MQTT_CLIENT_NODE);
//# sourceMappingURL=mqtt-generic-node.js.map