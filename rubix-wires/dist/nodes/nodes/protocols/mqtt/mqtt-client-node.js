"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../../container");
const container_node_1 = require("../../../container-node");
const node_1 = require("../../../node");
const node_mixin_1 = require("../../node-mixin");
const mqtt_lifecycle_1 = require("./mqtt-lifecycle");
const mqtt_subscriber_helper_1 = require("./mqtt-subscriber-helper");
const mqtt_utils_1 = require("./mqtt-utils");
class MqttClientNode extends node_mixin_1.AbleEnableNode(container_node_1.ContainerNode) {
    constructor(container) {
        super(container);
        this.mqttClient = null;
        this.publisher = {};
        this.subscriber = {};
        this.description = 'This node acts as a container for MQTT nodes. ' +
            'All MQTT nodes should be added within the MQTT-Network container. ' +
            'The MQTT broker details can be configured in settings.';
        this.mixinEnableInputSetting();
        this.settings['server'] = {
            description: 'Broker URL',
            value: 'localhost',
            type: node_1.SettingType.STRING,
        };
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
    onCreated() {
        super.onCreated();
        this.name = `MQTT Client cid_${this.container.id}_id${this.id}`;
    }
    onAdded() {
        this.startOrStop();
        this.applyTitle();
    }
    onAfterSettingsChange() {
        this.startOrStop();
        this.applyTitle();
    }
    onRemoved() {
        this.stop();
        super.onRemoved();
    }
    subscribe({ action, payload }) {
        this.debug(`${action}: ${payload}`);
        switch (action) {
            case mqtt_subscriber_helper_1.REGISTER_MQTT_PUBLISHER:
                return this.registerPublisher(payload);
            case mqtt_subscriber_helper_1.UNREGISTER_MQTT_PUBLISHER:
                return this.unregisterPublisher(payload);
            case mqtt_subscriber_helper_1.UPDATE_MQTT_PUBLISHER:
                return this.updatePublisher(payload);
            case mqtt_subscriber_helper_1.PUBLISH_MQTT_DATA:
                return this.publishData(payload);
            case mqtt_subscriber_helper_1.REGISTER_MQTT_SUBSCRIBER:
                return this.registerSubscriber(payload);
            case mqtt_subscriber_helper_1.UPDATE_MQTT_SUBSCRIBER:
                return this.updateSubscriber(payload);
            case mqtt_subscriber_helper_1.UNREGISTER_MQTT_SUBSCRIBER:
                return this.unregisterMqttSubscriber(payload);
            default:
                this.debugWarn('Request action doesn\'t match');
        }
    }
    enableDescription() {
        return 'Enable MQTT client';
    }
    startOrStop() {
        if (this.side !== container_1.Side.server)
            return;
        if (this.mqttClient)
            this.stop();
        this.isEnabled() ? this.createThenStart() : this.stop();
    }
    createThenStart() {
        const options = mqtt_utils_1.default.createMqttConnectionOptions(this);
        options.clientId = `mqttjs_wires_cid_${this.container.id}_id${this.id}`;
        this.mqttClient = mqtt_lifecycle_1.MqttClientHandler.start(options, this.dispatchMessage);
    }
    stop() {
        if (this.mqttClient) {
            this.mqttClient.stop();
            this.mqttClient = null;
        }
    }
    registerPublisher(payload) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.checkExistence((_a = payload) === null || _a === void 0 ? void 0 : _a.mqttp);
        this.publisher[(_c = (_b = payload) === null || _b === void 0 ? void 0 : _b.mqttp) === null || _c === void 0 ? void 0 : _c.identifier()] = {
            nodeId: (_d = payload) === null || _d === void 0 ? void 0 : _d.nodeId,
            enable: (_e = payload) === null || _e === void 0 ? void 0 : _e.enable,
            func: (_f = payload) === null || _f === void 0 ? void 0 : _f.func,
        };
        if ((_g = payload) === null || _g === void 0 ? void 0 : _g.enable) {
            return this.publishData(payload);
        }
        return null;
    }
    updatePublisher(payload) {
        var _a, _b, _c, _d, _e;
        if (!((_a = payload) === null || _a === void 0 ? void 0 : _a.mqttp.equals((_b = payload) === null || _b === void 0 ? void 0 : _b.prev))) {
            try {
                this.checkExistence((_c = payload) === null || _c === void 0 ? void 0 : _c.prev);
            }
            catch (e) {
                this.debug(e);
                this.unregisterPublisher({ mqttp: (_d = payload) === null || _d === void 0 ? void 0 : _d.prev });
            }
            return this.registerPublisher(payload);
        }
        if ((_e = payload) === null || _e === void 0 ? void 0 : _e.enable) {
            return this.publishData(payload);
        }
        this.unregisterPublisher(payload, false);
        return null;
    }
    unregisterPublisher(payload, force = true) {
        var _a, _b, _c, _d;
        if (force) {
            delete this.publisher[(_b = (_a = payload) === null || _a === void 0 ? void 0 : _a.mqttp) === null || _b === void 0 ? void 0 : _b.identifier()];
        }
        else {
            this.publisher[(_d = (_c = payload) === null || _c === void 0 ? void 0 : _c.mqttp) === null || _d === void 0 ? void 0 : _d.identifier()]['enable'] = false;
        }
    }
    publishData(payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        let topic = (_b = (_a = payload) === null || _a === void 0 ? void 0 : _a.mqttp) === null || _b === void 0 ? void 0 : _b.identifier();
        let msg = { value: (_e = (_d = (_c = payload) === null || _c === void 0 ? void 0 : _c.mqttp) === null || _d === void 0 ? void 0 : _d.pointValue) === null || _e === void 0 ? void 0 : _e.presentValue, priority: (_h = (_g = (_f = payload) === null || _f === void 0 ? void 0 : _f.mqttp) === null || _g === void 0 ? void 0 : _g.pointValue) === null || _h === void 0 ? void 0 : _h.priority };
        this.debug(JSON.stringify(msg));
        this.mqttClient.client.publish(`${topic}/res`, JSON.stringify(msg), { retain: true });
        return (_k = (_j = payload) === null || _j === void 0 ? void 0 : _j.mqttp) === null || _k === void 0 ? void 0 : _k.pointValue;
    }
    registerSubscriber(payload) {
    }
    updateSubscriber(payload) {
    }
    unregisterMqttSubscriber(payload) {
    }
    dispatchMessage(msg) {
        console.log(msg);
    }
    checkExistence(mqttp) {
        var _a, _b;
        if (this.publisher[(_a = mqttp) === null || _a === void 0 ? void 0 : _a.identifier()]) {
            throw new Error(`Already exist MQTT point bind to topic ${(_b = mqttp) === null || _b === void 0 ? void 0 : _b.mqttTopic}`);
        }
    }
}
exports.MQTT_CLIENT_NODE = 'protocols/mqtt/mqtt-client';
container_1.Container.registerNodeType(exports.MQTT_CLIENT_NODE, MqttClientNode);
//# sourceMappingURL=mqtt-client-node.js.map