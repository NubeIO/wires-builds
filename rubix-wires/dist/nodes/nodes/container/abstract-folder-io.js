"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../../utils/helper");
const container_1 = require("../../container");
const node_1 = require("../../node");
const node_icons_1 = require("../../node-icons");
class AbstractFolderIONode extends node_1.Node {
    constructor(container, title, description) {
        super(container);
        this.title = title;
        this.description = description;
        this.iconImageUrl = node_icons_1.default.aiIcon;
    }
    onAdd() {
        if (!this.isUnderContainer() || helper_1.isNull(this.properties['slot']) || this.properties['slot'] === -1)
            return;
        let slot = this.properties['slot'];
        delete this.properties['slot'];
        this.emitChange(this, 'properties');
        this.correctParentIO(this.container.container_node, slot);
    }
    isUnderContainer() {
        return helper_1.isNotNull(this.container.container_node);
    }
    emitChange(node, ...properties) {
        if (node.side === container_1.Side.server) {
            let s_node = node.serialize();
            let updated = properties.reduce((o, prop) => ((o[prop] = s_node[prop]), o), {});
            node.container.db.updateNode(node.id, node.container.id, { $set: updated });
        }
    }
    findParentOutputById(containerNode, inputOrOutput) {
        var _a;
        return _a = Object.entries(containerNode[inputOrOutput])
            .find(([_, io]) => this.id === io.subNodeId), (_a !== null && _a !== void 0 ? _a : [null, null]);
    }
}
exports.AbstractFolderIONode = AbstractFolderIONode;
//# sourceMappingURL=abstract-folder-io.js.map