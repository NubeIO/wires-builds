"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../nodes/container");
const app_1 = require("../app");
const log = require('logplease').create('server', { color: 3 });
class DashboardServerSocket {
    constructor(io_root) {
        this.io_root = io_root;
        const io = this.io_root.of('/dashboard');
        this.io = io;
        io.on('connection', function (socket) {
            log.debug('New client connected to dashboard');
            socket.on('disconnect', () => {
                log.debug('Client disconnected from dashboard');
            });
            socket.on('getUiPanel', name => {
                log.debug('getUiPanel: ' + name);
                socket.emit('getUiPanel', app_1.default.dashboard.getUiPanel(name));
            });
            socket.on('getUiPanelsList', () => {
                log.debug('getUiPanelsList');
                socket.emit('getUiPanelsList', app_1.default.dashboard.getUiPanelsList());
            });
            socket.on('nodeMessageToServerSide', n => {
                let cont = container_1.Container.containers[n.cid];
                if (!cont) {
                    log.error("Can't send node message to server-side. Container id [" + n.cid + '] does not exist');
                    return;
                }
                let node = cont.getNodeById(n.id);
                if (!node) {
                    log.error("Can't send node message to server-side. Node id [" +
                        n.cid +
                        '/' +
                        n.id +
                        '] does not exist');
                    return;
                }
                if (!node['onGetMessageToServerSide']) {
                    log.error("Can't send node message to server-side. Node " +
                        node.getReadableId() +
                        'dont have onGetMessageToServerSide method!');
                    return;
                }
                node['onGetMessageToServerSide'](n.message);
            });
            socket.on('nodeMessageToEditorSide', n => {
                let cont = container_1.Container.containers[n.cid];
                if (!cont) {
                    log.error("Can't send node message to editor-side. Container id [" + n.cid + '] does not exist');
                    return;
                }
                let node = cont.getNodeById(n.id);
                if (!node) {
                    log.error("Can't send node message to editor-side. Node id [" +
                        n.cid +
                        '/' +
                        n.id +
                        '] does not exist');
                    return;
                }
                app_1.default.server.editorSocket.io.in(n.cid).emit('nodeMessageToEditorSide', n);
            });
            socket.on('nodeMessageToDashboardSide', n => {
                let cont = container_1.Container.containers[n.cid];
                if (!cont) {
                    log.error("Can't send node message to dashboard-side. Container id [" +
                        n.cid +
                        '] does not exist');
                    return;
                }
                let node = cont.getNodeById(n.id);
                if (!node) {
                    log.error("Can't send node message to dashboard-side. Node id [" +
                        n.cid +
                        '/' +
                        n.id +
                        '] does not exist');
                    return;
                }
                app_1.default.server.dashboardSocket.io.in(n.cid).emit('nodeMessageToDashboardSide', n);
            });
            socket.on('nodeSettings', n => {
                let cont = container_1.Container.containers[n.cid];
                if (!cont) {
                    log.error("Can't update node settings. Container id [" + n.cid + '] does not exist');
                    return;
                }
                let node = cont.getNodeById(n.id);
                if (!node) {
                    log.error("Can't update node settings. Node id [" + n.cid + '/' + n.id + '] does not exist');
                    return;
                }
                let oldName = node.name;
                let oldSettings = JSON.parse(JSON.stringify(node.settings));
                if (node['onBeforeSettingsChange'])
                    node['onBeforeSettingsChange'](n.settings, n.name);
                for (let key in n.settings) {
                    let s = n.settings[key];
                    try {
                        node.settings[key].value = s.value;
                    }
                    catch (error) {
                        log.error(error);
                    }
                }
                node.name = n.name;
                Promise.resolve(node['onAfterSettingsChange'](oldSettings, oldName)).then(() => {
                    const args = {
                        id: n.id,
                        cid: n.cid,
                        settings: node.settings,
                        name: n.name,
                        oldSettings: oldSettings,
                        oldName: oldName
                    };
                    app_1.default.server.editorSocket.io.emit('nodeSettings', args);
                    if (node.isDashboardNode) {
                        app_1.default.server.dashboardSocket.io.in(n.cid).emit('nodeSettings', args);
                    }
                    if (app_1.default.db)
                        app_1.default.db.updateNode(node.id, node.container.id, {
                            $set: { settings: node.settings, name: node.name },
                        });
                });
            });
            socket.on('dashboardElementGetNodeState', n => {
                let cont = container_1.Container.containers[n.cid];
                if (!cont) {
                    log.error("Can't get dashboard element state. Container id [" + n.cid + '] does not exist');
                    return;
                }
                let node = cont.getNodeById(n.id);
                if (!node) {
                    log.error("Can't get dashboard element state. Node id [" +
                        n.cid +
                        '/' +
                        n.id +
                        '] does not exist');
                    return;
                }
                if (node['onDashboardElementGetNodeState']) {
                    node['onDashboardElementGetNodeState'](n.options);
                }
                else {
                    let m = { id: node.id, cid: node.container.id, state: node.properties['state'] };
                    socket.emit('dashboardElementGetNodeState', m);
                }
            });
            socket.on('dashboardElementSetNodeState', n => {
                let cont = container_1.Container.containers[n.cid];
                if (!cont) {
                    log.error("Can't set node state from dashboard element. Container id [" +
                        n.cid +
                        '] does not exist');
                    return;
                }
                let node = cont.getNodeById(n.id);
                if (!node) {
                    log.error("Can't set node state from dashboard element. Node id [" +
                        n.cid +
                        '/' +
                        n.id +
                        '] does not exist');
                    return;
                }
                if (node['onDashboardElementSetNodeState']) {
                    node['onDashboardElementSetNodeState'](n.state);
                }
                else {
                    node.properties['state'] = n.state;
                    let m = { id: node.id, cid: node.container.id, state: node.properties['state'] };
                    let panelName = this.settings['ui-panel'].value;
                    io.in('' + panelName).emit('dashboardElementGetNodeState', m);
                }
            });
            socket.on('join-room', room => {
                if (socket.room != null) {
                    log.debug('Leave dashboard room [' + socket.room + ']');
                    socket.leave(socket.room, () => {
                        socket.room = room;
                        socket.join(room, () => {
                            log.debug('Join to dashboard room [' + room + ']');
                        });
                    });
                }
                else {
                    socket.room = room;
                    socket.join(room, () => {
                        log.debug('Join to dashboard room [' + room + ']');
                    });
                }
            });
            socket.on('leave-room', room => {
                socket.leave(room, () => {
                    log.debug('Leave dashboard room [' + room + ']');
                });
                socket.room = null;
            });
        });
    }
}
exports.DashboardServerSocket = DashboardServerSocket;
//# sourceMappingURL=dashboard-server-socket.js.map