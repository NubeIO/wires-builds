"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    methods: {
        getNodeState(options) {
            this.$socket.emit('dashboardElementGetNodeState', {
                cid: this.uiElement.cid,
                id: this.uiElement.id,
                options: options,
            });
        },
    },
    mounted() {
        this.$options.sockets.dashboardElementGetNodeState = data => {
            if (this.uiElement.cid === data.cid && this.uiElement.id === data.id) {
                this.state = data.state;
                this.stateReceived = true;
            }
        };
        this.getNodeState();
    },
    beforeDestroy() {
        delete this.$options.sockets.dashboardElementGetNodeState;
    },
};
//# sourceMappingURL=getNodeState.js.map