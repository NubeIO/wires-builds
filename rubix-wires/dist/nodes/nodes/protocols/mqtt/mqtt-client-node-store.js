"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../../../utils/helper");
const container_node_store_1 = require("../model/container-node-store");
class MqttPointStoreItem {
    constructor(identifier, nodeId, enabled, publisher, subscriber) {
        this.identifier = identifier;
        this.nodeId = nodeId;
        this.enabled = enabled;
        this.publisher = publisher;
        this.subscriber = subscriber;
    }
    toPublisher() {
        return this.to(this.publisher);
    }
    toSubscriber() {
        return this.to(this.subscriber);
    }
    to(ps) {
        var _a, _b, _c, _d, _e;
        return {
            identifier: (_b = (_a = ps) === null || _a === void 0 ? void 0 : _a.identifier, (_b !== null && _b !== void 0 ? _b : this.identifier)),
            nodeId: this.nodeId,
            enabled: this.enabled,
            prev: (_c = ps) === null || _c === void 0 ? void 0 : _c.prev,
            data: (_d = ps) === null || _d === void 0 ? void 0 : _d.data,
            lenient: this.lenient,
            callback: (_e = ps) === null || _e === void 0 ? void 0 : _e.callback,
        };
    }
}
exports.MqttPointStoreItem = MqttPointStoreItem;
class MqttPublisherStore extends container_node_store_1.AbstractContainerStore {
    constructor() {
        super(...arguments);
        this.publishers = {};
        this.errors = new container_node_store_1.DefaultContainerErrorNode();
    }
    listNodeIds() {
        return helper_1.unionToArray(Object.values(this.publishers).map(v => v.nodeId), this.errors.listErrors());
    }
    checkExistence(payload) {
        var _a, _b, _c, _d, _e, _f;
        if (this.publishers[(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier]) {
            if (((_b = payload) === null || _b === void 0 ? void 0 : _b.lenient) && this.publishers[(_c = payload) === null || _c === void 0 ? void 0 : _c.identifier].nodeId === ((_d = payload) === null || _d === void 0 ? void 0 : _d.nodeId)) {
                return;
            }
            this.errors.addError((_e = payload) === null || _e === void 0 ? void 0 : _e.nodeId);
            throw new Error(`Already exist MQTT publisher bind to topic ${(_f = payload) === null || _f === void 0 ? void 0 : _f.identifier}`);
        }
    }
    unregister(payload, force, cb) {
        var _a, _b, _c, _d, _e;
        let v = this.lookup((_a = payload) === null || _a === void 0 ? void 0 : _a.identifier);
        if (v && v.nodeId !== ((_b = payload) === null || _b === void 0 ? void 0 : _b.nodeId)) {
            this.errors.removeError((_c = payload) === null || _c === void 0 ? void 0 : _c.nodeId);
            return null;
        }
        if (force) {
            delete this.publishers[(_d = payload) === null || _d === void 0 ? void 0 : _d.identifier];
        }
        else {
            this.add(payload);
            this.publishers[(_e = payload) === null || _e === void 0 ? void 0 : _e.identifier].enabled = false;
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
    listNodeIds() {
        return helper_1.unionToArray(...Object.values(this.subscribers).map(v => Object.keys(v)));
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