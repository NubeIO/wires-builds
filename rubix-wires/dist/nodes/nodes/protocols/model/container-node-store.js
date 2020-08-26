"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../../../utils/helper");
class DefaultContainerErrorNode {
    constructor() {
        this.nodeIdErrors = new Set();
    }
    hasError(nodeId) {
        return this.nodeIdErrors.has(nodeId);
    }
    addError(nodeId) {
        this.nodeIdErrors.add(nodeId);
    }
    removeError(nodeId) {
        this.nodeIdErrors.delete(nodeId);
    }
    listErrors() {
        return this.nodeIdErrors;
    }
}
exports.DefaultContainerErrorNode = DefaultContainerErrorNode;
class AbstractContainerStore {
    register(payload, cb) {
        this.checkExistence(payload);
        this.add(payload);
        return cb && cb(payload);
    }
    update(payload, afterUpdate, afterUnregisterIfExisted) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (((_a = payload) === null || _a === void 0 ? void 0 : _a.identifier) !== ((_c = (_b = payload) === null || _b === void 0 ? void 0 : _b.prev) === null || _c === void 0 ? void 0 : _c.identifier)) {
            try {
                this.checkExistence((_d = payload) === null || _d === void 0 ? void 0 : _d.prev);
            }
            catch (e) {
                this.unregister((_e = payload) === null || _e === void 0 ? void 0 : _e.prev, true, (p) => afterUnregisterIfExisted && afterUnregisterIfExisted(p, true));
            }
            return this.register(payload, afterUpdate);
        }
        if (!((_f = payload) === null || _f === void 0 ? void 0 : _f.enabled)) {
            this.unregister(payload, false, (p) => afterUnregisterIfExisted && afterUnregisterIfExisted(p, false));
            return (_g = payload) === null || _g === void 0 ? void 0 : _g.data;
        }
        this.add(payload);
        return afterUpdate && afterUpdate(payload);
    }
}
exports.AbstractContainerStore = AbstractContainerStore;
class OneIdentifierOneNodeStore extends AbstractContainerStore {
    constructor() {
        super(...arguments);
        this.nodes = {};
        this.errors = new DefaultContainerErrorNode();
    }
    checkExistence(payload) {
        var _a;
        if (this.nodes[(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier]) {
            if (payload.lenient && this.nodes[payload.identifier].nodeId === payload.nodeId) {
                return;
            }
            if (this.nodes[payload.identifier].nodeId !== payload.nodeId) {
                this.errors.addError(payload.nodeId);
            }
            throw new Error(this.alreadyExistedMsg(payload));
        }
    }
    lookup(identifier) {
        var _a;
        return _a = this.nodes[identifier], (_a !== null && _a !== void 0 ? _a : null);
    }
    update(payload, afterUpdate, afterUnregisterIfExisted) {
        var _a;
        this.errors.removeError((_a = payload) === null || _a === void 0 ? void 0 : _a.nodeId);
        return super.update(payload, afterUpdate, afterUnregisterIfExisted);
    }
    unregister(payload, force, cb) {
        var _a;
        if (helper_1.isNull(payload)) {
            return null;
        }
        this.errors.removeError((_a = payload) === null || _a === void 0 ? void 0 : _a.nodeId);
        let item = this.lookup(payload.identifier);
        if (helper_1.isNull(item)) {
            return null;
        }
        if (item.nodeId !== payload.nodeId) {
            return null;
        }
        if (force) {
            delete this.nodes[payload.identifier];
        }
        else {
            this.nodes[this.add(payload)].enabled = false;
        }
        return cb && cb(payload);
    }
    listNodeIds() {
        return helper_1.unionToArray(Object.values(this.nodes).map(v => v.nodeId), this.errors.listErrors());
    }
    add(payload) {
        var _a;
        this.errors.removeError((_a = payload) === null || _a === void 0 ? void 0 : _a.nodeId);
        this.nodes[payload.identifier] = {
            identifier: payload.identifier,
            nodeId: payload.nodeId,
            enabled: payload.enabled,
            func: payload.callback,
        };
        return payload.identifier;
    }
}
exports.OneIdentifierOneNodeStore = OneIdentifierOneNodeStore;
class OneIdentifierManyNodeStore extends AbstractContainerStore {
    constructor() {
        super(...arguments);
        this.nodes = {};
    }
    checkExistence(payload) {
        var _a, _b, _c, _d;
        if (this.nodes[(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier] && this.nodes[(_b = payload) === null || _b === void 0 ? void 0 : _b.identifier][(_c = payload) === null || _c === void 0 ? void 0 : _c.nodeId]) {
            if ((_d = payload) === null || _d === void 0 ? void 0 : _d.lenient) {
                return;
            }
            throw new Error(this.alreadyExistedMsg(payload));
        }
    }
    lookup(identifier) {
        var _a;
        return _a = this.nodes[identifier], (_a !== null && _a !== void 0 ? _a : {});
    }
    unregister(payload, force, afterUnregister) {
        var _a, _b, _c, _d, _e;
        let item = this.lookup(payload.identifier);
        if (helper_1.isNull(item) || helper_1.isNull(item[(_a = payload) === null || _a === void 0 ? void 0 : _a.nodeId])) {
            return null;
        }
        if (force) {
            if (this.nodes[(_b = payload) === null || _b === void 0 ? void 0 : _b.identifier]) {
                delete this.nodes[(_c = payload) === null || _c === void 0 ? void 0 : _c.identifier][(_d = payload) === null || _d === void 0 ? void 0 : _d.nodeId];
            }
        }
        else {
            this.nodes[this.add(payload)][(_e = payload) === null || _e === void 0 ? void 0 : _e.nodeId].enabled = false;
        }
        return afterUnregister && afterUnregister(payload);
    }
    listNodeIds() {
        return helper_1.unionToArray(...Object.values(this.nodes).map(v => Object.keys(v)));
    }
    has(identifier, predicate) {
        return Object.entries(this.lookup(identifier)).some(object => predicate(object[0], object[1]));
    }
    add(payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.nodes[(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier] = (_c = this.nodes[(_b = payload) === null || _b === void 0 ? void 0 : _b.identifier], (_c !== null && _c !== void 0 ? _c : {}));
        this.nodes[(_d = payload) === null || _d === void 0 ? void 0 : _d.identifier][(_e = payload) === null || _e === void 0 ? void 0 : _e.nodeId] = {
            enabled: (_f = payload) === null || _f === void 0 ? void 0 : _f.enabled,
            func: (_g = payload) === null || _g === void 0 ? void 0 : _g.callback,
        };
        return (_h = payload) === null || _h === void 0 ? void 0 : _h.identifier;
    }
}
exports.OneIdentifierManyNodeStore = OneIdentifierManyNodeStore;
//# sourceMappingURL=container-node-store.js.map