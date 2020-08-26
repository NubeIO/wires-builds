"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const crypto_utils_1 = require("../../../utils/crypto-utils");
const point_node_1 = require("../model/point-node");
const ProtocolDeviceNode_1 = require("../ProtocolDeviceNode");
const mqtt_device_1 = require("./core/mqtt-device");
const mqtt_client_node_store_1 = require("./mqtt-client-node-store");
exports.MQTT_CLIENT_NODE = 'protocols/mqtt/mqtt-network';
exports.REGISTER_MQTT_PUBLISHER = 'REGISTER_MQTT_PUBLISHER';
exports.UNREGISTER_MQTT_PUBLISHER = 'UNREGISTER_MQTT_PUBLISHER';
exports.UPDATE_MQTT_PUBLISHER = 'UPDATE_MQTT_PUBLISHER';
exports.PUBLISH_MQTT_DATA = 'PUBLISH_MQTT_DATA';
exports.REGISTER_MQTT_SUBSCRIBER = 'REGISTER_MQTT_SUBSCRIBER';
exports.UPDATE_MQTT_SUBSCRIBER = 'UPDATE_MQTT_SUBSCRIBER';
exports.UNREGISTER_MQTT_SUBSCRIBER = 'UNREGISTER_MQTT_SUBSCRIBER';
exports.REGISTER_MQTT_POINT = 'REGISTER_MQTT_POINT';
exports.UPDATE_MQTT_POINT = 'UPDATE_MQTT_POINT';
exports.UNREGISTER_MQTT_POINT = 'UNREGISTER_MQTT_POINT';
class MqttCentralizedPointOutputObserver extends point_node_1.CentralizedPointOutputObserver {
    convert(data) {
        let output = {};
        output[data.point.identifier()] = {
            publisherTopic: data.point.publishedTopic(),
            subscriberTopic: data.point.subscribedTopic(),
            pointValue: data.point.pointValue,
            status: data.connStatus.status.label,
            error: data.connStatus.error,
        };
        return output;
    }
}
class MqttClientNode extends ProtocolDeviceNode_1.ProtocolDeviceNode {
    constructor(container) {
        super(container, `MQTT Network`, 'This node acts as a container for MQTT nodes. ' +
            'All MQTT nodes should be added within the MQTT-Network container. ' +
            'The MQTT broker details can be configured in settings.');
        this._oTopicsSlot = 2;
        this.publishers = new mqtt_client_node_store_1.MqttPublisherStore();
        this.subscribers = new mqtt_client_node_store_1.MqttSubscriberStore();
        this.mqttClient = null;
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
        this.addOutput('topics', node_1.Type.JSON);
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
    pointObservers() {
        return [new MqttCentralizedPointOutputObserver(this, this._oTopicsSlot)];
    }
    listen({ action, payload }) {
        this.debugInfo(`Handling ${action}:${payload.identifier}...`);
        switch (action) {
            case exports.REGISTER_MQTT_POINT:
                return this.registerMqttPoint(payload);
            case exports.UPDATE_MQTT_POINT:
                return this.updateMqttPoint(payload);
            case exports.UNREGISTER_MQTT_POINT:
                return this.unregisterMqttPoint(payload);
            case exports.REGISTER_MQTT_PUBLISHER:
                return this.publishers.register(payload);
            case exports.UPDATE_MQTT_PUBLISHER:
                return this.publishers.update(payload, null, (p, force) => this.afterUnregister(p, force));
            case exports.UNREGISTER_MQTT_PUBLISHER:
                return this.publishers.unregister(payload, true, p => this.afterUnregister(p, true));
            case exports.REGISTER_MQTT_SUBSCRIBER:
                return this.registerMqttSubscriber(payload);
            case exports.UPDATE_MQTT_SUBSCRIBER:
                return this.updateMqttSubscriber(payload);
            case exports.UNREGISTER_MQTT_SUBSCRIBER:
                return this.unregisterMqttSubscriber(payload);
            case exports.PUBLISH_MQTT_DATA:
                return this.publishMqttData(payload);
            default:
                this.debugWarn('Request action doesn\'t match');
        }
    }
    connObserverNodes() {
        let nodeIds = [...new Set(this.publishers.listNodeIds().concat(this.subscribers.listNodeIds()))];
        return nodeIds.map(id => registry_1.default._nodes[id])
            .filter(n => n)
            .map(n => n.statusObserver());
    }
    isConnConnected() {
        var _a;
        return (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.isConnected();
    }
    onReceiveMessage(msg) {
        if (this.side !== container_1.Side.server)
            return;
        let subscribersByTopic = this.subscribers.lookup(msg.topic);
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
                this.debugWarn(`MQTT topic '${msg.topic}' is subscribed by Node ${nodeId} that not found`);
                return;
            }
            try {
                this.debugInfo(`Dispatch message on MQTT topic '${msg.topic}' to Node Id '${nodeId}'`);
                val.func(msg.message);
            }
            catch (e) {
                this.debugWarn(`Message on MQTT topic '${msg.topic}' cannot be dispatched due to ${e}`);
            }
        });
    }
    createThenStart() {
        const options = MqttClientNode.createMqttConnectionOptions(this.settings);
        options.clientId = `mqttjs_wires_cid_${this.container.id}_id${this.id}`;
        this.mqttClient = mqtt_device_1.DefaultMqttClient.init(options, (client) => this.retryConnection(client), (client, msg) => this.updateClientStatus(client, msg), (msg) => this.onReceiveMessage(msg));
    }
    stop() {
        if (this.mqttClient) {
            this.mqttClient.stop();
            this.mqttClient = null;
        }
    }
    updateClientStatus(client, errMsg) {
        this.notifyConnStatusOutput(this.getConnectionStatus(), errMsg);
    }
    retryConnection(client) {
        this.debugInfo('Retry connection after MQTT client connected...');
        let count = 0, max = 500;
        while (this.retriedItems.length > 0 && count < max) {
            this.listen(this.retriedItems.shift());
            count++;
        }
        this.updateClientStatus(client);
    }
    publishMqttData(payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.side !== container_1.Side.server || !((_a = payload) === null || _a === void 0 ? void 0 : _a.enabled)) {
            return null;
        }
        if (!this.isConnConnected()) {
            payload.lenient = true;
            this.retriedItems.push({ action: exports.PUBLISH_MQTT_DATA, payload: payload });
            return null;
        }
        let converter = (_c = this.publishers.lookup((_b = payload) === null || _b === void 0 ? void 0 : _b.identifier)) === null || _c === void 0 ? void 0 : _c.func;
        this.mqttClient.publish((_d = payload) === null || _d === void 0 ? void 0 : _d.identifier, converter ? converter((_e = payload) === null || _e === void 0 ? void 0 : _e.data) : (_g = (_f = payload) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.toString());
        return (_h = payload) === null || _h === void 0 ? void 0 : _h.data;
    }
    registerMqttSubscriber(payload) {
        if (!this.isConnConnected()) {
            payload.lenient = true;
            this.retriedItems.push({ action: exports.REGISTER_MQTT_SUBSCRIBER, payload: payload });
            return;
        }
        this.subscribers.register(payload, p => { var _a; return this.mqttClient.subscribe((_a = p) === null || _a === void 0 ? void 0 : _a.identifier); });
    }
    unregisterMqttSubscriber(payload) {
        if (!this.isConnConnected()) {
            payload.lenient = true;
            this.retriedItems.push({ action: exports.UNREGISTER_MQTT_SUBSCRIBER, payload: payload });
            return;
        }
        this.subscribers.unregister(payload, true, p => {
            this.mqttClientDoUnsubscribe(p);
            this.afterUnregister(p, true);
        });
    }
    updateMqttSubscriber(payload) {
        if (!this.isConnConnected()) {
            payload.lenient = true;
            this.retriedItems.push({ action: exports.UPDATE_MQTT_SUBSCRIBER, payload: payload });
            return;
        }
        this.subscribers.update(payload, p => { var _a; return this.mqttClient.subscribe((_a = p) === null || _a === void 0 ? void 0 : _a.identifier); }, (p, force) => {
            this.mqttClientDoUnsubscribe(p);
            this.afterUnregister(p, force);
        });
    }
    mqttClientDoUnsubscribe(payload) {
        var _a;
        if (!this.subscribers.has(payload.identifier, (k, v) => { var _a; return (_a = v) === null || _a === void 0 ? void 0 : _a.enabled; })) {
            this.mqttClient.unsubscribe((_a = payload) === null || _a === void 0 ? void 0 : _a.identifier);
        }
    }
    registerMqttPoint(payload) {
        let item = payload;
        let d = this.listen({ action: exports.REGISTER_MQTT_PUBLISHER, payload: item.toPublisher() });
        this.listen({ action: exports.REGISTER_MQTT_SUBSCRIBER, payload: item.toSubscriber() });
        return d;
    }
    unregisterMqttPoint(payload) {
        let item = payload;
        let d = this.listen({ action: exports.UNREGISTER_MQTT_PUBLISHER, payload: item.toPublisher() });
        this.listen({ action: exports.UNREGISTER_MQTT_SUBSCRIBER, payload: item.toSubscriber() });
        this.afterUnregister(payload, true);
        return d;
    }
    updateMqttPoint(payload) {
        let item = payload;
        try {
            return this.listen({ action: exports.UPDATE_MQTT_PUBLISHER, payload: item.toPublisher() });
        }
        finally {
            this.listen({ action: exports.UPDATE_MQTT_SUBSCRIBER, payload: item.toSubscriber() });
        }
    }
    afterUnregister(payload, force) {
        if (force) {
            let output = this.outputs[this._oTopicsSlot].data;
            if (output) {
                delete output[payload.identifier];
            }
            this.setOutputData(this._oTopicsSlot, output);
        }
    }
}
container_1.Container.registerNodeType(exports.MQTT_CLIENT_NODE, MqttClientNode);
//# sourceMappingURL=mqtt-client-node.js.map