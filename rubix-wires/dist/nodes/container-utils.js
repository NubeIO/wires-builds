"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("./container");
const constants_1 = require("./constants");
class ContainerUtils {
    static getSortedAvailableContainers(nodes) {
        let containersIds = nodes.map(node => +node.cid);
        let subContainerIds = nodes
            .filter(node => node.sub_container !== undefined)
            .map(node => +node.sub_container.id);
        containersIds = [...new Set([...containersIds, ...subContainerIds])];
        containersIds.sort((a, b) => a - b);
        return containersIds;
    }
    static fallbackNodeIfDoesNotExist(nodes) {
        return nodes.map(node => {
            let node_class = container_1.Container.nodes_types[node.type];
            if (!node_class) {
                node.type = constants_1.UNKNOWN_NODE;
            }
            return node;
        });
    }
    static addInputsLinkNodes(createdNodes, nodesWithLinks, updateInput) {
        createdNodes.forEach(node => {
            node.inputs &&
                Object.keys(node.inputs).forEach(key => {
                    var _a;
                    let isChanged = false;
                    let nodeWithLink = nodesWithLinks.find(n => n.id === node.id && n.cid === node.cid);
                    if (nodeWithLink.inputs && nodeWithLink.inputs[key] && nodeWithLink.inputs[key].link) {
                        const link = nodeWithLink.inputs[key].link;
                        const connectedNode = createdNodes.find(n => n.id === link.target_node_id && n.cid === nodeWithLink.cid);
                        if (connectedNode &&
                            connectedNode.outputs &&
                            connectedNode.outputs[_a = link.target_input_id, (_a !== null && _a !== void 0 ? _a : link.target_slot)]) {
                            node.inputs[key].link = nodeWithLink.inputs[key].link;
                            isChanged = true;
                        }
                    }
                    if (isChanged && updateInput) {
                        updateInput(node);
                    }
                });
        });
    }
    static addOutputsLinkNodes(createdNodes, nodesWithLinks, updateOutputs) {
        createdNodes.forEach(node => {
            node.outputs &&
                Object.keys(node.outputs).forEach(key => {
                    let isChanged = false;
                    let nodeWithLink = nodesWithLinks.find(n => n.id === node.id && n.cid === node.cid);
                    if (nodeWithLink && nodeWithLink.outputs && nodeWithLink.outputs[key] && nodeWithLink.outputs[key].links) {
                        const links = nodeWithLink.outputs[key].links;
                        links.forEach(link => {
                            var _a;
                            const connectedNode = createdNodes.find(n => n.id === link.target_node_id && n.cid === nodeWithLink.cid);
                            if (connectedNode &&
                                connectedNode.inputs &&
                                connectedNode.inputs[_a = link.target_input_id, (_a !== null && _a !== void 0 ? _a : link.target_slot)]) {
                                if (!node.outputs[key].links) {
                                    node.outputs[key].links = [];
                                }
                                node.outputs[key].links.push(link);
                                isChanged = true;
                            }
                        });
                    }
                    if (isChanged && updateOutputs) {
                        updateOutputs(node);
                    }
                });
        });
    }
    static addSettingsProperties(node, settings) {
        Object.keys(settings).forEach(key => {
            if (node.settings && node.settings[key]) {
                node.settings[key].value = settings[key].value;
            }
        });
    }
    static addSettingsValues(importedNodes, originalNodes, updateSettings) {
        let serializedNodes = [];
        importedNodes.forEach(node => {
            let originalNode = originalNodes.find(n => n.id == node.id);
            Object.keys(node.settings).forEach(key => {
                let isChanged = false;
                if (originalNode &&
                    originalNode.settings &&
                    originalNode.settings[key] &&
                    originalNode.settings[key].value != null) {
                    node.settings[key].value = originalNode.settings[key].value;
                    isChanged = true;
                }
                if (isChanged && updateSettings) {
                    updateSettings(node);
                }
            });
            serializedNodes.push(node.serialize());
        });
        return serializedNodes;
    }
    static removeBrokenLinks(container) {
        const nodes = container._nodes;
        for (let id in nodes) {
            const node = nodes[id];
            node.outputs &&
                Object.keys(node.outputs).map(key => {
                    let output = node.outputs[key];
                    if (output && output.links) {
                        node.outputs[key].links = output.links.filter(link => {
                            return container.getNodeById(link.target_node_id);
                        });
                    }
                });
            if (node.inputs) {
                node.inputs = Object.keys(node.inputs).map(key => {
                    let input = node.inputs[key];
                    if (input && input.link) {
                        if (!container.getNodeById(input.link.target_node_id)) {
                            delete node.inputs[key].link;
                        }
                    }
                    return input;
                });
                if (container.db) {
                    container.db.updateNode(node.id, node.cid, {
                        $set: { inputs: node.inputs, outputs: node.outputs },
                    });
                }
                continue;
            }
            if (container.db) {
                container.db.updateNode(node.id, node.cid, {
                    $set: { outputs: node.outputs },
                });
            }
        }
    }
    static remapNodesId(container, nodes, cid, lastNodeId) {
        const nodesIdMap = {};
        nodes.forEach(node => {
            nodesIdMap[node.id] = ++lastNodeId;
        });
        if (cid === 0) {
            container.db.updateLastRootNodeId(lastNodeId);
        }
        else {
            container.db.updateNode(container.container_node.id, container.container_node.container.id, {
                $set: { 'sub_container.last_node_id': lastNodeId },
            });
        }
        container.last_node_id = lastNodeId;
        return nodes.map(node => {
            node.id = nodesIdMap[node.id];
            node.outputs &&
                Object.keys(node.outputs).map(key => {
                    let output = node.outputs[key];
                    if (output && output.links) {
                        output.links = output.links
                            .filter(link => nodesIdMap[link.target_node_id] !== undefined)
                            .map(link => {
                            link.target_node_id = nodesIdMap[link.target_node_id];
                            return link;
                        });
                    }
                    node.outputs[key] = output;
                });
            node.inputs &&
                Object.keys(node.inputs).map(key => {
                    let input = node.inputs[key];
                    if (input && input.link) {
                        if (nodesIdMap[input.link.target_node_id]) {
                            input.link.target_node_id = nodesIdMap[input.link.target_node_id];
                            node.inputs[key] = input;
                        }
                        else {
                            delete node.inputs[key].link;
                        }
                    }
                });
            return node;
        });
    }
    static updateSubContainerLastNodeId(container, lastNodeId) {
        container.db.updateNode(container.container_node.id, container.container_node.container.id, {
            $set: { 'sub_container.last_node_id': lastNodeId },
        });
    }
    static remapContainersId(container, nodes, paramsCid, firstCid, allNew = false) {
        const containersIdMap = {};
        let lastContainerId = container_1.Container.last_container_id;
        if (allNew) {
            containersIdMap[paramsCid] = ++lastContainerId;
        }
        else {
            containersIdMap[firstCid] = paramsCid;
        }
        nodes.forEach(node => {
            if (node.sub_container) {
                if (!containersIdMap[node.sub_container.id]) {
                    containersIdMap[node.sub_container.id] = ++lastContainerId;
                }
            }
        });
        container_1.Container.last_container_id = lastContainerId;
        container.db.updateLastContainerId(lastContainerId);
        nodes = nodes.map(node => {
            node.cid = containersIdMap[node.cid];
            if (node.sub_container)
                node.sub_container.id = containersIdMap[node.sub_container.id];
            return node;
        });
        return { nodes, convertedParamsCid: containersIdMap[paramsCid] };
    }
    static adjustPosition(container, containerNodes, pos, isCloned) {
        const minImportXCoordinate = Math.min(...containerNodes.map(node => node.pos[0]));
        const minImportYCoordinate = Math.min(...containerNodes.map(node => node.pos[1]));
        let startingXCoordinate;
        let startingYCoordinate;
        if (isCloned) {
            startingXCoordinate = 0;
            startingYCoordinate = pos[1] - minImportYCoordinate + 100;
        }
        else {
            startingXCoordinate = pos[0] - minImportXCoordinate;
            startingYCoordinate = pos[1] - minImportYCoordinate;
        }
        containerNodes.forEach(node => {
            node.pos[0] += startingXCoordinate;
            node.pos[1] += startingYCoordinate;
        });
        return containerNodes;
    }
    static sortNodes(nodes) {
        nodes.sort((a, b) => a.id - b.id);
    }
    static createContainersIfDoesNotExist(containerIds, side) {
        containerIds.forEach(cid => {
            if (!container_1.Container.containers[cid])
                container_1.Container.containers[cid] = new container_1.Container(side, cid);
        });
    }
    static reRenderNodes(resCid, nodes) {
        const containersIds = ContainerUtils.getSortedAvailableContainers(nodes);
        container_1.Container.last_container_id = containersIds[containersIds.length - 1];
        const selectedNodes = [];
        const createdNodes = [];
        ContainerUtils.createContainersIfDoesNotExist(containersIds, container_1.Side.editor);
        let isFirstContainer = true;
        containersIds.forEach(cid => {
            let containerNodes = nodes.filter(node => node.cid === cid);
            containerNodes.sort((a, b) => a.id - b.id);
            containerNodes.forEach(node => {
                const container = container_1.Container.containers[node.cid];
                const n = container.createNode(node.type, node, null, true);
                if (resCid == cid) {
                    selectedNodes.push(n);
                }
                createdNodes.push(n);
                container.last_node_id = n.id;
            });
            isFirstContainer = false;
        });
        ContainerUtils.addInputsLinkNodes(createdNodes, nodes);
        ContainerUtils.addOutputsLinkNodes(createdNodes, nodes);
        ContainerUtils.addSettingsValues(createdNodes, nodes);
        return selectedNodes;
    }
}
exports.default = ContainerUtils;
//# sourceMappingURL=container-utils.js.map