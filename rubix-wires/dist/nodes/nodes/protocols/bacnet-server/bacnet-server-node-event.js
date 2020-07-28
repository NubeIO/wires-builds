"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGISTER_BACNET_POINT = 'REGISTER_BACNET_POINT';
exports.UPDATE_BACNET_POINT = 'UPDATE_BACNET_POINT';
exports.PUSH_BACNET_POINT_VALUE = 'PUSH_BACNET_POINT_VALUE';
exports.UNREGISTER_BACNET_POINT = 'UNREGISTER_BACNET_POINT';
class BacnetServerNodeEvent {
    static registerPoint(parentNode, payload) {
        if (parentNode['subscribe']) {
            return parentNode['subscribe'](this.createMessage(exports.REGISTER_BACNET_POINT, payload));
        }
        return null;
    }
    static updatePoint(parentNode, payload) {
        if (parentNode['subscribe']) {
            return parentNode['subscribe'](this.createMessage(exports.UPDATE_BACNET_POINT, payload));
        }
        return null;
    }
    static pushPointValue(parentNode, payload) {
        if (parentNode['subscribe']) {
            return parentNode['subscribe'](this.createMessage(exports.PUSH_BACNET_POINT_VALUE, payload));
        }
        return null;
    }
    static unregisterPoint(parentNode, payload) {
        if (parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(exports.UNREGISTER_BACNET_POINT, payload));
        }
    }
    static createMessage(action, payload = null) {
        return { action, payload };
    }
}
exports.default = BacnetServerNodeEvent;
//# sourceMappingURL=bacnet-server-node-event.js.map