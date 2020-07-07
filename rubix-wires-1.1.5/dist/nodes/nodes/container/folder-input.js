"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const folder_1 = require("./folder");
class ContainerInputNode extends node_1.Node {
    constructor(container) {
        super(container);
        this.title = 'Folder Input';
        this.description = 'Input of the container';
        this.addOutput('input', null);
        this.properties = { type: null };
    }
    onCreated() {
        if (!this.isPlacedInsideContainerNode())
            return;
        let containerNode = this.container.container_node;
        this.properties['slot'] = containerNode.addInput(this.name, this.properties['type']);
        if (this.container.db) {
            let serializedContainerNode = containerNode.serialize();
            this.container.db.updateNode(containerNode.id, containerNode.container.id, {
                $set: { inputs: serializedContainerNode.inputs },
            });
        }
    }
    onRemoved() {
        if (!this.isPlacedInsideContainerNode())
            return;
        let containerNode = this.container.container_node;
        containerNode.disconnectInputLink(this.properties['slot']);
        containerNode.removeInput(this.properties['slot']);
        containerNode.setDirtyCanvas(true, true);
        this.properties['slot'] = -1;
        if (this.container.db) {
            let serializedContainerNode = containerNode.serialize();
            this.container.db.updateNode(containerNode.id, containerNode.container.id, {
                $set: { inputs: serializedContainerNode.inputs },
            });
            this.container.db.updateNode(containerNode.id, containerNode.container.id, {
                $set: { size: containerNode.size },
            });
        }
    }
    onExecute() {
        if (!this.isPlacedInsideContainerNode())
            return;
        let containerNode = this.container.container_node;
        let input = containerNode.inputs[this.properties['slot']];
        if (input.updated)
            this.setOutputData(0, input.data);
    }
    onAfterSettingsChange() {
        if (!this.isPlacedInsideContainerNode())
            return;
        const containerNode = this.container.container_node;
        containerNode.inputs[this.properties['slot']].name = this.name;
        if (this.container.db) {
            let serializedContainerNode = containerNode.serialize();
            this.container.db.updateNode(serializedContainerNode.id, containerNode.container.id, {
                $set: { inputs: serializedContainerNode.inputs },
            });
        }
    }
    isPlacedInsideContainerNode() {
        return !!this.container.container_node;
    }
}
container_1.Container.registerNodeType('container/folder-input', ContainerInputNode, folder_1.CONTAINER_NODE_TYPE);
//# sourceMappingURL=folder-input.js.map