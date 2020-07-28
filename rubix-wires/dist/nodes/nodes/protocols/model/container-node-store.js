"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../../../../decorators");
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
    ;
    isDifferent(payload) {
        var _a, _b, _c;
        return ((_a = payload) === null || _a === void 0 ? void 0 : _a.identifier) !== ((_c = (_b = payload) === null || _b === void 0 ? void 0 : _b.prev) === null || _c === void 0 ? void 0 : _c.identifier);
    }
}
__decorate([
    decorators_1.ErrorHandler
], AbstractContainerStore.prototype, "register", null);
__decorate([
    decorators_1.ErrorHandler
], AbstractContainerStore.prototype, "update", null);
exports.AbstractContainerStore = AbstractContainerStore;
//# sourceMappingURL=container-node-store.js.map