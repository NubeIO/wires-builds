"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../nodes/container");
const app_1 = require("../app");
const node_utils_1 = require("../nodes/node-utils");
const log = require('logplease').create('server', { color: 3 });
const SLOTS_VALUES_INTERVAL = 200;
class EditorServerSocket {
    constructor(io_root) {
        this.io_root = io_root;
        const io = io_root.of('/editor');
        this.io = io;
        io.on('connection', function (socket) {
            log.debug('New client connected to editor');
            socket.on('disconnect', () => {
                log.debug('Client disconnected from editor');
            });
            socket.on('room', function (room) {
                if (socket.room != null) {
                    socket.leave(socket.room, function () {
                        socket.room = room;
                        socket.join(room, () => {
                            log.debug('Switch editor room to [' + room + ']');
                        });
                    });
                }
                else {
                    socket.room = room;
                    socket.join(room, () => {
                        log.debug('Join to editor room [' + room + ']');
                    });
                }
            });
            socket.on('nodeMessageToServerSide', function (n) {
                let node = EditorServerSocket.checkContainerNodeValidity(n, container_1.Side.server);
                node && node['onGetMessageToServerSide'](n.message);
            });
            socket.on('nodeMessageToEditorSide', function (n) {
                let node = EditorServerSocket.checkContainerNodeValidity(n, container_1.Side.editor);
                node && app_1.default.server.editorSocket.io.in(n.cid).emit('nodeMessageToEditorSide', n);
            });
            socket.on('nodeMessageToDashboardSide', function (n) {
                let node = EditorServerSocket.checkContainerNodeValidity(n, container_1.Side.dashboard);
                node && app_1.default.server.dashboardSocket.io.in(n.cid).emit('nodeMessageToDashboardSide', n);
            });
        });
        setInterval(() => {
            this.sendSlotsValues(io);
        }, SLOTS_VALUES_INTERVAL);
    }
    sendSlotsValues(io) {
        const connectedSocket = io.connected;
        for (let key of Object.keys(connectedSocket)) {
            const room = +Object.keys(io.connected[key].rooms).filter(x => x !== key)[0];
            let slotsValues = node_utils_1.default.getNodesIOValues(room);
            io.to(room).emit('nodes-io-values', slotsValues);
        }
    }
    static checkContainerNodeValidity(n, side) {
        let cont = container_1.Container.containers[n.cid];
        if (!cont) {
            log.error(`Can't send node message to ${side}-side. Container id ["${n.cid}'] does not exist`);
            return null;
        }
        let node = cont.getNodeById(n.id);
        if (!node) {
            log.error(`Can't send node message to ${side}-side. Node id ["${n.cid}'/'${n.id}'] does not exist`);
            return null;
        }
        return node;
    }
}
exports.EditorServerSocket = EditorServerSocket;
//# sourceMappingURL=editor-server-socket.js.map