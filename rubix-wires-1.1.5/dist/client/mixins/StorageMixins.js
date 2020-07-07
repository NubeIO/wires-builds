"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentStorage_1 = require("../helpers/ComponentStorage");
const StorageMixins = (storageKey, excludeData = []) => ({
    data: () => ({
        storage: new ComponentStorage_1.default(storageKey, [...excludeData, 'storage']),
    }),
    methods: {
        restoreData() {
            this.storage.restoreData(this);
        },
        storeData() {
            this.storage.saveData(this);
        },
    },
    beforeMount() {
        this.restoreData();
    },
    updated: function () {
        this.$nextTick(function () {
            this.storeData();
        });
    },
});
exports.default = StorageMixins;
//# sourceMappingURL=StorageMixins.js.map