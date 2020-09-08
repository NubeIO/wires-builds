"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketIO = require("socket.io");
const logger = require('logplease').create('heartbeat', { color: 3 });
class PingPongServerSocket {
    constructor(httpServer, io_root) {
        let socketServer = (io_root !== null && io_root !== void 0 ? io_root : SocketIO(httpServer, { path: '/heartbeat' }));
        this.io = socketServer.of(io_root ? '/heartbeat' : '/ping');
        this.io.on('connect', socket => this.listen(socket));
    }
    listen(client) {
        logger.debug(`New client ${client.id} connected into server path ${client.server.path()}`);
        logger.debug(`Handshake: ${JSON.stringify(client.handshake)}`);
        client.on('disconnect', () => {
            logger.debug(`Client ${client.id} is disconnected`);
        });
    }
}
exports.PingPongServerSocket = PingPongServerSocket;
//# sourceMappingURL=ping-pong-server-socket.js.map