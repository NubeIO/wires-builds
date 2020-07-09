"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    methods: {
        setNodeState(state) {
            this.$socket.emit('dashboardElementSetNodeState', {
                cid: this.uiElement.cid,
                id: this.uiElement.id,
                state: state,
            });
        },
    },
};
//# sourceMappingURL=setNodeState.js.map