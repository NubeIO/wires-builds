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
    rubix: {
        branch: 'master',
        build: '',
        hash: '9150d15',
        version: '1.2.5',
    },
};
const footerPrefix = `-${config.rubix.hash}${config.rubix.build && `-${config.rubix.build}`}
`;
exports.footerInfo = `v${config.rubix.version}${footerPrefix}`;
exports.default = config;
//# sourceMappingURL=config.js.map