"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
class MqttClientNodeEvent {
    static registerPoint(parentNode, payload) {
        return this.execute(parentNode, payload, exports.REGISTER_MQTT_POINT);
    }
    static unregisterPoint(parentNode, payload) {
        return this.execute(parentNode, payload, exports.UNREGISTER_MQTT_POINT);
    }
    static updatePoint(parentNode, payload) {
        return this.execute(parentNode, payload, exports.UPDATE_MQTT_POINT);
    }
    static registerPublisher(parentNode, payload) {
        return this.execute(parentNode, payload, exports.REGISTER_MQTT_PUBLISHER);
    }
    static updatePublisher(parentNode, payload) {
        return this.execute(parentNode, payload, exports.UPDATE_MQTT_PUBLISHER);
    }
    static publishData(parentNode, payload) {
        return this.execute(parentNode, payload, exports.PUBLISH_MQTT_DATA);
    }
    static unregisterPublisher(parentNode, payload) {
        return this.execute(parentNode, payload, exports.UNREGISTER_MQTT_PUBLISHER);
    }
    static registerSubscriber(parentNode, payload) {
        return this.execute(parentNode, payload, exports.REGISTER_MQTT_SUBSCRIBER);
    }
    static updateSubscriber(parentNode, payload) {
        return this.execute(parentNode, payload, exports.UPDATE_MQTT_SUBSCRIBER);
    }
    static unregisterSubscriber(parentNode, payload) {
        return this.execute(parentNode, payload, exports.UNREGISTER_MQTT_SUBSCRIBER);
    }
    static execute(parentNode, payload, action) {
        if (parentNode && parentNode['subscribe']) {
            return parentNode['subscribe']({ action, payload });
        }
        return null;
    }
}
exports.default = MqttClientNodeEvent;
//# sourceMappingURL=mqtt-client-node-event.js.map