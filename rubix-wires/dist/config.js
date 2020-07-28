"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    secretKey: '__SECRET_KEY__',
    port: 1313,
    dataDir: '/data/rubix-wires',
    loopInterval: 100,
    backendSync: {
        enabled: false,
        baseUrl: 'http://localhost:8080/api/',
        nodeRefreshIntervalSeconds: 60,
        pointRefreshIntervalSeconds: 60,
        nodeDistance: 60,
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map