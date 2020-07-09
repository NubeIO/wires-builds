"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    methods: {
        sendMessageToNode(message) {
            this.$socket.emit('nodeMessageToServerSide', {
                cid: this.uiElement.cid,
                id: this.uiElement.id,
                message: message,
            });
        },
    },
};
//# sourceMappingURL=sendMessageToNode.js.map