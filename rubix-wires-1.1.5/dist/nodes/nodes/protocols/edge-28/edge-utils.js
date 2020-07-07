"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const edge_constant_1 = require("./edge-constant");
class Edge28Utils {
    static getEdgeClient(networkNode) {
        if (networkNode['subscribe']) {
            return networkNode['subscribe'](this.createMessage(edge_constant_1.GET_EDGE_CLIENT));
        }
        return null;
    }
    static getPresentValue(deviceNode, payload) {
        if (deviceNode['subscribe']) {
            return deviceNode['subscribe'](this.createMessage(edge_constant_1.GET_PRESENT_VALUE, payload));
        }
        return null;
    }
    static sendPayloadToChild(childNode, payload) {
        if (childNode['subscribe']) {
            return childNode['subscribe'](this.createMessage(edge_constant_1.SEND_PAYLOAD_TO_CHILD, payload));
        }
    }
    static sendPointValue(pointNode, payload) {
        if (pointNode['subscribe']) {
            return pointNode['subscribe'](this.createMessage(edge_constant_1.SEND_POINT_VALUE, payload));
        }
    }
    static addPoint(parentNode, payload) {
        if (parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(edge_constant_1.ADD_POINT, payload));
        }
    }
    static removePoint(parentNode, payload) {
        if (parentNode === undefined)
            return;
        if (parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(edge_constant_1.REMOVE_POINT, payload));
        }
    }
    static createMessage(action, payload = null) {
        return { action, payload };
    }
}
exports.default = Edge28Utils;
//# sourceMappingURL=edge-utils.js.map