"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bacnet_constant_1 = require("./bacnet-constant");
const promise_actor_1 = require("../../../../promise-actor");
const Logger = require('logplease');
const logger = Logger.create('bacnet-utils', { color: Logger.Colors.Grey });
exports.singleton = new promise_actor_1.PromiseActor();
class BacnetUtils {
    static getBacnetClient(networkNode) {
        if (networkNode && networkNode['subscribe']) {
            return networkNode['subscribe'](this.createMessage(bacnet_constant_1.GET_BACNET_CLIENT));
        }
        else {
            logger.error('Network Node is not available on getBacnetClient');
            return null;
        }
    }
    static getPoints(deviceNode) {
        if (deviceNode && deviceNode['subscribe']) {
            return deviceNode['subscribe'](this.createMessage(bacnet_constant_1.GET_POINTS));
        }
        else {
            logger.error('Device Node is not available on getPoints');
            return [];
        }
    }
    static getPresentValue(deviceNode, payload) {
        if (deviceNode && deviceNode['subscribe']) {
            return deviceNode['subscribe'](this.createMessage(bacnet_constant_1.GET_PRESENT_VALUE, payload));
        }
        else {
            logger.error('Device Node is not available on getPresentValue');
            return null;
        }
    }
    static writePresentValue(deviceNode, payload) {
        if (deviceNode && deviceNode['subscribe']) {
            deviceNode['subscribe'](this.createMessage(bacnet_constant_1.WRITE_PRESENT_VALUE, payload));
        }
        else {
            logger.error('Device Node is not available on writePresentValue');
        }
    }
    static getNetworkSettings(parentNode) {
        if (parentNode && parentNode['subscribe']) {
            return parentNode['subscribe'](this.createMessage(bacnet_constant_1.GET_NETWORK_SETTINGS));
        }
        else {
            logger.error('Parent Node is not available on getNetworkSettings');
            return null;
        }
    }
    static sendPayloadToChild(childNode, payload) {
        if (childNode && childNode['subscribe']) {
            childNode['subscribe'](this.createMessage(bacnet_constant_1.SEND_PAYLOAD_TO_CHILD, payload));
        }
        else {
            logger.error('Child Node is not available on sendPayloadToChild');
        }
    }
    static sendPointValue(pointNode, payload) {
        if (pointNode && pointNode['subscribe']) {
            pointNode['subscribe'](this.createMessage(bacnet_constant_1.SEND_POINT_VALUE, payload));
        }
        else {
            logger.error('Point Node is not available on sendPointValue');
        }
    }
    static addDevice(networkNode, payload) {
        if (networkNode && networkNode['subscribe']) {
            networkNode['subscribe'](this.createMessage(bacnet_constant_1.ADD_DEVICE, payload));
        }
        else {
            logger.error('Network Node is not available on addDevice');
        }
    }
    static removeDevice(networkNode, payload) {
        if (networkNode && networkNode['subscribe']) {
            networkNode['subscribe'](this.createMessage(bacnet_constant_1.REMOVE_DEVICE, payload));
        }
        else {
            logger.error('Network Node is not available on removeDevice');
        }
    }
    static addPoint(deviceNode, payload) {
        if (deviceNode && deviceNode['subscribe']) {
            deviceNode['subscribe'](this.createMessage(bacnet_constant_1.ADD_POINT, payload));
        }
        else {
            logger.error('Device Node is not available on addPoint');
        }
    }
    static removePoint(deviceNode, payload) {
        if (deviceNode && deviceNode['subscribe']) {
            deviceNode['subscribe'](this.createMessage(bacnet_constant_1.REMOVE_POINT, payload));
        }
        else {
            logger.error('Device Node is not available on removePoint');
        }
    }
    static createMessage(action, payload = null) {
        return { action, payload };
    }
}
exports.default = BacnetUtils;
//# sourceMappingURL=bacnet-utils.js.map