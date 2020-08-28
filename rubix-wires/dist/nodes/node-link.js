"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../utils/helper");
const container_1 = require("./container");
const registry_1 = require("./registry");
const utils_1 = require("./utils");
const logger = require('logplease').create('node-link', { color: 5 });
class Link {
}
exports.Link = Link;
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
            logger.error('Can\'t connect, target node not found');
            return false;
        }
        if (!this.node.outputs || !this.node.outputs[link.origin_slot]) {
            logger.error('Can\'t connect, output not found');
            return false;
        }
        let actualSlot = (_a = link.target_input_id, (_a !== null && _a !== void 0 ? _a : link.target_slot));
        if (!target_node.inputs || !target_node.inputs[actualSlot]) {
            logger.error('Can\'t connect, input not found');
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
        if (target_node.id === this.node.id) {
            this.emitChange(this.node, 'inputs', 'outputs');
        }
        else {
            this.emitChange(this.node, 'outputs');
            this.emitChange(target_node, 'inputs');
        }
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
        let number = output.links.findIndex(l => this.predicate(l, this.node.id, index, slot));
        if (number !== -1) {
            output.links.splice(number, 1);
        }
        input.link = null;
        input.data = undefined;
        input.updated = true;
        this.node.isUpdated = true;
        this.emitChange(this.node, 'inputs');
        this.emitChange(targetNode, 'outputs');
        logger.debug(`Disconnected from ${targetNode.getReadableId()}`);
        return true;
    }
    disconnectOutput(slot, index) {
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
            if (targetNode && targetNode.inputs && targetNode.inputs[link.target_slot] &&
                targetNode.inputs[link.target_slot].link) {
                delete targetNode.inputs[link.target_slot].link;
                targetNode.inputs[link.target_slot].data = undefined;
                targetNode.inputs[link.target_slot].updated = true;
                targetNode.isUpdated = true;
                this.emitChange(this.node, 'inputs');
            }
            else {
                logger.error(`Tried to delete input link on: ${targetNode} of slot: ${link.target_slot}`);
            }
            output.links.splice(i, 1);
            logger.debug(`Disconnected from ${targetNode.getReadableId()}`);
        }
        delete output.links;
        this.emitChange(this.node, 'outputs');
        return true;
    }
    recomputeInputLinks(nodeId) {
        var _a;
        let node = (_a = registry_1.default._nodes[nodeId], (_a !== null && _a !== void 0 ? _a : this.node));
        let slot = -1;
        for (const [inputId, input] of Object.entries(node.inputs)) {
            if (input.setting.hidden) {
                continue;
            }
            slot++;
            if (helper_1.isNull(input.link)) {
                continue;
            }
            let link = input.link;
            let targetNode = node.container.getNodeById(link.target_node_id);
            if (helper_1.isNull(targetNode)) {
                continue;
            }
            let outputId = link.target_input_id;
            let outputSlot = link.target_slot;
            let output = targetNode.outputs[(outputId !== null && outputId !== void 0 ? outputId : outputSlot)];
            if (helper_1.isNull(output)) {
                continue;
            }
            let number = output.links.findIndex(l => this.predicate(l, node.id, +inputId, slot));
            if (number === -1) {
                continue;
            }
            output.links.splice(number, 1, { target_node_id: node.id, target_slot: slot, target_input_id: +inputId });
            this.emitChange(targetNode, 'outputs');
        }
        this.emitChange(node, 'inputs');
    }
    recomputeOutputLinks(nodeId) {
        var _a;
        let node = (_a = registry_1.default._nodes[nodeId], (_a !== null && _a !== void 0 ? _a : this.node));
        let slot = -1;
        Object.entries(node.outputs).forEach(([outputId, output]) => {
            slot++;
            if (helper_1.isEmpty(output.links)) {
                return;
            }
            output.links.forEach(link => {
                var _a, _b;
                let targetNode = node.container.getNodeById(link.target_node_id);
                if (helper_1.isNull(targetNode) || helper_1.isNull(targetNode.inputs[_a = link.target_input_id, (_a !== null && _a !== void 0 ? _a : link.target_slot)])) {
                    return;
                }
                let outputLink = {
                    target_node_id: node.id,
                    target_slot: slot,
                    target_input_id: +outputId,
                };
                console.log(`${JSON.stringify(outputLink)}`);
                targetNode.inputs[_b = link.target_input_id, (_b !== null && _b !== void 0 ? _b : link.target_slot)].link = outputLink;
                this.emitChange(targetNode, 'inputs');
            });
        });
        this.emitChange(node, 'outputs');
    }
    emitChange(node, ...properties) {
        if (node.side === container_1.Side.server) {
            let s_node = node.serialize();
            let updated = properties.reduce((o, prop) => ((o[prop] = s_node[prop]), o), {});
            node.container.db.updateNode(node.id, node.container.id, { $set: updated });
        }
    }
    predicate(link, targetNodeId, targetInputId, targetSlot) {
        if (link.target_node_id !== targetNodeId) {
            return false;
        }
        if (link.target_input_id && targetInputId && link.target_input_id === targetInputId) {
            return true;
        }
        return link.target_slot === targetSlot;
    }
}
//# sourceMappingURL=node-link.js.map