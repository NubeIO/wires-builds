"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const vue_router_1 = require("vue-router");
const App_vue_1 = require("./App.vue");
const routes_1 = require("./routes");
const vue_socket_io_1 = require("vue-socket.io");
const vue_moment_1 = require("vue-moment");
const vuebar_1 = require("vuebar");
const vue_cookie_1 = require("vue-cookie");
const vuetify_1 = require("./plugins/vuetify");
const vue_toasted_1 = require("vue-toasted");
window.jQuery = require('jquery');
window.$ = require('jquery');
vue_1.default.use(vue_router_1.default);
vue_1.default.use(vue_socket_io_1.default, '/dashboard');
vue_1.default.use(vue_moment_1.default);
vue_1.default.use(vuebar_1.default);
vue_1.default.use(vue_cookie_1.default);
vue_1.default.use(vue_toasted_1.default, { duration: 2000, keepOnHover: true, position: 'bottom-right' });
const router = new vue_router_1.default({
    routes: routes_1.default,
});
new vue_1.default({
    el: '#app',
    render: h => h(App_vue_1.default),
    router: router,
    vuetify: vuetify_1.default,
    sockets: {
        connect() {
            console.log('socket connected');
        },
    },
});
//# sourceMappingURL=main.js.map