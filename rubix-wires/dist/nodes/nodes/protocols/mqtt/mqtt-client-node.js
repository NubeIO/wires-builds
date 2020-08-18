"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const crypto_utils_1 = require("../../../utils/crypto-utils");
const ProtocolDeviceNode_1 = require("../ProtocolDeviceNode");
const mqtt_device_1 = require("./core/mqtt-device");
const mqtt_client_node_event_1 = require("./mqtt-client-node-event");
const mqtt_client_node_store_1 = require("./mqtt-client-node-store");
class MqttClientNode extends ProtocolDeviceNode_1.ProtocolDeviceNode {
    constructor(container) {
        super(container, `MQTT Network`, 'This node acts as a container for MQTT nodes. ' +
            'All MQTT nodes should be added within the MQTT-Network container. ' +
            'The MQTT broker details can be configured in settings.');
        this.mqttClient = null;
        this.publishers = new mqtt_client_node_store_1.MqttPublisherStore();
        this.subscribers = new mqtt_client_node_store_1.MqttSubscriberStore();
        this.retriedItems = [];
        this.mixinEnableInputSetting();
        this.settings['server'] = { description: 'Broker URL', value: 'localhost', type: node_1.SettingType.STRING };
        this.settings['port'] = { description: 'Broker port', value: 1883, type: node_1.SettingType.NUMBER };
        this.settings['authentication'] = { description: 'Use Authentication', value: false, type: node_1.SettingType.BOOLEAN };
        this.settings['username'] = { description: 'User name', value: '', type: node_1.SettingType.STRING };
        this.settings['password'] = { description: 'Password', value: '', type: node_1.SettingType.PASSWORD };
        this.setSettingsConfig({
            groups: [
                { server: { weight: 3 }, port: { weight: 1 } },
                { enable: {}, authentication: {} },
                { username: {}, password: {} },
            ],
            conditions: {
                username: setting => !!setting['authentication'].value,
                password: setting => !!setting['authentication'].value,
            },
        });
    }
    static createMqttConnectionOptions(settings) {
        const options = { host: settings['server'].value };
        const port = settings['port'].value;
        const username = settings['username'].value;
        const password = settings['password'].value;
        if (port != null)
            options.port = port;
        if (username != null && username != '')
            options.username = username;
        if (password != null && password != '')
            options.password = crypto_utils_1.default.decrypt(password);
        return options;
    }
    subscribe({ action, payload }) {
        this.debugInfo(`Handling ${action}:${payload.identifier}...`);
        switch (action) {
            case mqtt_client_node_event_1.REGISTER_MQTT_POINT:
                return this.registerMqttPoint(payload);
            case mqtt_client_node_event_1.UNREGISTER_MQTT_POINT:
                return this.unregisterMqttPoint(payload);
            case mqtt_client_node_event_1.UPDATE_MQTT_POINT:
                return this.updateMqttPoint(payload);
            case mqtt_client_node_event_1.REGISTER_MQTT_PUBLISHER:
                return this.publishers.register(payload, p => this.publishMqttData(p));
            case mqtt_client_node_event_1.UNREGISTER_MQTT_PUBLISHER:
                return this.publishers.unregister(payload, true);
            case mqtt_client_node_event_1.UPDATE_MQTT_PUBLISHER:
                return this.publishers.update(payload, p => this.publishMqttData(p));
            case mqtt_client_node_event_1.PUBLISH_MQTT_DATA:
                return this.publishMqttData(payload);
            case mqtt_client_node_event_1.REGISTER_MQTT_SUBSCRIBER:
                return this.registerMqttSubscriber(payload);
            case mqtt_client_node_event_1.UPDATE_MQTT_SUBSCRIBER:
                return this.updateMqttSubscriber(payload);
            case mqtt_client_node_event_1.UNREGISTER_MQTT_SUBSCRIBER:
                return this.unregisterMqttSubscriber(payload);
            default:
                this.debugWarn('Request action doesn\'t match');
        }
    }
    dependantsConnectionNode() {
        let nodeIds = [...new Set(this.publishers.listNodeIds().concat(this.subscribers.listNodeIds()))];
        return nodeIds.map(id => registry_1.default._nodes[id]).filter(n => n).map(n => n);
    }
    connectedCondition() {
        var _a;
        return (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.isConnected();
    }
    createThenStart() {
        const options = MqttClientNode.createMqttConnectionOptions(this.settings);
        options.clientId = `mqttjs_wires_cid_${this.container.id}_id${this.id}`;
        this.mqttClient = mqtt_device_1.DefaultMqttClient.init(options, (client) => this.retryConnection(client), (client, msg) => this.updateClientStatus(client, msg), (msg) => this.dispatchMessage(msg));
    }
    stop() {
        if (this.mqttClient) {
            this.mqttClient.stop();
            this.mqttClient = null;
        }
    }
    updateClientStatus(client, errMsg) {
        ProtocolDeviceNode_1.ProtocolDeviceNode.setOutputStatus(this, this.getConnectionStatus(), errMsg);
        this.emit(this.connectionStatus, this.dependantsConnectionNode());
    }
    retryConnection(client) {
        this.debugInfo('Retry connection after MQTT client connected...');
        this.updateClientStatus(client);
        let count = 0, max = 500;
        while (this.retriedItems.length > 0 && count < max) {
            this.subscribe(this.retriedItems.shift());
            count++;
        }
    }
    publishMqttData(payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.side !== container_1.Side.server || !((_a = payload) === null || _a === void 0 ? void 0 : _a.enabled)) {
            return null;
        }
        if (!this.mqttClient || !this.mqttClient.isConnected()) {
            payload.lenient = true;
            this.retriedItems.push({ action: mqtt_client_node_event_1.PUBLISH_MQTT_DATA, payload: payload });
            return null;
        }
        let converter = (_c = this.publishers.lookup((_b = payload) === null || _b === void 0 ? void 0 : _b.identifier)) === null || _c === void 0 ? void 0 : _c.converter;
        this.mqttClient.publish((_d = payload) === null || _d === void 0 ? void 0 : _d.identifier, converter ? converter((_e = payload) === null || _e === void 0 ? void 0 : _e.data) : (_g = (_f = payload) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.toString());
        return (_h = payload) === null || _h === void 0 ? void 0 : _h.data;
    }
    registerMqttSubscriber(payload) {
        if (!this.mqttClient || !this.mqttClient.isConnected()) {
            payload.lenient = true;
            this.retriedItems.push({ action: mqtt_client_node_event_1.REGISTER_MQTT_SUBSCRIBER, payload: payload });
            return;
        }
        this.subscribers.register(payload, p => { var _a; return this.mqttClient.subscribe((_a = p) === null || _a === void 0 ? void 0 : _a.identifier); });
    }
    unregisterMqttSubscriber(payload) {
        if (!this.mqttClient || !this.mqttClient.isConnected()) {
            payload.lenient = true;
            this.retriedItems.push({ action: mqtt_client_node_event_1.UNREGISTER_MQTT_SUBSCRIBER, payload: payload });
            return;
        }
        this.subscribers.unregister(payload, true, p => { var _a; return this.mqttClient.unsubscribe((_a = p) === null || _a === void 0 ? void 0 : _a.identifier); });
    }
    updateMqttSubscriber(payload) {
        if (!this.mqttClient || !this.mqttClient.isConnected()) {
            payload.lenient = true;
            this.retriedItems.push({ action: mqtt_client_node_event_1.UPDATE_MQTT_SUBSCRIBER, payload: payload });
            return;
        }
        this.subscribers.update(payload, p => { var _a; return this.mqttClient.subscribe((_a = p) === null || _a === void 0 ? void 0 : _a.identifier); }, p => { var _a; return this.mqttClient.unsubscribe((_a = p) === null || _a === void 0 ? void 0 : _a.identifier); });
    }
    dispatchMessage(msg) {
        var _a;
        if (this.side !== container_1.Side.server)
            return;
        let subscribersByTopic = (_a = this.subscribers) === null || _a === void 0 ? void 0 : _a.lookup(msg.topic);
        if (!subscribersByTopic) {
            this.debug(`Not found any subscriber on MQTT topic '${msg.topic}'`);
            return;
        }
        Object.entries(subscribersByTopic).forEach(([nodeId, val]) => {
            var _a;
            if (!((_a = val) === null || _a === void 0 ? void 0 : _a.enabled)) {
                return;
            }
            let node = registry_1.default._nodes[nodeId];
            if (!node) {
                return;
            }
            try {
                val.onReceiveMessage(msg.message, nodeId);
            }
            catch (e) {
                this.debugWarn(`Message on MQTT topic '${msg.topic}' cannot be dispatched due to ${e}`);
            }
        });
    }
    registerMqttPoint(payload) {
        let item = payload;
        let d = this.subscribe({ action: mqtt_client_node_event_1.REGISTER_MQTT_PUBLISHER, payload: item.toPublisher() });
        this.subscribe({ action: mqtt_client_node_event_1.REGISTER_MQTT_SUBSCRIBER, payload: item.toSubscriber() });
        return d;
    }
    unregisterMqttPoint(payload) {
        let item = payload;
        let d = this.subscribe({ action: mqtt_client_node_event_1.UNREGISTER_MQTT_PUBLISHER, payload: item.toPublisher() });
        this.subscribe({ action: mqtt_client_node_event_1.UNREGISTER_MQTT_SUBSCRIBER, payload: item.toSubscriber() });
        return d;
    }
    updateMqttPoint(payload) {
        let item = payload;
        let d = this.subscribe({ action: mqtt_client_node_event_1.UPDATE_MQTT_PUBLISHER, payload: item.toPublisher() });
        this.subscribe({ action: mqtt_client_node_event_1.UPDATE_MQTT_SUBSCRIBER, payload: item.toSubscriber() });
        return d;
    }
}
exports.MQTT_CLIENT_NODE = 'protocols/mqtt/mqtt-network';
container_1.Container.registerNodeType(exports.MQTT_CLIENT_NODE, MqttClientNode);
//# sourceMappingURL=mqtt-client-node.js.map