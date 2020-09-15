"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../nodes/container");
const io = require("socket.io-client");
const utils_1 = require("../../nodes/utils");
const events_1 = require("../../events");
const container_utils_1 = require("../../nodes/container-utils");
const AjaxRequest_1 = require("../helpers/AjaxRequest");
const log = require('logplease').create('editor-socket', { color: 3 });
class EditorClientSocket {
    constructor(editor) {
        this.editor = editor;
        let socket = io('/editor');
        this.socket = socket;
        socket.on('connect', () => {
            log.debug('Connected to socket');
            this.sendJoinContainerRoom(this.editor.renderer.container.id);
        });
        socket.on('disconnect', () => {
            log.debug('Disconnected');
        });
        socket.on('node-create', n => {
            let container = container_1.Container.containers[n.cid];
            if (!container) {
                log.error(`Can't create node. Container id [${n.cid}] not found.`);
                return;
            }
            let prop = { pos: n.pos };
            if (n.properties)
                prop['properties'] = n.properties;
            let node = container.createNode(n.type, prop);
            this.editor.conditionalEditorChangeContainer(node);
        });
        socket.on('nodes-delete', data => {
            let container = container_1.Container.containers[data.cid];
            if (!container) {
                log.error(`Can't delete node. Container id [${data.cid}] not found.`);
                return;
            }
            for (let id of data.nodes) {
                let node = container.getNodeById(id);
                if (!node) {
                    log.error(`Can't delete node. Node id [${data.cid}/${id}] not found.`);
                    return;
                }
                container.remove(node);
                this.editor.conditionalEditorChangeContainer(node);
            }
        });
        socket.on('node-add-input', n => {
            let container = container_1.Container.containers[n.cid];
            if (!container) {
                log.error(`Can't update node. Container id [${n.cid}] not found.`);
                return;
            }
            let node = container.getNodeById(n.id);
            if (!node) {
                log.error(`Can't update node. Node id [${n.cid}/${n.id}] not found.`);
                return;
            }
            node.addInput(n.input.name, n.input.type, n.input.extra_info);
            node.setDirtyCanvas(true, true);
        });
        socket.on('node-add-output', n => {
            let container = container_1.Container.containers[n.cid];
            if (!container) {
                log.error(`Can't update node. Container id [${n.cid}] not found.`);
                return;
            }
            let node = container.getNodeById(n.id);
            if (!node) {
                log.error(`Can't update node. Node id [${n.cid}/${n.id}] not found.`);
                return;
            }
            node.addOutput(n.output.name, n.output.type, n.output.extra_info);
            node.setDirtyCanvas(true, true);
        });
        socket.on('node-remove-input', n => {
            let container = container_1.Container.containers[n.cid];
            if (!container) {
                log.error(`Can't update node. Container id [${n.cid}] not found.`);
                return;
            }
            let node = container.getNodeById(n.id);
            if (!node) {
                log.error(`Can't update node. Node id [${n.cid}/${n.id}] not found.`);
                return;
            }
            node.removeInput(n.input);
            node.setDirtyCanvas(true, true);
        });
        socket.on('node-remove-output', n => {
            let container = container_1.Container.containers[n.cid];
            if (!container) {
                log.error(`Can't update node. Container id [${n.cid}] not found.`);
                return;
            }
            let node = container.getNodeById(n.id);
            if (!node) {
                log.error(`Can't update node. Node id [${n.cid}/${n.id}] not found.`);
                return;
            }
            node.removeOutput(n.output);
            node.setDirtyCanvas(true, true);
        });
        socket.on('node-update-position', n => {
            let container = container_1.Container.containers[n.cid];
            if (!container) {
                log.error(`Can't update node. Container id [${n.cid}] not found.`);
                return;
            }
            let node = container.getNodeById(n.id);
            if (!node) {
                log.error(`Can't update node. Node id [${n.cid}/${n.id}] not found.`);
                return;
            }
            if (node.pos != n.pos) {
                node.pos = n.pos;
                node.setDirtyCanvas(true, true);
            }
        });
        socket.on('node-update-size', n => {
            let container = container_1.Container.containers[n.cid];
            if (!container) {
                log.error(`Can't update node. Container id [${n.cid}] not found.`);
                return;
            }
            let node = container.getNodeById(n.id);
            if (!node) {
                log.error(`Can't update node. Node id [${n.cid}/${n.id}] not found.`);
                return;
            }
            if (node.pos != n.pos) {
                node.size = n.size;
                node.setDirtyCanvas(true, true);
            }
        });
        socket.on('node-update-collapsed', n => {
            let container = container_1.Container.containers[n.cid];
            if (!container) {
                log.error(`Can't update node. Container id [${n.cid}] not found.`);
                return;
            }
            let node = container.getNodeById(n.id);
            if (!node) {
                log.error(`Can't update node. Node id [${n.cid}/${n.id}] not found.`);
                return;
            }
            if (node.flags.collapsed != n.flags.collapsed) {
                node.flags.collapsed = n.flags.collapsed;
                node.setDirtyCanvas(true, true);
            }
        });
        socket.on('nodeSettings', n => {
            var _a, _b;
            let container = container_1.Container.containers[n.cid];
            if (!container) {
                log.error(`Can't set node settings. Container id [${n.cid}] not found.`);
                return;
            }
            let node = container.getNodeById(n.id);
            if (!node) {
                log.error(`Can't set node settings. Node id [${n.cid}/${n.id}] not found.`);
                return;
            }
            let oldName = (_a = n.oldName, (_a !== null && _a !== void 0 ? _a : node.name));
            let oldSettings = (_b = n.oldSettings, (_b !== null && _b !== void 0 ? _b : JSON.parse(JSON.stringify(node.settings))));
            if (node['onBeforeSettingsChange'])
                node['onBeforeSettingsChange'](n.settings, n.name);
            node.settings = node.settingsWithValidation(n.settings);
            node.name = n.name;
            node['onAfterSettingsChange'](oldSettings, oldName);
            node.setDirtyCanvas(true, true);
            this.editor.conditionalEditorChangeContainer(node);
            this.editor.showNodeSettingsIfLocked(node);
        });
        socket.on('nodeMessageToEditorSide', n => {
            let container = container_1.Container.containers[n.cid];
            if (!container) {
                log.error(`Can't send node message. Container id [${n.cid}] not found.`);
                return;
            }
            let node = container.getNodeById(n.id);
            if (!node) {
                log.error(`Can't send node message. Node id [${n.cid}/${n.id}] not found.`);
                return;
            }
            if (node['onGetMessageToEditorSide'])
                node['onGetMessageToEditorSide'](n.message);
        });
        socket.on('link-create', data => {
            let container = container_1.Container.containers[data.cid];
            if (!container) {
                log.error(`Can't create link. Container id [${data.cid}] not found.`);
                return;
            }
            let node = container.getNodeById(data.link.origin_id);
            if (!node) {
                log.error(`Can't create link. Node id [${data.cid}/${data.id}] not found.`);
                return;
            }
            node.connect(data.link.origin_slot, data.link.target_id, data.link.target_slot, data.link.target_input_id);
        });
        socket.on('link-delete', data => {
            let container = container_1.Container.containers[data.cid];
            if (!container) {
                log.error(`Can't delete link. Container id [${data.cid}] not found.`);
                return;
            }
            let node = container.getNodeById(data.link.target_id);
            if (!node) {
                log.error(`Can't delete link. Node id [${data.cid}/${data.id}] not found.`);
                return;
            }
            node.disconnectInputLink(data.link.target_slot, data.link.target_input_id);
        });
        socket.on(events_1.CLONE, res => {
            const { cid, nodes, message } = res;
            const selectedNodes = container_utils_1.default.reRenderNodes(cid, nodes);
            this.editor.onCloned(selectedNodes, message);
        });
        socket.on(events_1.IMPORT, res => {
            const { cid, nodes, message } = res;
            const selectedNodes = container_utils_1.default.reRenderNodes(cid, nodes);
            this.editor.onImport(cid, selectedNodes, message);
        });
        socket.on(events_1.MOVE_TO_CONTAINER, res => {
            const selectedNodes = container_utils_1.default.reRenderNodes(res.cid, res.nodes);
            container_utils_1.default.removeBrokenLinks(container_1.Container.containers[res.cid]);
            container_utils_1.default.removeBrokenLinks(container_1.Container.containers[res.convertedParamsCid]);
            this.editor.onMoveToContainer(selectedNodes, res.message);
        });
        socket.on(events_1.ERROR, error => this.editor.displayError(error));
        socket.on(events_1.NOTIFICATION, message => this.editor.displayMessage(message));
        socket.on('container-run', l => {
            this.editor.onContainerRun();
        });
        socket.on('container-run-step', l => {
            this.editor.onContainerRunStep();
        });
        socket.on('container-stop', l => {
            this.editor.onContainerStop();
        });
        let activeNodes = [];
        let activedNodes = [];
        socket.on('nodes-active', data => {
            for (let id of data.ids) {
                activeNodes.push(id);
            }
        });
        let activityState = false;
        setInterval(() => {
            activityState = !activityState;
            if (activityState && activeNodes.length > 0) {
                let container = this.editor.renderer.container;
                for (let id of activeNodes) {
                    let node = container.getNodeById(id);
                    if (!node)
                        continue;
                    node.boxcolor = this.editor.renderer.theme.NODE_ACTIVE_BOXCOLOR;
                    node.setDirtyCanvas(true, true);
                }
                activedNodes = activeNodes;
                activeNodes = [];
            }
            else if (!activityState && activedNodes.length > 0) {
                let container = this.editor.renderer.container;
                for (let id of activedNodes) {
                    let node = container.getNodeById(id);
                    if (!node)
                        continue;
                    node.boxcolor = this.editor.renderer.theme.NODE_DEFAULT_BOXCOLOR;
                    node.setDirtyCanvas(true, true);
                }
                activedNodes = [];
            }
        }, 125);
        socket.on('nodes-io-values', slots_values => {
            if (!this.editor.showNodesIOValues)
                return;
            let container = container_1.Container.containers[slots_values.cid];
            if (!container)
                return;
            if (slots_values.inputs) {
                for (let slot of slots_values.inputs) {
                    let node = container.getNodeById(slot.nodeId);
                    if (!node)
                        continue;
                    node.inputs[slot.inputId].label = utils_1.default.formatNodeInOut(utils_1.default.parseValue(slot.data, slot.type));
                    node.setDirtyCanvas(true, false);
                }
            }
            if (slots_values.outputs) {
                for (let slot of slots_values.outputs) {
                    let node = container.getNodeById(slot.nodeId);
                    if (!node)
                        continue;
                    node.outputs[slot.outputId].label = utils_1.default.formatNodeInOut(slot.data);
                    node.setDirtyCanvas(true, false);
                }
            }
        });
    }
    configureNodes(callback) {
        let root_id = 0;
        AjaxRequest_1.default.ajax({
            url: '/api/editor/c/' + root_id,
            success: function (nodes) {
                let rootContainer = container_1.Container.containers[root_id];
                rootContainer.configure(nodes, false);
                if (callback)
                    callback();
            },
        });
    }
    getContainerState() {
        let that = this;
        AjaxRequest_1.default.ajax({
            url: '/api/editor/state',
            success: function (state) {
                if (state.isRunning) {
                    that.editor.onContainerRun();
                }
                else {
                    that.editor.onContainerStop();
                }
            },
        });
    }
    sendCreateNode(type, position) {
        let that = this;
        let json = JSON.stringify({
            type: type,
            position: position,
            container: that.editor.renderer.container.id,
        });
        AjaxRequest_1.default.ajax({
            url: '/api/editor/c/' + that.editor.renderer.container.id + '/n/',
            contentType: 'application/json',
            type: 'POST',
            data: json,
        });
    }
    sendRemoveNodes(ids) {
        let that = this;
        AjaxRequest_1.default.ajax({
            url: '/api/editor/c/' + that.editor.renderer.container.id + '/n/',
            type: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify(ids),
        });
    }
    sendMoveToNewContainer(ids) {
        let that = this;
        AjaxRequest_1.default.ajax({
            url: '/api/editor/c/' + that.editor.renderer.container.id + '/move',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(ids),
        });
    }
    sendCloneNode(ids, pos) {
        let that = this;
        AjaxRequest_1.default.ajax({
            url: '/api/editor/c/' + that.editor.renderer.container.id + '/clone',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ ids, pos }),
        });
    }
    sendExportNode(ids) {
        let that = this;
        return AjaxRequest_1.default.ajax({
            url: '/api/editor/c/' + that.editor.renderer.container.id + '/export',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(ids),
        });
    }
    sendUpdateNodePosition(node) {
        let that = this;
        AjaxRequest_1.default.ajax({
            url: `/api/editor/c/${that.editor.renderer.container.id}/n/${node.id}/position`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify({ position: node.pos }),
        });
    }
    sendUpdateNodeSize(node) {
        let that = this;
        AjaxRequest_1.default.ajax({
            url: `/api/editor/c/${that.editor.renderer.container.id}/n/${node.id}/size`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify({ size: node.size }),
        });
    }
    sendUpdateNodeCollapse(node) {
        let that = this;
        AjaxRequest_1.default.ajax({
            url: `/api/editor/c/${that.editor.renderer.container.id}/n/${node.id}/collapse`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify({ collapsed: node.flags.collapsed }),
        });
    }
    sendCreateLink(origin_id, origin_slot, target_id, target_slot, target_index) {
        this.requestLink('POST', origin_id, origin_slot, target_id, target_slot, target_index);
    }
    sendRemoveLink(origin_id, origin_slot, target_id, target_slot, target_index) {
        this.requestLink('DELETE', origin_id, origin_slot, target_id, target_slot, target_index);
    }
    requestLink(action, origin_id, origin_slot, target_id, target_slot, target_index) {
        let data = {
            origin_id: origin_id,
            origin_slot: origin_slot,
            target_id: target_id,
            target_slot: target_slot,
            target_input_id: target_index,
        };
        let that = this;
        AjaxRequest_1.default.ajax({
            url: '/api/editor/c/' + that.editor.renderer.container.id + '/l/',
            type: action,
            contentType: 'application/json',
            data: JSON.stringify(data),
        });
    }
    sendRunContainer() {
        AjaxRequest_1.default.ajax({ url: '/api/editor/run', type: 'POST' });
    }
    sendStopContainer() {
        AjaxRequest_1.default.ajax({ url: '/api/editor/stop', type: 'POST' });
    }
    sendStepContainer() {
        AjaxRequest_1.default.ajax({ url: '/api/editor/step', type: 'POST' });
    }
    sendJoinContainerRoom(cont_id) {
        log.debug('Join to editor room [' + cont_id + ']');
        this.socket.emit('room', cont_id);
    }
}
exports.EditorClientSocket = EditorClientSocket;
//# sourceMappingURL=editor-client-socket.js.map