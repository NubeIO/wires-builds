"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UuidUtils {
    static createUUID() {
        let dt = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    }
    static create8DigId() {
        return (Math.random()
            .toString(36)
            .substr(2, 4) +
            '_' +
            Math.random()
                .toString(36)
                .substr(2, 4));
    }
}
exports.default = UuidUtils;
//# sourceMappingURL=uuid-utils.js.map