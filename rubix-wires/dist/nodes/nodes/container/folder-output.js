"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../../utils/helper");
const container_1 = require("../../container");
const node_1 = require("../../node");
const node_icons_1 = require("../../node-icons");
const registry_1 = require("../../registry");
const icon = node_icons_1.default.aiIcon;
class ContainerOutputNode extends node_1.Node {
    constructor(container) {
        super(container);
        this.title = 'Folder Output';
        this.description = 'Output of the container';
        this.iconImageUrl = icon;
        this.addInput('output', null);
        this.properties = { type: null };
    }
    onCreated() {
        if (helper_1.isNull(this.container.container_node))
            return;
        let containerNode = this.container.container_node;
        const id = containerNode.addOutput(this.name, this.properties['type'], this.properties['slot']);
        this.properties['slot'] = id;
        this.name = containerNode.outputs[id].name;
        this.linkHandler.recomputeOutputLinks(registry_1.default.getId(this.container.container_node.cid, this.container.container_node.id));
    }
    onRemoved() {
        if (helper_1.isNull(this.container.container_node))
            return;
        let cont_node = this.container.container_node;
        cont_node.removeOutput(this.properties['slot']);
        this.properties['slot'] = -1;
        this.linkHandler.recomputeOutputLinks(registry_1.default.getId(this.container.container_node.cid, this.container.container_node.id));
        if (this.container.db) {
            this.container.db.updateNode(cont_node.id, cont_node.container.id, {
                $set: { size: cont_node.size },
            });
        }
    }
    onInputUpdated() {
        if (helper_1.isNull(this.container.container_node))
            return;
        let val = this.getInputData(0);
        let cont_node = this.container.container_node;
        let slot = this.properties['slot'];
        this.isRecentlyActive = true;
        cont_node.setOutputData(slot, val);
    }
    onAfterSettingsChange() {
        if (helper_1.isNull(this.container.container_node))
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
}
container_1.Container.registerNodeType('container/folder-output', ContainerOutputNode, null, true, false, true);
//# sourceMappingURL=folder-output.js.map