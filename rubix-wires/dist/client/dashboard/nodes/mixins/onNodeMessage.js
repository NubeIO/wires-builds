"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    mounted() {
        this.$options.sockets.nodeMessageToDashboardSide = data => {
            if (this.uiElement.cid === data.cid && this.uiElement.id === data.id) {
                if (this['onNodeMessage']) {
                    this.onNodeMessage(data.message);
                }
                else {
                    console.error('Cant receive message from server side. Please, add "onNodeMessage" method to dashboard vue-node, that use onNodeMessage mixin');
                }
            }
        };
    },
    beforeDestroy() {
        delete this.$options.sockets.nodeMessageToDashboardSide;
    },
};
//# sourceMappingURL=onNodeMessage.js.map