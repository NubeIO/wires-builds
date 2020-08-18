"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = require("mqtt");
const logger = require('logplease').create('mqtt', { color: 6 });
class DefaultMqttClient {
    constructor(options, callbackWhenConnected, callbackWhenOffline, callbackIncomingMessage) {
        this.connected = false;
        this.options = options;
        this.callbackWhenConnected = callbackWhenConnected;
        this.callbackWhenOffline = callbackWhenOffline;
        this.callbackIncomingMessage = callbackIncomingMessage;
    }
    static init(options, callbackWhenConnected, callbackWhenOffline, callbackIncomingMessage) {
        return new DefaultMqttClient(options, callbackWhenConnected, callbackWhenOffline, callbackIncomingMessage).start();
    }
    onClose() {
        logger.debug(`MQTT Client ${this.clientId} closed`);
        this.connected = false;
    }
    onConnect(connack) {
        logger.info(`MQTT Client ${this.clientId} connected ${JSON.stringify(connack)}`);
        this.connected = true;
        if (this.callbackWhenConnected) {
            this.callbackWhenConnected(this);
        }
    }
    onDisconnect() {
        logger.warn(`MQTT Client ${this.clientId} disconnected`);
        this.connected = false;
        if (this.callbackWhenOffline) {
            this.callbackWhenOffline(this, `Unable connect to server`);
        }
    }
    onEnd() {
        logger.info(`MQTT Client ${this.clientId} ended`);
        this.connected = false;
        if (this.callbackWhenOffline) {
            this.callbackWhenOffline(this);
        }
    }
    onError(err) {
        logger.error(`Error connection in MQTT Client ${this.clientId}`, err);
        this.stop();
    }
    onMessage(topic, message, packet) {
        logger.info(`MQTT Client '${this.clientId}' dispatch message on topic '${topic}'`);
        this.callbackIncomingMessage({ topic, message: message.toString() });
    }
    onOffline() {
        logger.warn(`MQTT Client '${this.clientId}' is offline`);
        this.connected = false;
        if (this.callbackWhenOffline) {
            this.callbackWhenOffline(this, `Unable connect to server`);
        }
    }
    onPacketReceive(packet) {
        var _a;
        logger.debug(`MQTT Client '${this.clientId}' receives packet '${(_a = packet) === null || _a === void 0 ? void 0 : _a.cmd}'`);
    }
    onPacketSend(packet) {
        var _a;
        logger.debug(`MQTT Client '${this.clientId}' sends packet '${(_a = packet) === null || _a === void 0 ? void 0 : _a.cmd}'`);
    }
    onReconnect() {
        logger.info(`MQTT Client '${this.clientId}' reconnected`);
        if (this.callbackWhenConnected) {
            this.callbackWhenConnected(this);
        }
    }
    start() {
        var _a, _b;
        this.client = mqtt_1.connect(this.options);
        this.client.on('connect', connack => this.onConnect(connack));
        this.client.on('close', () => this.onClose());
        this.client.on('disconnect', () => this.onDisconnect());
        this.client.on('end', () => this.onEnd());
        this.client.on('error', err => this.onError(err));
        this.client.on('offline', () => this.onOffline());
        this.client.on('packetreceive', packet => this.onPacketReceive(packet));
        this.client.on('packetsend', packet => this.onPacketSend(packet));
        this.client.on('message', (topic, msg, packet) => this.onMessage(topic, msg, packet));
        this.clientId = (_b = (_a = this.client) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.clientId;
        return this;
    }
    stop() {
        if (this.client) {
            this.client.end(true);
        }
    }
    isConnected() {
        return this.client && this.connected;
    }
    publish(topic, payload, options, cb) {
        if (!this.isConnected()) {
            return;
        }
        this.client.publish(topic, payload, (options || { retain: true }), cb);
    }
    subscribe(topic, options, cb) {
        if (!this.isConnected()) {
            return;
        }
        logger.info(`MQTT Client '${this.clientId}' subscribe topic '${topic}'...`);
        this.client.subscribe(topic, (options || {}), cb);
    }
    unsubscribe(topic, cb) {
        if (!this.isConnected()) {
            return;
        }
        logger.info(`MQTT Client '${this.clientId}' unsubscribe topic '${topic}'...`);
        this.client.unsubscribe(topic, cb);
    }
}
exports.DefaultMqttClient = DefaultMqttClient;
//# sourceMappingURL=mqtt-device.js.map