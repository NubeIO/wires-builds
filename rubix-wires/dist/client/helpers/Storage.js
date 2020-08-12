"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base64_1 = require("./Base64");
class Storage {
    static clear() {
        return localStorage.clear();
    }
    static get(key, defaultValue = null, encrypt = false) {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                if (encrypt) {
                    return JSON.parse(Base64_1.default.decode(localStorage.getItem(key)));
                }
                return JSON.parse(value);
            }
            catch (e) {
                return defaultValue;
            }
        }
        return defaultValue;
    }
    static set(key, value, encrypt = false) {
        let data = JSON.stringify(value);
        if (encrypt) {
            data = Base64_1.default.encode(JSON.stringify(value));
        }
        return localStorage.setItem(key, data);
    }
    static remove(key) {
        return localStorage.removeItem(key);
    }
}
exports.default = Storage;
//# sourceMappingURL=Storage.js.map