"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../config");
exports.bsaClientConfig = path => {
    var _a, _b;
    let cfg = config_1.default.bsa.paths[path];
    if (!cfg) {
        return null;
    }
    return {
        baseURL: config_1.default.bsa.baseURL,
        auth: {
            username: config_1.default.bsa.username,
            password: config_1.default.bsa.password,
        },
        url: cfg.path,
        headers: {
            'Content-Type': (_a = cfg.contentType, (_a !== null && _a !== void 0 ? _a : 'application/json')),
            'Accept': (_b = cfg.accept, (_b !== null && _b !== void 0 ? _b : 'application/json')),
        },
    };
};
//# sourceMappingURL=bsa-client-config.js.map