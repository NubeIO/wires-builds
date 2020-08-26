"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
class MqttPublisherStore extends container_node_store_1.OneIdentifierOneNodeStore {
    alreadyExistedMsg(payload) {
        var _a;
        return `Already exist MQTT publisher bind to topic ${(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier}`;
    }
}
exports.MqttPublisherStore = MqttPublisherStore;
class MqttSubscriberStore extends container_node_store_1.OneIdentifierManyNodeStore {
    alreadyExistedMsg(payload) {
        var _a;
        return `Already existed MQTT subscriber bind to topic ${(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier} with node id ${payload.nodeId}`;
    }
}
exports.MqttSubscriberStore = MqttSubscriberStore;
//# sourceMappingURL=mqtt-client-node-store.js.map