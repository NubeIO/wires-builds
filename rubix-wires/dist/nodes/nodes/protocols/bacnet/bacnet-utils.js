"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bacnet_constant_1 = require("./bacnet-constant");
const promise_actor_1 = require("../../../../promise-actor");
exports.singleton = new promise_actor_1.PromiseActor();
class BacnetUtils {
    static getBacnetClient(networkNode) {
        if (networkNode['subscribe']) {
            return networkNode['subscribe'](this.createMessage(bacnet_constant_1.GET_BACNET_CLIENT));
        }
        return null;
    }
    static getPoints(deviceNode) {
        if (deviceNode['subscribe']) {
            return deviceNode['subscribe'](this.createMessage(bacnet_constant_1.GET_POINTS));
        }
        return [];
    }
    static getPresentValue(deviceNode, payload) {
        if (deviceNode['subscribe']) {
            return deviceNode['subscribe'](this.createMessage(bacnet_constant_1.GET_PRESENT_VALUE, payload));
        }
        return null;
    }
    static writePresentValue(parentNode, payload) {
        if (parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(bacnet_constant_1.WRITE_PRESENT_VALUE, payload));
        }
    }
    static getNetworkSettings(parentNode) {
        if (parentNode['subscribe']) {
            return parentNode['subscribe'](this.createMessage(bacnet_constant_1.GET_NETWORK_SETTINGS));
        }
        return null;
    }
    static sendPayloadToChild(childNode, payload) {
        if (childNode['subscribe']) {
            return childNode['subscribe'](this.createMessage(bacnet_constant_1.SEND_PAYLOAD_TO_CHILD, payload));
        }
    }
    static sendPointValue(pointNode, payload) {
        if (pointNode['subscribe']) {
            return pointNode['subscribe'](this.createMessage(bacnet_constant_1.SEND_POINT_VALUE, payload));
        }
    }
    static addDevice(parentNode, payload) {
        if (parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(bacnet_constant_1.ADD_DEVICE, payload));
        }
    }
    static removeDevice(parentNode, payload) {
        if (parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(bacnet_constant_1.REMOVE_DEVICE, payload));
        }
    }
    static addPoint(parentNode, payload) {
        if (parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(bacnet_constant_1.ADD_POINT, payload));
        }
    }
    static removePoint(parentNode, payload) {
        if (parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(bacnet_constant_1.REMOVE_POINT, payload));
        }
    }
    static createMessage(action, payload = null) {
        return { action, payload };
    }
}
exports.default = BacnetUtils;
//# sourceMappingURL=bacnet-utils.js.map