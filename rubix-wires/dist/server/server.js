"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const http = require("http");
const socket = require("socket.io");
const editor_server_socket_1 = require("./editor-server-socket");
const dashboard_server_socket_1 = require("./dashboard-server-socket");
const config_1 = require("../config");
const middleware_1 = require("./middleware");
const expressValidator = require('express-validator');
const log = require('logplease').create('server', { color: 3 });
const isDev = process.env.NODE_ENV !== 'production';
const config = require('../../config.json');
class Server {
    constructor() {
        this.express = express();
        this.express.locals.moment = require('moment');
        if (isDev)
            this.connectWebPackLiveReload();
        this.middleware();
        this.routes();
        this.handleErrors();
        this.configure();
        this.start_io();
    }
    connectWebPackLiveReload() {
        const webpack = require('webpack');
        const webpackConfig = require('../../webpack.config');
        const compiler = webpack(webpackConfig);
        this.express.use(require('webpack-dev-middleware')(compiler, {
            noInfo: true,
            publicPath: webpackConfig.output.publicPath,
        }));
        this.express.use(require('webpack-hot-middleware')(compiler, {
            log: console.log,
            path: '/__webpack_hmr',
            heartbeat: 10 * 1000,
        }));
    }
    middleware() {
        if (config.webServer.debug)
            this.express.use(morgan('dev', {
                skip: function (req, res) {
                    return res.statusCode < 400;
                },
            }));
        this.express.use(bodyParser.json({ limit: '5mb' }));
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cookieParser());
        this.express.use(expressValidator());
        this.express.use('/', express.static(__dirname + '/../../static-files'));
        this.express.use('/', express.static(__dirname + '/../public'));
    }
    routes() {
        this.express.use('/api/', function (req, res, next) {
            const send = res.send;
            res.send = function (body) {
                if (![200, 201].includes(res.statusCode))
                    log.warn(body);
                send.call(this, body);
            };
            next();
        });
        this.express.use('/dashboard', middleware_1.authMiddleware(), require('./routes/dashboard'));
        this.express.use('/api/dashboard', middleware_1.authMiddleware(), require('./routes/api-dashboard'));
        this.express.use('/editor', middleware_1.authMiddleware(), require('./routes/editor'));
        this.express.use('/api/editor', middleware_1.authMiddleware(), require('./routes/api-editor'));
        this.express.use('/api/auth', require('./routes/auth'));
    }
    handleErrors() {
        this.express.use((req, res) => {
            res.status(404);
            res.json({ error: { message: 'Not Found' } });
        });
        this.express.use((err, req, res, next) => {
            log.warn(err);
            res.status(err.status || 500);
            res.json({ error: { message: err.message, error: isDev ? err : {} } });
        });
    }
    configure() {
        const port = normalizePort(config_1.default.port);
        this.express.set('port', port);
        this.server = http.createServer(this.express);
        this.server.listen(port);
        this.server.on('error', onError);
        this.server.on('listening', onListening);
        function normalizePort(val) {
            const port = typeof val === 'string' ? parseInt(val, 10) : val;
            if (isNaN(port))
                return val;
            else if (port >= 0)
                return port;
            else
                return false;
        }
        const that = this;
        function onError(error) {
            if (error.syscall !== 'listen')
                throw error;
            const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
            switch (error.code) {
                case 'EACCES':
                    console.error(`${bind} requires elevated privileges`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(`${bind} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }
        function onListening() {
            const addr = that.server.address();
            const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
            log.info(`Listening on ${bind}`);
        }
    }
    start_io() {
        const io_root = socket(this.server);
        this.editorSocket = new editor_server_socket_1.EditorServerSocket(io_root);
        this.dashboardSocket = new dashboard_server_socket_1.DashboardServerSocket(io_root);
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map