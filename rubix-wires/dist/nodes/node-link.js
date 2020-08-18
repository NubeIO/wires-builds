"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const logger = require('logplease').create('node-link', { color: 5 });
exports.createLinkHandler = (node) => {
    return new DefaultLinkHandler(node);
};
class DefaultLinkHandler {
    constructor(node) {
        this.node = node;
    }
    make(link) {
        var _a;
        let target_node = this.node.container.getNodeById(link.target_id);
        if (!target_node) {
            logger.error("Can't connect, target node not found");
            return false;
        }
        if (!this.node.outputs || !this.node.outputs[link.origin_slot]) {
            logger.error("Can't connect, output not found");
            return false;
        }
        let actualSlot = (_a = link.target_input_id, (_a !== null && _a !== void 0 ? _a : link.target_slot));
        if (!target_node.inputs || !target_node.inputs[actualSlot]) {
            logger.error("Can't connect, input not found");
            return false;
        }
        let output = this.node.outputs[link.origin_slot];
        let input = target_node.inputs[actualSlot];
        if (target_node['onConnectInput'] && !target_node['onConnectInput'](actualSlot, output)) {
            return false;
        }
        if (input.link)
            target_node.disconnectInputLink(link.target_slot, link.target_input_id);
        if (!output.links)
            output.links = [];
        output.links.push({
            target_node_id: link.target_id,
            target_slot: link.target_slot,
            target_input_id: link.target_input_id,
        });
        input.link = { target_node_id: link.origin_id, target_slot: link.origin_slot };
        input.updated = true;
        input.data = utils_1.default.parseValue(output.data, input.type);
        target_node.isUpdated = true;
        if (this.node.container.db) {
            let s_node = this.node.serialize();
            if (target_node.id === this.node.id) {
                this.node.container.db.updateNode(this.node.id, this.node.container.id, {
                    $set: { outputs: s_node.outputs, inputs: s_node.inputs },
                });
            }
            else {
                let s_t_node = target_node.serialize();
                this.node.container.db.updateNode(this.node.id, this.node.container.id, {
                    $set: { outputs: s_node.outputs },
                });
                this.node.container.db.updateNode(target_node.id, target_node.container.id, {
                    $set: { inputs: s_t_node.inputs },
                });
            }
        }
        this.node.setDirtyCanvas(false, true);
        logger.debug('Connected to ' + target_node.getReadableId());
        return true;
    }
    disconnectInput(slot, index) {
        var _a;
        let inputId = (index !== null && index !== void 0 ? index : slot);
        if (!this.node.inputs || !this.node.inputs[inputId]) {
            logger.error(`Can't disconnect, input slot: ${inputId} not found on node: ${this.node.id}`);
            return false;
        }
        const input = this.node.inputs[inputId];
        const link = input.link;
        if (!link)
            return false;
        let targetNode = this.node.container.getNodeById(link.target_node_id);
        if (!targetNode)
            return false;
        let output = targetNode.outputs[_a = link.target_input_id, (_a !== null && _a !== void 0 ? _a : link.target_slot)];
        if (!output || !output.links)
            return false;
        let number = output.links.findIndex(l => l.target_node_id === this.node.id &&
            ((l.target_input_id && index && l.target_input_id === index) || l.target_slot === inputId));
        if (number !== -1) {
            output.links.splice(number, 1);
        }
        input.link = null;
        input.data = undefined;
        input.updated = true;
        this.node.isUpdated = true;
        if (this.node.container.db) {
            let serializedNode = this.node.serialize();
            let serializedTargetNode = targetNode.serialize();
            this.node.container.db.updateNode(this.node.id, this.node.container.id, {
                $set: { inputs: serializedNode.inputs },
            });
            this.node.container.db.updateNode(targetNode.id, targetNode.container.id, {
                $set: { outputs: serializedTargetNode.outputs },
            });
        }
        this.node.setDirtyCanvas(false, true);
        logger.debug(`Disconnected from ${targetNode.getReadableId()}`);
        return true;
    }
    disconnectOutput(slot, index) {
        var _a;
        if (!this.node.outputs || !this.node.outputs[slot]) {
            logger.error(`Can't disconnect, output slot: ${slot} not found on node: ${this.node.id}`);
            return false;
        }
        const output = this.node.outputs[slot];
        if (!output.links)
            return false;
        let i = output.links.length;
        while (i--) {
            let link = output.links[i];
            const targetNode = this.node.container.getNodeById(link.target_node_id);
            if (!targetNode) {
                logger.error(`Node: ${link.target_node_id} is not available`);
            }
            if (targetNode &&
                targetNode.inputs &&
                targetNode.inputs[link.target_slot] &&
                targetNode.inputs[link.target_slot].link) {
                delete targetNode.inputs[link.target_slot].link;
                targetNode.inputs[link.target_slot].data = undefined;
                targetNode.inputs[link.target_slot].updated = true;
                targetNode.isUpdated = true;
                if (this.node.container.db) {
                    let s_t_node = targetNode.serialize();
                    this.node.container.db.updateNode(targetNode.id, targetNode.container.id, {
                        $set: { inputs: s_t_node.inputs },
                    });
                }
            }
            else {
                logger.error(`Tried to delete input link on: ${targetNode} of slot: ${link.target_slot}`);
            }
            output.links.splice(i, 1);
            logger.debug(`Disconnected from ${(_a = targetNode) === null || _a === void 0 ? void 0 : _a.getReadableId()}`);
        }
        delete output.links;
        if (this.node.container.db) {
            let s_node = this.node.serialize();
            this.node.container.db.updateNode(this.node.id, this.node.container.id, {
                $set: { outputs: s_node.outputs },
            });
        }
        this.node.setDirtyCanvas(false, true);
        return true;
    }
}
//# sourceMappingURL=node-link.js.map