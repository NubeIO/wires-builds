"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_BACNET_CLIENT = 'GET_BACNET_CLIENT';
exports.GET_NETWORK_SETTINGS = 'GET_NETWORK_SETTINGS';
exports.GET_POINTS = 'GET_BACNET_SERVER_POINTS';
exports.GET_PRESENT_VALUE = 'GET_BACNET_SERVER_PRESENT_VALUE';
exports.SEND_PAYLOAD_TO_CHILD = 'SEND_PAYLOAD_TO_CHILD';
exports.SEND_POINT_VALUE = 'SEND_POINT_VALUE';
exports.ADD_POINT = 'ADD_POINT_BACNET_SERVER';
exports.UPDATE_POINT = 'UPDATE_POINT_BACNET_SERVER';
exports.UPDATE_POINT_VALUE = 'UPDATE_POINT_VALUE_BACNET_SERVER';
exports.REMOVE_POINT = 'REMOVE_POINT_POINT_BACNET_SERVER';
exports.ADD_DEVICE = 'ADD_DEVICE';
exports.REMOVE_DEVICE = 'REMOVE_DEVICE';
exports.BACNET_UP = 'BACNET_UP';
class BacnetSubscriberHelper {
    static getBacnetClient(networkNode) {
        if (networkNode['subscribe']) {
            return networkNode['subscribe'](this.createMessage(exports.GET_BACNET_CLIENT));
        }
        return null;
    }
    static getPoints(deviceNode) {
        if (deviceNode['subscribe']) {
            return deviceNode['subscribe'](this.createMessage(exports.GET_POINTS));
        }
        return [];
    }
    static getPresentValue(deviceNode, payload) {
        if (deviceNode['subscribe']) {
            return deviceNode['subscribe'](this.createMessage(exports.GET_PRESENT_VALUE, payload));
        }
        return null;
    }
    static getNetworkSettings(parentNode) {
        if (parentNode['subscribe']) {
            return parentNode['subscribe'](this.createMessage(exports.GET_NETWORK_SETTINGS));
        }
        return null;
    }
    static sendPayloadToChild(childNode, payload) {
        if (childNode['subscribe']) {
            return childNode['subscribe'](this.createMessage(exports.SEND_PAYLOAD_TO_CHILD, payload));
        }
    }
    static sendPointValue(pointNode, payload) {
        if (pointNode['subscribe']) {
            return pointNode['subscribe'](this.createMessage(exports.SEND_POINT_VALUE, payload));
        }
    }
    static addDevice(parentNode, payload) {
        if (parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(exports.ADD_DEVICE, payload));
        }
    }
    static removeDevice(parentNode, payload) {
        if (parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(exports.REMOVE_DEVICE, payload));
        }
    }
    static addPoint(parentNode, payload) {
        if (parentNode['subscribe']) {
            return parentNode['subscribe'](this.createMessage(exports.ADD_POINT, payload));
        }
        return null;
    }
    static updatePoint(parentNode, payload) {
        if (parentNode['subscribe']) {
            return parentNode['subscribe'](this.createMessage(exports.UPDATE_POINT, payload));
        }
        return null;
    }
    static updatePointValue(parentNode, payload) {
        if (parentNode['subscribe']) {
            return parentNode['subscribe'](this.createMessage(exports.UPDATE_POINT_VALUE, payload));
        }
        return null;
    }
    static removePoint(parentNode, payload) {
        if (parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(exports.REMOVE_POINT, payload));
        }
    }
    static createMessage(action, payload = null) {
        return { action, payload };
    }
}
exports.default = BacnetSubscriberHelper;
//# sourceMappingURL=bacnet-subscriber-helper.js.map