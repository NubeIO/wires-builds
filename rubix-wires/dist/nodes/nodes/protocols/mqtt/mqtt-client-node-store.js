"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_node_store_1 = require("../model/container-node-store");
class MqttPublisherStore extends container_node_store_1.AbstractContainerStore {
    constructor() {
        super(...arguments);
        this.publishers = {};
    }
    checkExistence(payload) {
        var _a, _b, _c;
        if (this.publishers[(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier]) {
            if ((_b = payload) === null || _b === void 0 ? void 0 : _b.lenient) {
                return;
            }
            throw new Error(`Already exist MQTT publisher bind to topic ${(_c = payload) === null || _c === void 0 ? void 0 : _c.identifier}`);
        }
    }
    unregister(payload, force, cb) {
        var _a, _b;
        if (force) {
            delete this.publishers[(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier];
        }
        else {
            this.add(payload);
            this.publishers[(_b = payload) === null || _b === void 0 ? void 0 : _b.identifier].enabled = false;
        }
        return cb && cb(payload);
    }
    lookup(identifier) {
        var _a;
        return _a = this.publishers[identifier], (_a !== null && _a !== void 0 ? _a : null);
    }
    add(payload) {
        var _a, _b, _c, _d;
        this.publishers[(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier] = {
            nodeId: (_b = payload) === null || _b === void 0 ? void 0 : _b.nodeId,
            enabled: (_c = payload) === null || _c === void 0 ? void 0 : _c.enabled,
            converter: (_d = payload) === null || _d === void 0 ? void 0 : _d.callback,
        };
    }
}
exports.MqttPublisherStore = MqttPublisherStore;
class MqttSubscriberStore extends container_node_store_1.AbstractContainerStore {
    constructor() {
        super(...arguments);
        this.subscribers = {};
    }
    checkExistence(payload) {
        var _a, _b, _c, _d, _e;
        if (this.subscribers[(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier] && this.subscribers[(_b = payload) === null || _b === void 0 ? void 0 : _b.identifier][(_c = payload) === null || _c === void 0 ? void 0 : _c.nodeId]) {
            if ((_d = payload) === null || _d === void 0 ? void 0 : _d.lenient) {
                return;
            }
            throw new Error(`Already existed MQTT subscriber bind to topic ${(_e = payload) === null || _e === void 0 ? void 0 : _e.identifier}`);
        }
    }
    lookup(identifier) {
        var _a;
        return _a = this.subscribers[identifier], (_a !== null && _a !== void 0 ? _a : {});
    }
    unregister(payload, force, cb) {
        var _a, _b, _c, _d, _e;
        if (force) {
            if (this.subscribers[(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier]) {
                delete this.subscribers[(_b = payload) === null || _b === void 0 ? void 0 : _b.identifier][(_c = payload) === null || _c === void 0 ? void 0 : _c.nodeId];
            }
        }
        else {
            this.add(payload);
            this.subscribers[(_d = payload) === null || _d === void 0 ? void 0 : _d.identifier][(_e = payload) === null || _e === void 0 ? void 0 : _e.nodeId].enabled = false;
        }
        return cb && cb(payload);
    }
    add(payload) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.subscribers[(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier] = (_c = this.subscribers[(_b = payload) === null || _b === void 0 ? void 0 : _b.identifier], (_c !== null && _c !== void 0 ? _c : {}));
        this.subscribers[(_d = payload) === null || _d === void 0 ? void 0 : _d.identifier][(_e = payload) === null || _e === void 0 ? void 0 : _e.nodeId] = {
            enabled: (_f = payload) === null || _f === void 0 ? void 0 : _f.enabled,
            onReceiveMessage: (_g = payload) === null || _g === void 0 ? void 0 : _g.callback,
        };
    }
}
exports.MqttSubscriberStore = MqttSubscriberStore;
//# sourceMappingURL=mqtt-client-node-store.js.map