"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const container_node_1 = require("../../container-node");
const node_mixin_1 = require("../node-mixin");
class ProtocolDeviceNode extends node_mixin_1.AbleEnableNode(container_node_1.ContainerNode) {
    constructor(container, title, description) {
        super(container);
        this._title = title;
        this.description = description;
    }
    onCreated() {
        super.onCreated();
        this.name = `${this._title} cid_${this.container.id}_id${this.id}`;
    }
    onAdded() {
        this.startOrStop();
        this.applyTitle();
    }
    onAfterSettingsChange() {
        this.startOrStop();
        this.applyTitle();
    }
    onRemoved() {
        this.stop();
        super.onRemoved();
    }
    applyTitle() {
        super.applyTitle();
    }
    enableDescription() {
        return `Enable ${this._title}`;
    }
    startOrStop() {
        if (this.side !== container_1.Side.server)
            return;
        this.stop();
        this.isEnabled() ? this.createThenStart() : this.stop();
    }
}
exports.ProtocolDeviceNode = ProtocolDeviceNode;
//# sourceMappingURL=ProtocolDeviceNode.js.map