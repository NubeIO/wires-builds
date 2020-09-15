"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
class MockCentralizedListener {
    static cast(object) {
        if (helper_1.isEmpty(object)) {
            return MockCentralizedListener.LISTENER;
        }
        if (helper_1.isFunction(object['listen'])) {
            return object;
        }
        return MockCentralizedListener.LISTENER;
    }
    listen({ action, payload }) {
        throw new Error(`Not found handler or parent to process action ${action}`);
    }
    MockCentralizedListener() {
    }
}
exports.MockCentralizedListener = MockCentralizedListener;
MockCentralizedListener.LISTENER = new MockCentralizedListener();
class DefaultObservable {
    constructor(list) {
        this.list = list;
    }
    observers() {
        return this.list;
    }
    notify(data, eventSourceId) {
        var _a;
        (_a = this.observers()) === null || _a === void 0 ? void 0 : _a.forEach(observer => observer.update(data, eventSourceId));
    }
}
exports.DefaultObservable = DefaultObservable;
//# sourceMappingURL=pattern.js.map