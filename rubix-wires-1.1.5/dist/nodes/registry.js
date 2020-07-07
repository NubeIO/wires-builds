"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Registry {
    static getId(containerId, nodeId) {
        return `c${containerId}n${nodeId}`;
    }
}
exports.default = Registry;
Registry._nodes = {};
//# sourceMappingURL=registry.js.map