"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../../utils/helper");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const registry_1 = require("../../registry");
const abstract_folder_io_1 = require("./abstract-folder-io");
class ContainerInputNode extends abstract_folder_io_1.AbstractFolderIONode {
    constructor(container) {
        super(container, 'Folder Input', 'Input of the container');
        this.addOutput('input', null);
    }
    onCreated() {
        if (!this.isUnderContainer())
            return;
        let containerNode = this.container.container_node;
        const id = containerNode.addInput(this.name, node_io_1.Type.ANY, undefined, undefined, { subNodeId: this.id });
        this.name = containerNode.inputs[id].name;
        this.linkHandler.recomputeInputLinks(registry_1.default.getId(containerNode.cid, containerNode.id));
    }
    onRemoved() {
        if (!this.isUnderContainer())
            return;
        let containerNode = this.container.container_node;
        let [inputId, _] = this.findParentOutputById(this.container.container_node, 'inputs');
        if (helper_1.isNull(inputId)) {
            return;
        }
        containerNode.removeInput(+inputId);
        this.linkHandler.recomputeInputLinks(registry_1.default.getId(containerNode.cid, containerNode.id));
        this.emitChange(containerNode, 'size');
    }
    onAfterSettingsChange() {
        if (!this.isUnderContainer())
            return;
        const containerNode = this.container.container_node;
        let [inputId, _] = this.findParentOutputById(this.container.container_node, 'inputs');
        if (helper_1.isNull(inputId)) {
            return;
        }
        containerNode.inputs[inputId].name = this.name;
        this.emitChange(containerNode, 'inputs');
    }
    onExecute() {
        var _a;
        if (!this.isUnderContainer())
            return;
        let [_, i] = this.findParentOutputById(this.container.container_node, 'inputs');
        let input = i;
        if ((_a = input) === null || _a === void 0 ? void 0 : _a.updated)
            this.setOutputData(0, input.data);
    }
    correctParentIO(containerNode, slot) {
        let input = containerNode.inputs[slot];
        if (helper_1.isNull(input)) {
            return;
        }
        input.subNodeId = this.id;
        this.emitChange(containerNode, 'inputs');
    }
}
container_1.Container.registerNodeType('container/folder-input', ContainerInputNode, null, true, false, true);
//# sourceMappingURL=folder-input.js.map