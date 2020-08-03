"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientUtils {
    static addClient(childNode, payload) {
        if (childNode['subscribe']) {
            return childNode['subscribe'](this.createMessage('ADD_CLIENT', payload));
        }
    }
    static deleteClient(childNode, payload) {
        if (childNode['subscribe']) {
            return childNode['subscribe'](this.createMessage('DELETE_CLIENT', payload));
        }
    }
    static createMessage(action, payload = null) {
        return { action, payload };
    }
}
exports.default = ClientUtils;
//# sourceMappingURL=client-utils.js.map