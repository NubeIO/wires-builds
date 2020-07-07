"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../nodes/container");
const iot_1 = require("../nodes/nodes/iot");
const constants_1 = require("../nodes/constants");
const { remoteApi, backendSync } = require('../../config.json');
class Backend {
    constructor(database) {
        this.database = database;
    }
    start() {
        console.log('Starting backend.......');
        this.ensureParentContainers().then(() => this.refreshPeriodically());
    }
    ensureParentContainers() {
        return this.findOrCreateNode(constants_1.EDGES_PARENT_CONTAINER_TYPE, node => node instanceof iot_1.EdgesParentContainerNode)
            .then(edgesContainer => {
            this.edgesContainer = edgesContainer;
        })
            .then(modulesContainer => {
        });
    }
    findOrCreateNode(type_name, f) {
        const root = container_1.Container.containers['0'];
        return new Promise((resolve, reject) => {
            const existingNode = root.getNodes().find(f);
            if (existingNode)
                resolve(existingNode);
            else {
                const newNode = root.createNode(type_name, null, null, false, () => resolve(newNode));
            }
        });
    }
    refreshPeriodically() {
        setInterval(() => this.refreshParentContainers(), backendSync.nodeRefreshIntervalSeconds * 1000);
    }
    refreshParentContainers() {
        this.edgesContainer.syncWithBackend();
        this.modulesContainer.syncWithBackend();
    }
}
exports.Backend = Backend;
//# sourceMappingURL=backend.js.map