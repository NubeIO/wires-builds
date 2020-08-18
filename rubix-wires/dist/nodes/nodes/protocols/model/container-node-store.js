"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    update(payload, afterRegister, afterUnregister) {
        var _a, _b, _c;
        if (this.isDifferent(payload)) {
            try {
                this.checkExistence((_a = payload) === null || _a === void 0 ? void 0 : _a.prev);
            }
            catch (e) {
                this.unregister((_b = payload) === null || _b === void 0 ? void 0 : _b.prev, true, afterUnregister);
            }
            return this.register(payload, afterRegister);
        }
        if (!((_c = payload) === null || _c === void 0 ? void 0 : _c.enabled)) {
            return this.unregister(payload, false, afterUnregister);
        }
        return afterRegister && afterRegister(payload);
    }
    isDifferent(payload) {
        var _a, _b, _c;
        return ((_a = payload) === null || _a === void 0 ? void 0 : _a.identifier) !== ((_c = (_b = payload) === null || _b === void 0 ? void 0 : _b.prev) === null || _c === void 0 ? void 0 : _c.identifier);
    }
}
exports.AbstractContainerStore = AbstractContainerStore;
//# sourceMappingURL=container-node-store.js.map