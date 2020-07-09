"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    created() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleResize() {
            this.window.width = window.innerWidth;
            this.window.height = window.innerHeight;
        },
    },
};
//# sourceMappingURL=onResize.js.map