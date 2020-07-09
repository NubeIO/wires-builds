"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Storage {
    static clear() {
        return localStorage.clear();
    }
    static get(key, defaultValue = null) {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                return JSON.parse(value);
            }
            catch (e) {
                return value;
            }
        }
        return defaultValue;
    }
    static set(key, value) {
        return localStorage.setItem(key, JSON.stringify(value));
    }
    static remove(key) {
        return localStorage.removeItem(key);
    }
}
exports.default = Storage;
//# sourceMappingURL=Storage.js.map