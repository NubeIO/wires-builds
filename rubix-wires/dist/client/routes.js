"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ControlPage_vue_1 = require("./control-page/ControlPage.vue");
const Welcome_vue_1 = require("./setup/Welcome.vue");
const Database_1 = require("./setup/Database");
const Admin_vue_1 = require("./setup/Admin.vue");
exports.default = [
    { name: '/', path: '/', component: ControlPage_vue_1.default },
    { name: 'setup', path: '/setup', component: Welcome_vue_1.default },
    { name: 'setup/db', path: '/setup/db', component: Database_1.default },
    { name: 'setup/admin', path: '/setup/admin', component: Admin_vue_1.default },
];
//# sourceMappingURL=routes.js.map