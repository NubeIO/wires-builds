"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../../utils/helper");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const registry_1 = require("../../registry");
const abstract_folder_io_1 = require("./abstract-folder-io");
class ContainerOutputNode extends abstract_folder_io_1.AbstractFolderIONode {
    constructor(container) {
        super(container, 'Folder Output', 'Output of the container');
        this.addInput('output', null);
    }
    onCreated() {
        if (!this.isUnderContainer())
            return;
        let containerNode = this.container.container_node;
        const id = containerNode.addOutput(this.name, node_io_1.Type.ANY, undefined, { subNodeId: this.id });
        this.name = containerNode.outputs[id].name;
        this.linkHandler.recomputeOutputLinks(registry_1.default.getId(containerNode.cid, containerNode.id));
    }
    onRemoved() {
        if (!this.isUnderContainer())
            return;
        let containerNode = this.container.container_node;
        let [outputId, _] = this.findParentOutputById(this.container.container_node, 'outputs');
        if (helper_1.isNull(outputId)) {
            return;
        }
        containerNode.removeOutput(+outputId);
        this.linkHandler.recomputeOutputLinks(registry_1.default.getId(containerNode.cid, containerNode.id));
        this.emitChange(containerNode, 'size');
    }
    onAfterSettingsChange() {
        if (!this.isUnderContainer())
            return;
        const containerNode = this.container.container_node;
        let [outputId, _] = this.findParentOutputById(containerNode, 'outputs');
        if (helper_1.isNull(outputId)) {
            return;
        }
        containerNode.outputs[outputId].name = this.name;
        this.emitChange(containerNode, 'outputs');
    }
    onInputUpdated() {
        if (!this.isUnderContainer())
            return;
        let [outputId, _] = this.findParentOutputById(this.container.container_node, 'outputs');
        if (helper_1.isNull(outputId)) {
            return;
        }
        this.isRecentlyActive = true;
        this.container.container_node.setOutputData(+outputId, this.getInputData(0));
    }
    correctParentIO(containerNode, slot) {
        let output = containerNode.outputs[slot];
        if (helper_1.isNull(output)) {
            return;
        }
        output.subNodeId = this.id;
        this.emitChange(containerNode, 'outputs');
    }
}
container_1.Container.registerNodeType('container/folder-output', ContainerOutputNode, null, true, false, true);
//# sourceMappingURL=folder-output.js.map