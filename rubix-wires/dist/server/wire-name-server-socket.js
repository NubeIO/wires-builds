"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = require('logplease').create('server', { color: 3 });
class WireNameServerSocket {
    constructor(io_root) {
        this.io_root = io_root;
        const io = io_root.of('/wire-name');
        this.io = io;
        io.on('connection', function (socket) {
            log.debug('New client connected to wire');
            socket.on('disconnect', () => {
                log.debug('Client disconnected from wire');
            });
        });
    }
}
exports.WireNameServerSocket = WireNameServerSocket;
//# sourceMappingURL=wire-name-server-socket.js.map