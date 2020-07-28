"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_container_node_1 = require("./api-container-node");
class TopLevelApiContainerNode extends api_container_node_1.default {
    constructor() {
        super(...arguments);
        this.settingFields = {};
        this.entryFactory = () => null;
        this.applyEntry = () => {
            this.title = this.namePrefix();
            this.sub_container.name = this.title;
        };
        this.onAdded = () => {
            this.ignore_remove = true;
            this.removable = false;
            this.movable = false;
            this.applyEntry();
            this.syncWithBackend();
        };
        this.createEntry = () => Promise.resolve(null);
        this.updateEntry = (body) => Promise.resolve(null);
        this.deleteEntry = () => Promise.resolve(null);
        this.namePrefix = () => this.title;
        this.getTakenIdentifiers = () => Promise.resolve([]);
        this.makeIdentifier = (n) => null;
        this.findFreeIdentifier = () => Promise.resolve(null);
    }
}
exports.default = TopLevelApiContainerNode;
//# sourceMappingURL=top-level-api-container-node.js.map