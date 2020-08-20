"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class ContainerOutputNode extends node_1.Node {
    constructor(container) {
        super(container);
        this.title = 'Folder Output';
        this.description = 'Output of the container';
        this.addInput('output', null);
        this.properties = { type: null };
    }
    onCreated() {
        if (!this.isPlacedInsideContainerNode())
            return;
        let containerNode = this.container.container_node;
        const id = containerNode.addOutput(this.name, this.properties['type'], this.properties['slot']);
        this.properties['slot'] = id;
        this.name = containerNode.outputs[id].name;
        if (this.container.db) {
            let serializedContainerNode = containerNode.serialize();
            this.container.db.updateNode(containerNode.id, containerNode.container.id, {
                $set: { outputs: serializedContainerNode.outputs },
            });
        }
    }
    onRemoved() {
        if (!this.isPlacedInsideContainerNode())
            return;
        let cont_node = this.container.container_node;
        cont_node.disconnectOutputLinks(this.properties['slot']);
        cont_node.removeOutput(this.properties['slot']);
        cont_node.setDirtyCanvas(true, true);
        this.properties['slot'] = -1;
        if (this.container.db) {
            let s_cont_node = cont_node.serialize();
            this.container.db.updateNode(cont_node.id, cont_node.container.id, {
                $set: { outputs: s_cont_node.outputs },
            });
            this.container.db.updateNode(cont_node.id, cont_node.container.id, {
                $set: { size: cont_node.size },
            });
        }
    }
    onInputUpdated() {
        if (!this.isPlacedInsideContainerNode())
            return;
        let val = this.getInputData(0);
        let cont_node = this.container.container_node;
        let slot = this.properties['slot'];
        this.isRecentlyActive = true;
        cont_node.setOutputData(slot, val);
    }
    onAfterSettingsChange() {
        if (!this.isPlacedInsideContainerNode())
            return;
        const containerNode = this.container.container_node;
        containerNode.outputs[this.properties['slot']].name = this.name;
        if (this.container.db) {
            let serializedContainerNode = containerNode.serialize();
            this.container.db.updateNode(serializedContainerNode.id, containerNode.container.id, {
                $set: { outputs: serializedContainerNode.outputs },
            });
        }
    }
    isPlacedInsideContainerNode() {
        return !!this.container.container_node;
    }
}
container_1.Container.registerNodeType('container/folder-output', ContainerOutputNode, null, true, false, true);
//# sourceMappingURL=folder-output.js.map