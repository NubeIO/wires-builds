"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_types_1 = require("./mqtt-types");
const crypto_utils_1 = require("../../../utils/crypto-utils");
class MqttUtils {
    static addMqttWriter(parentNode, payload) {
        if (parentNode && parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(mqtt_types_1.ADD_MQTT_WRITER, payload));
        }
    }
    static addMqttReader(parentNode, payload) {
        if (parentNode && parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(mqtt_types_1.ADD_MQTT_READER, payload));
        }
    }
    static removeMqttWriter(parentNode, payload) {
        if (parentNode && parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(mqtt_types_1.REMOVE_MQTT_WRITER, payload));
        }
    }
    static removeMqttReader(parentNode, payload) {
        if (parentNode && parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(mqtt_types_1.REMOVE_MQTT_READER, payload));
        }
    }
    static sendNodeToChild(childNode, node) {
        if (childNode && childNode['subscribe']) {
            return childNode['subscribe'](node);
        }
    }
    static createMessage(action, payload = null) {
        return { action, payload };
    }
    static createMqttConnectionOptions(node) {
        const options = { host: node.settings['server'].value };
        const port = node.settings['port'].value;
        const username = node.settings['username'].value;
        const password = node.settings['password'].value;
        if (port != null)
            options.port = port;
        if (username != null && username != '')
            options.username = username;
        if (password != null && password != '')
            options.password = crypto_utils_1.default.decrypt(password);
        return options;
    }
}
exports.default = MqttUtils;
//# sourceMappingURL=mqtt-utils.js.map