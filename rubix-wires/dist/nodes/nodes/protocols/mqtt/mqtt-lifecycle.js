"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = require("mqtt");
const logger = require('logplease').create('mqtt', { color: 6 });
class MqttClientHandler {
    constructor(options, dispatcher) {
        this.options = options;
        this.dispatcher = dispatcher;
    }
    static start(options, dispatchMessage) {
        console.log(options);
        return new MqttClientHandler(options, dispatchMessage).init();
    }
    onClose() {
        logger.debug(`MQTT Client ${this.clientId} closed`);
    }
    onConnect(connack) {
        logger.debug(`MQTT Client ${this.clientId} connected ${connack}`);
    }
    onDisconnect() {
        logger.warn(`MQTT Client ${this.clientId} disconnected`);
    }
    onEnd() {
        logger.debug(`MQTT Client ${this.clientId} ended`);
    }
    onError(err) {
        logger.error(`Error connection in MQTT Client ${this.clientId}`, err);
        this.stop();
    }
    onMessage(topic, message, packet) {
        logger.debug(`MQTT Client ${this.clientId} dispatch message`);
        this.dispatcher({ topic, message: message.toString() });
    }
    onOffline() {
        logger.warn(`MQTT Client ${this.clientId} is offline`);
    }
    onPacketReceive(packet) {
        logger.debug(`MQTT Client ${this.clientId} receives packet ${JSON.stringify(packet)}`);
    }
    onPacketSend(packet) {
        logger.debug(`MQTT Client ${this.clientId} sends packet ${JSON.stringify(packet)}`);
    }
    onReconnect() {
        logger.debug(`MQTT Client ${this.clientId} reconnected`);
    }
    stop() {
        if (this.client) {
            this.client.end(true);
        }
    }
    init() {
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
}
exports.MqttClientHandler = MqttClientHandler;
//# sourceMappingURL=mqtt-lifecycle.js.map