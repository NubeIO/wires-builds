"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('source-map-support').install();
const config = require('../config.json');
const config_1 = require("./config");
const server_1 = require("./server/server");
const backend_1 = require("./backend/backend");
const container_1 = require("./nodes/container");
const dashboard_1 = require("./server/dashboard");
const path = require("path");
global.__rootdirname = path.resolve(__dirname);
const log = require('logplease').create('app', { color: 2 });
log.info('----------------------------- Rubix Wires -----------------------------');
class App {
    constructor() {
        this.createServer();
        this.start();
    }
    start() {
        if (!this.rootContainer) {
            this.registerNodes();
            this.createRootContainer();
        }
        this.dashboard = new dashboard_1.Dashboard(this.server.dashboardSocket);
        if (config.dataBase.enable) {
            if (!this.db)
                this.connectDatabase();
            if (this.db)
                this.loadDatabase(true);
        }
        if (this.rootContainer) {
            if (this.db)
                this.rootContainer.db = this.db;
            if (this.dashboard)
                this.rootContainer.dashboard = this.dashboard;
        }
        this.rootContainer.run(config_1.default.loopInterval);
    }
    createServer() {
        this.server = new server_1.Server();
    }
    registerNodes() {
        require('./nodes/nodes/index');
        const types = container_1.Container.nodes_types ? Object.keys(container_1.Container.nodes_types).length : 0;
        log.debug('Registered ' + types + ' nodes types');
    }
    createRootContainer() {
        this.rootContainer = new container_1.Container(container_1.Side.server);
        if (this.server.editorSocket)
            this.rootContainer.server_editor_socket = this.server.editorSocket.io;
        if (this.server.dashboardSocket)
            this.rootContainer.server_dashboard_socket = this.server.dashboardSocket.io;
    }
    connectDatabase() {
        let db;
        if (config.dataBase.useInternalDb)
            db = require('./database/neDbDatabase').db;
        else
            throw 'External db not implementer yet';
        this.db = db;
    }
    loadDatabase(importNodes) {
        this.db.asyncLoadDatabase().then(res => {
            this.onDbLoadSuccess(res, importNodes);
        });
    }
    onDbLoadSuccess(res, importNodes) {
        if (!importNodes)
            return;
        this.db.getLastContainerId((err, id) => {
            if (id)
                container_1.Container.last_container_id = id;
        });
        this.db.getLastRootNodeId((err, id) => {
            if (id)
                app.rootContainer.last_node_id = id;
        });
        this.db.getNodes((err, ser_nodes) => {
            if (!ser_nodes)
                return;
            let containers = container_1.Container.containers;
            let nodesCount = 0;
            for (let n of ser_nodes) {
                let cont = containers[n.cid];
                if (!cont)
                    cont = new container_1.Container(container_1.Side.server, n.cid);
                nodesCount++;
                cont.createNode(n.type, null, n);
            }
            for (let cid in container_1.Container.containers) {
                let container = container_1.Container.containers[cid];
                for (let id in container._nodes) {
                    let node = container._nodes[id];
                    if (node['onDbReaded'])
                        node['onDbReaded']();
                }
            }
            this.dashboard.loadFromDatabase(this.db);
            let contCount = Object.keys(containers).length;
            if (containers[0])
                contCount--;
            log.info('Imported ' + contCount + ' containers, ' + nodesCount + ' nodes from database');
            setTimeout(() => this.startBackend(), 1);
        });
    }
    startBackend() {
        const backend = new backend_1.Backend(this.db);
        backend.start();
    }
}
exports.App = App;
let app = new App();
exports.default = app;
//# sourceMappingURL=app.js.map