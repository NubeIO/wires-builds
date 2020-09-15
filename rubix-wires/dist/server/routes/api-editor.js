"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const container_1 = require("../../nodes/container");
const app_1 = require("../../app");
const config_1 = require("../../config");
const container_utils_1 = require("../../nodes/container-utils");
const folder_1 = require("../../nodes/nodes/container/folder");
const events_1 = require("../../events");
let router = express.Router();
setInterval(updateActiveNodes, 500);
function updateActiveNodes() {
    if (!app_1.default.rootContainer)
        return;
    for (let c in container_1.Container.containers) {
        let container = container_1.Container.containers[c];
        let activeNodesIds = [];
        for (let id in container._nodes) {
            let node = container._nodes[id];
            if (node.isRecentlyActive) {
                node.isRecentlyActive = false;
                activeNodesIds.push(node.id);
            }
        }
        if (activeNodesIds.length > 0)
            app_1.default.server.editorSocket.io.in('' + container.id).emit('nodes-active', {
                ids: activeNodesIds,
                cid: container.id,
            });
    }
}
router.get('/c/:cid', function (req, res) {
    let container = container_1.Container.containers[req.params.cid];
    if (!container)
        return res.status(404).send(`Can't get container. Container id [${req.params.cid}] not found.`);
    let s = container.serialize();
    res.json(s);
});
router.get('/c/:cid/file', function (req, res) {
    let container = container_1.Container.containers[req.params.cid];
    if (!container)
        return res.status(404).send(`Can't export container. Container id [${req.params.cid}] not found.`);
    let s = container.container_node.serialize();
    if (s.inputs)
        for (let i in s.inputs)
            if (s.inputs[i].link)
                delete s.inputs[i].link;
    if (s.outputs)
        for (let i in s.outputs)
            if (s.outputs[i].links)
                delete s.outputs[i].links;
    let text = JSON.stringify(s);
    let cont_name = container.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    let filename = 'shub_' + cont_name + '.json';
    res.set({ 'Content-Disposition': 'attachment; filename="' + filename + '"' });
    res.send(text);
});
router.post('/c/:cid/n/', function (req, res) {
    let container = container_1.Container.containers[req.params.cid];
    if (!container)
        return res.status(404).send(`Can't create node. Container id [${req.params.cid}] not found.`);
    let node = container.createNode(req.body.type, { pos: req.body.position });
    if (!node)
        return res.status(404).send(`Can't create node. Node type [${req.body.type}] not found.`);
    app_1.default.server.editorSocket.io.emit('node-create', {
        id: node.id,
        cid: req.params.cid,
        type: node.type,
        pos: node.pos,
    });
    if (node.isDashboardNode)
        app_1.default.server.dashboardSocket.io.in(req.params.cid).emit('node-create', {
            id: node.id,
            cid: req.params.cid,
            type: node.type,
            pos: node.pos,
        });
    res.send(`New node created: type [${node.type}] id [${node.container.id}/${node.id}]`);
});
router.delete('/c/:cid/n/', function (req, res) {
    let container = container_1.Container.containers[req.params.cid];
    if (!container)
        return res.status(404).send(`Can't delete node. Container id [${req.params.cid}] not found.`);
    removeNodes(container, req.body, +req.params.cid).then(() => {
        res.send(`Nodes deleted: ids ${req.params.cid}/${JSON.stringify(req.body.ids)}`);
    }, err => {
        res.status(404).send(err);
    });
});
router.put('/c/:cid/n/:id/position', function (req, res) {
    let container = container_1.Container.containers[req.params.cid];
    if (!container)
        return res.status(404).send(`Can't update node position. Container id [${req.params.cid}] not found.`);
    let node = container.getNodeById(req.params.id);
    if (!node)
        return res.status(404).send(`Can't update node position. Node id [${req.params.cid}/${req.params.id}] not found.`);
    node.pos = req.body.position;
    if (app_1.default.db)
        app_1.default.db.updateNode(node.id, node.container.id, { $set: { pos: node.pos } });
    app_1.default.server.editorSocket.io.emit('node-update-position', {
        id: req.params.id,
        cid: req.params.cid,
        pos: node.pos,
    });
    res.send(`Node position updated: type [${node.type}] id [${node.container.id}/${node.id}]`);
});
router.put('/c/:cid/n/:id/size', function (req, res) {
    let container = container_1.Container.containers[req.params.cid];
    if (!container)
        return res.status(404).send(`Can't update node size. Container id [${req.params.cid}] not found.`);
    let node = container.getNodeById(req.params.id);
    if (!node)
        return res.status(404).send(`Can't update node size. Node id [${req.params.cid}/${req.params.id}] not found.`);
    node.size = req.body.size;
    if (app_1.default.db)
        app_1.default.db.updateNode(node.id, node.container.id, { $set: { size: node.size } });
    app_1.default.server.editorSocket.io.emit('node-update-size', {
        id: req.params.id,
        cid: req.params.cid,
        size: node.size,
    });
    res.send(`Node size updated: type [${node.type}] id [${node.container.id}/${node.id}]`);
});
router.put('/c/:cid/n/:id/collapse', function (req, res) {
    let container = container_1.Container.containers[req.params.cid];
    if (!container)
        return res.status(404).send(`Can't update node collapse. Container id [${req.params.cid}] not found.`);
    let node = container.getNodeById(req.params.id);
    if (!node)
        return res.status(404).send(`Can't update node collapse. Node id [${req.params.cid}/${req.params.id}] not found.`);
    node.flags.collapsed = req.body.collapsed;
    if (app_1.default.db)
        app_1.default.db.updateNode(node.id, node.container.id, { $set: { "flags.collapsed": node.flags.collapsed } });
    app_1.default.server.editorSocket.io.emit('node-update-collapsed', {
        id: req.params.id,
        cid: req.params.cid,
        "flags.collapsed": node.flags.collapsed,
    });
    res.send(`Node collapsed updated: type [${node.type}] id [${node.container.id}/${node.id}]`);
});
router.put('/c/:cid/move', function (req, res) {
    const paramsCid = +req.params.cid;
    let container = container_1.Container.containers[paramsCid];
    if (!container)
        return res.status(404).send(`Can't move nodes. Container id [${paramsCid}] not found.`);
    const ids = req.body;
    exportNodes(container, ids, paramsCid).then(exportedNodes => {
        const { nodes, convertedParamsCid } = moveNodesToNewContainer(container, exportedNodes, paramsCid);
        removeNodes(container, ids, paramsCid).then(() => {
            app_1.default.server.editorSocket.io.emit(events_1.MOVE_TO_CONTAINER, {
                cid: paramsCid,
                nodes,
                convertedParamsCid: convertedParamsCid,
                message: 'Nodes Moved to new Container!',
            });
            res.send('Moved nodes successfully');
        }, error => {
            sendNotFoundError(res, error);
        });
    }, error => {
        sendNotFoundError(res, error);
    });
});
router.post('/c/:cid/clone', function (req, res) {
    const paramsCid = +req.params.cid;
    let container = container_1.Container.containers[paramsCid];
    if (!container)
        return res.status(404).send(`Can't clone node. Container id [${paramsCid}] not found.`);
    const { ids, pos } = req.body;
    exportNodes(container, ids, paramsCid).then(exportedNodes => {
        const nodes = importNodes(container, exportedNodes, paramsCid, pos, true);
        app_1.default.server.editorSocket.io.emit(events_1.CLONE, { cid: paramsCid, nodes, message: 'Nodes Cloned!' });
        res.send('Nodes Cloned!');
    }, error => {
        sendNotFoundError(res, error);
    });
});
router.post('/c/:cid/export', function (req, res) {
    const paramsCid = +req.params.cid;
    const container = container_1.Container.containers[paramsCid];
    if (!container)
        return res.status(404).send(`Can't export nodes. Container id [${paramsCid}] not found.`);
    exportNodes(container, req.body, paramsCid).then(output => {
        res.status(200).json(output);
    }, err => {
        res.status(404).send(err);
    });
});
router.post('/c/:cid/import', function (req, res) {
    const paramsCid = +req.params.cid;
    const container = container_1.Container.containers[paramsCid];
    if (!container)
        return res.status(404).send(`Can't import nodes. Container id [${paramsCid}] not found.`);
    const { ids, pos } = req.body;
    const nodes = importNodes(container, ids, paramsCid, pos);
    app_1.default.server.editorSocket.io.emit(events_1.IMPORT, { cid: paramsCid, nodes, message: 'Nodes Imported!' });
    res.send('Nodes Imported!');
});
router.post('/c/:cid/l', function (req, res) {
    let container = container_1.Container.containers[req.params.cid];
    if (!container) {
        return res.status(404).send(`Can't create link. Container id [${req.params.cid}] not found.`);
    }
    let link = req.body;
    let node = container.getNodeById(link.origin_id);
    let targetNode = container.getNodeById(link.target_id);
    if (!node) {
        return res.status(404).send(`Can't create link. Node id [${req.params.cid}/${link.origin_id}] not found.`);
    }
    if (!targetNode) {
        return res.status(404).send(`Can't create link. Node id [${req.params.cid}/${link.target_id}] not found.`);
    }
    if (link.target_slot === -1) {
        let input = targetNode.getInputInfo(0);
        if (!input) {
            return res
                .status(404)
                .send(`Can't create link. Node id [${req.params.cid}/${link.target_id}] has no free inputs.`);
        }
        link.target_slot = 0;
    }
    if (node.connect(link.origin_slot, targetNode.id, link.target_slot, link.target_input_id)) {
        app_1.default.server.editorSocket.io.emit('link-create', { cid: req.params.cid, link: link });
        return res.send(`Link created: from [${node.container.id}/${node.id}] to [${targetNode.container.id}/${targetNode.id}]`);
    }
    return res
        .status(400)
        .send(`Link created: from [${node.container.id}/${node.id}] to [${targetNode.container.id}/${targetNode.id}]`);
});
router.delete('/c/:cid/l', function (req, res) {
    let container = container_1.Container.containers[req.params.cid];
    if (!container)
        return res.status(404).send(`Can't delete link. Container id [${req.params.cid}] not found.`);
    let link = req.body;
    let node = container.getNodeById(link.origin_id);
    let targetNode = container.getNodeById(link.target_id);
    if (!node) {
        return res.status(404).send(`Can't delete link. Node id [${req.params.cid}/${link.origin_id}] not found.`);
    }
    if (!targetNode) {
        return res.status(404).send(`Can't delete link. Node id [${req.params.cid}/${link.target_id}] not found.`);
    }
    if (targetNode.disconnectInputLink(link.target_slot, link.target_input_id)) {
        app_1.default.server.editorSocket.io.emit('link-delete', { cid: req.params.cid, link: link });
        return res.send(`Link deleted: from [${node.container.id}/${node.id}] to [${targetNode.container.id}/${targetNode.id}]`);
    }
    return res
        .status(400)
        .send(`Cannot delete link: from [${node.container.id}/${node.id}] to [${targetNode.container.id}/${targetNode.id}]`);
});
router.get('/state', function (req, res) {
    let state = {
        isRunning: app_1.default.rootContainer.isRunning,
    };
    res.json(state);
});
router.post('/run', function (req, res) {
    app_1.default.rootContainer.run(config_1.default.loopInterval);
    app_1.default.server.editorSocket.io.emit('container-run');
    res.send(`Run container`);
});
router.post('/stop', function (req, res) {
    app_1.default.rootContainer.stop();
    app_1.default.server.editorSocket.io.emit('container-stop');
    res.send(`Stop container`);
});
router.post('/step', function (req, res) {
    app_1.default.rootContainer.runStep();
    app_1.default.server.editorSocket.io.emit('container-run-step');
    res.send(`Run step container`);
});
router.get('/c/:cid/n/:id*', function (req, res) {
    let cont = container_1.Container.containers[req.params.cid];
    if (!cont)
        return res.status(404).send(`Can't send request to node. Container id [${req.params.cid}] not found.`);
    let node = cont.getNodeById(req.params.id);
    if (!node)
        return res.status(404).send(`Can't send request to node. Node id [${req.params.cid}/${req.params.id}] not found.`);
    if (node['onEditorApiGetRequest'])
        node['onEditorApiGetRequest'](req, res);
    else
        return res
            .status(404)
            .send(`Can't send request to node. Node id [${req.params.cid}/${req.params.id}] does not accept requests.`);
});
router.post('/c/:cid/n/:id*', function (req, res) {
    let cont = container_1.Container.containers[req.params.cid];
    if (!cont)
        return res.status(404).send(`Can't send request to node. Container id [${req.params.cid}] not found.`);
    let node = cont.getNodeById(req.params.id);
    if (!node)
        return res.status(404).send(`Can't send request to node. Node id [${req.params.cid}/${req.params.id}] not found.`);
    if (node['onEditorApiPostRequest'])
        node['onEditorApiPostRequest'](req, res);
    else
        return res
            .status(404)
            .send(`Can't send request to node. Node id [${req.params.cid}/${req.params.id}] does not accept requests.`);
});
router.post('/c/:cid/n-type', function (req, res) {
    let cont = container_1.Container.containers[req.params.cid];
    if (!cont)
        return res.status(404).send(`Can't receive request to node. Container id [${req.params.cid}] not found.`);
    let type = req.body.type;
    if (!type)
        return res.status(404).send(`Can't receive request to node. Node type is not defined.`);
    let includeSubcontainers = req.body.subcontainers == true;
    let nodes = cont.getNodesByType(type, includeSubcontainers);
    if (nodes.length == 0)
        return res
            .status(404)
            .send(`Can't receive request to node. Node type [${type}] not found in container [${req.params.cid}].`);
    nodes.forEach(node => {
        if (node['onEditorApiPostRequest'])
            node['onEditorApiPostRequest'](req, res);
        else
            return res.status(404).send(`Can't receive request to node. Node type [${type}] does not accept requests.`);
    });
    if (!res.headersSent)
        res.status(400).send(`No node has processed the request.`);
});
function sendNotFoundError(res, error) {
    res.status(404).send(error);
    app_1.default.server.editorSocket.io.emit(events_1.ERROR, error);
}
function pushNewWrapperContainer(nodes, paramsCid, convertedParamsCid) {
    const containersIds = container_utils_1.default.getSortedAvailableContainers(nodes);
    const containerNodes = nodes.filter(node => node.cid == convertedParamsCid);
    const lastNodeId = Math.max(...containerNodes.map(node => +node.id));
    const newContainerNode = {
        cid: paramsCid,
        type: folder_1.CONTAINER_NODE_TYPE,
        pos: nodes[0].pos,
        sub_container: { id: containersIds[0], last_node_id: lastNodeId },
    };
    nodes.push(newContainerNode);
    return nodes;
}
function moveNodesToNewContainer(container, nodes, paramsCid) {
    const importedNodes = [];
    let convertedParamsCid;
    ({ nodes, convertedParamsCid } = container_utils_1.default.remapContainersId(container, nodes, paramsCid, null, true));
    nodes = pushNewWrapperContainer(nodes, paramsCid, convertedParamsCid);
    const containersIds = container_utils_1.default.getSortedAvailableContainers(nodes);
    container_utils_1.default.createContainersIfDoesNotExist(containersIds, container_1.Side.server);
    containersIds.forEach(cid => {
        let containerNodes = nodes.filter(node => node.cid == cid);
        container_utils_1.default.sortNodes(containerNodes);
        const container = container_1.Container.containers[cid];
        containerNodes.forEach(node => {
            const n = container.createNode(node.type, node, null, true);
            importedNodes.push(n);
            container.last_node_id = n.id;
        });
        if (container.container_node)
            container_utils_1.default.updateSubContainerLastNodeId(container, container.last_node_id);
    });
    container_utils_1.default.removeBrokenLinks(container_1.Container.containers[paramsCid]);
    container_utils_1.default.removeBrokenLinks(container_1.Container.containers[convertedParamsCid]);
    container_utils_1.default.addInputsLinkNodes(importedNodes, nodes, updateInputs);
    container_utils_1.default.addOutputsLinkNodes(importedNodes, nodes, updateOutputs);
    const outputNodes = container_utils_1.default.addSettingsValues(importedNodes, nodes, updateSettings);
    return { nodes: outputNodes, convertedParamsCid };
}
function importNodes(container, nodes, paramsCid, pos, isCloned = false) {
    const importedNodes = [];
    let containersIds = container_utils_1.default.getSortedAvailableContainers(nodes);
    const firstCid = Math.min(...containersIds);
    ({ nodes } = container_utils_1.default.remapContainersId(container, nodes, paramsCid, firstCid));
    nodes = container_utils_1.default.fallbackNodeIfDoesNotExist(nodes);
    containersIds = container_utils_1.default.getSortedAvailableContainers(nodes);
    container_utils_1.default.createContainersIfDoesNotExist(containersIds, container_1.Side.server);
    containersIds.forEach(cid => {
        let containerNodes = nodes.filter(node => node.cid == cid);
        if (cid === paramsCid) {
            const lastNodeId = container.last_node_id;
            containerNodes = container_utils_1.default.remapNodesId(container, containerNodes, cid, lastNodeId);
            containerNodes = container_utils_1.default.adjustPosition(container, containerNodes, pos, isCloned);
            container_utils_1.default.sortNodes(containerNodes);
            containerNodes.forEach(node => {
                importedNodes.push(container.createNode(node.type, node, null, true));
            });
            container.setDirtyCanvas(true, true);
        }
        else {
            const container = container_1.Container.containers[cid];
            containerNodes = container_utils_1.default.adjustPosition(container, containerNodes, pos, isCloned);
            container_utils_1.default.sortNodes(containerNodes);
            containerNodes.forEach(node => {
                const n = container.createNode(node.type, node, null, true);
                importedNodes.push(n);
                container.last_node_id = n.id;
            });
            if (container.container_node)
                container_utils_1.default.updateSubContainerLastNodeId(container, container.last_node_id);
        }
    });
    container_utils_1.default.addInputsLinkNodes(importedNodes, nodes, updateInputs);
    container_utils_1.default.addOutputsLinkNodes(importedNodes, nodes, updateOutputs);
    return container_utils_1.default.addSettingsValues(importedNodes, nodes, updateSettings);
}
function updateInputs(node) {
    if (app_1.default.db) {
        app_1.default.db.updateNode(node.id, node.cid, {
            $set: { inputs: node.inputs },
        });
    }
}
function updateOutputs(node) {
    if (app_1.default.db) {
        app_1.default.db.updateNode(node.id, node.cid, {
            $set: { outputs: node.outputs },
        });
    }
}
function updateSettings(node) {
    if (app_1.default.db) {
        app_1.default.db.updateNode(node.id, node.cid, {
            $set: { settings: node.settings },
        });
    }
}
function exportNodes(container, ids, paramsCid) {
    return new Promise((resolve, reject) => {
        container.db.getNodes((err, docs) => {
            if (!err) {
                const output = [];
                ids.forEach(id => {
                    const node = docs.find(node => node.id === id && node.cid === paramsCid);
                    if (node) {
                        output.push(node);
                        addSubContainerNodes(node, output);
                    }
                });
                resolve(output);
            }
            else {
                reject("Can't able to get nodes from DB!");
            }
            function addSubContainerNodes(node, output) {
                if (node.sub_container) {
                    docs.forEach(n => {
                        if (n.cid == node.sub_container.id) {
                            output.push(n);
                            addSubContainerNodes(n, output);
                        }
                    });
                }
            }
        });
    });
}
function removeNodes(container, ids, cid) {
    for (let id of ids) {
        const node = container.getNodeById(id);
        if (!node)
            return Promise.reject(`Can't delete node. Node id [${cid}/${id}] not found.`);
        container.removeBroadcasted(node);
    }
    return Promise.resolve();
}
module.exports = router;
//# sourceMappingURL=api-editor.js.map