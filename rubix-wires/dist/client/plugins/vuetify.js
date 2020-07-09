"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const vuetify_1 = require("vuetify");
require("vuetify/dist/vuetify.min.css");
const colors_1 = require("vuetify/lib/util/colors");
vue_1.default.use(vuetify_1.default);
const opts = {
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: colors_1.default.blue.darken2,
                accent: colors_1.default.red.accent2,
                secondary: colors_1.default.grey.lighten1,
                info: colors_1.default.blue.lighten1,
                warning: colors_1.default.amber.darken2,
                error: colors_1.default.red.accent4,
                success: colors_1.default.green.lighten2,
            },
        },
    },
};
exports.default = new vuetify_1.default(opts);
//# sourceMappingURL=vuetify.js.map