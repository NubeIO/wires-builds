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
        branch: '(HEAD',
        build: '',
        hash: '6f6eb83',
        version: '1.3.8',
    },
    bsa: {
        baseURL: '',
        username: '',
        password: '',
        paths: {
            measurement: {
                path: '',
                accept: '',
            },
            alarm: {
                path: '',
                accept: '',
                contentType: '',
            },
            device: {
                path: '',
            },
        },
    },
    ditto: {
        baseURL: '',
        username: '',
        password: '',
    },
    pg: {
        baseURL: '',
    },
    influxDb: {
        protocol: 'http',
        host: 'localhost',
        port: 8086,
        databaseName: 'db',
        username: '',
        password: '',
    },
    edge28: {
        baseURL: '',
        port: 5000,
        apiVer: '',
    },
};
const footerPrefix = `-${config.rubix.hash}${config.rubix.build && `-${config.rubix.build}`}`;
exports.footerInfo = `v${config.rubix.version}${footerPrefix}`;
exports.default = config;
//# sourceMappingURL=config.js.map