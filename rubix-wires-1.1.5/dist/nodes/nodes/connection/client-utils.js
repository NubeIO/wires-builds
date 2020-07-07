"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientUtils {
    static sendPayloadToChild(childNode, payload) {
        if (childNode['subscribe']) {
            return childNode['subscribe'](this.createMessage("SEND_PAYLOAD_TO_CHILD", payload));
        }
    }
    static createMessage(action, payload = null) {
        return { action, payload };
    }
}
exports.default = ClientUtils;
//# sourceMappingURL=client-utils.js.map