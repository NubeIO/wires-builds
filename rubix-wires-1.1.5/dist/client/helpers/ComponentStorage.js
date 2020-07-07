"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = require("./Storage");
class ComponentStorage {
    constructor(storageKey, excludeData = []) {
        this.storageKey = storageKey;
        this.excludeData = excludeData;
    }
    skipFromDataWatch(key) {
        return this.excludeData.indexOf(key) === -1;
    }
    restoreData(component) {
        const editorProps = Storage_1.default.get(this.storageKey, {});
        Object.keys(editorProps)
            .filter(key => this.skipFromDataWatch(key) && editorProps[key] !== undefined)
            .forEach(key => {
            component[key] = editorProps[key];
        });
    }
    saveData(component) {
        const output = Object.keys(component.$data)
            .filter(key => this.skipFromDataWatch(key))
            .reduce((previousValue, currentValue) => (Object.assign(Object.assign({}, previousValue), { [currentValue]: component[currentValue] })), {});
        Storage_1.default.set(this.storageKey, output);
    }
}
exports.default = ComponentStorage;
//# sourceMappingURL=ComponentStorage.js.map