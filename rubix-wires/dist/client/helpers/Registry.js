"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Registry {
    static setRouter(router) {
        Registry.router = router;
    }
    static getRouter() {
        return this.router;
    }
}
exports.default = Registry;
//# sourceMappingURL=Registry.js.map