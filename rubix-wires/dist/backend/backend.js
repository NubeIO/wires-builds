"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const constants_1 = require("../nodes/constants");
const container_1 = require("../nodes/container");
const datapoint_node_1 = require("../nodes/nodes/IoT/datapoint-node");
const installer_node_1 = require("../nodes/nodes/IoT/installer-node");
class Backend {
    constructor(database) {
        this.database = database;
    }
    start() {
        if (!config_1.default.backendSync.enabled) {
            return;
        }
        this.ensureParentContainers().then(() => this.refreshPeriodically());
    }
    ensureParentContainers() {
        return this.findOrCreateNode(constants_1.EDGES_PARENT_CONTAINER_TYPE, node => node instanceof datapoint_node_1.EdgesParentContainerNode)
            .then(edgesContainer => (this.edgesContainer = edgesContainer))
            .then(() => this.findOrCreateNode(constants_1.MODULES_PARENT_CONTAINER_TYPE, node => node instanceof installer_node_1.ModulesParentContainerNode))
            .then(modulesContainer => (this.modulesContainer = modulesContainer))
            .then(() => this.findOrCreateNode(constants_1.SERVICES_PARENT_CONTAINER_TYPE, node => node instanceof installer_node_1.ServicesParentContainerNode))
            .then(servicesContainer => (this.servicesContainer = servicesContainer));
    }
    findOrCreateNode(type_name, f) {
        const root = container_1.Container.containers['0'];
        return new Promise((resolve, reject) => {
            const existingNode = root.getNodes().find(f);
            if (existingNode) {
                resolve(existingNode);
            }
            else {
                const newNode = root.createNode(type_name, null, null, false, () => resolve(newNode));
            }
        });
    }
    refreshPeriodically() {
        setInterval(() => this.refreshParentContainers(), config_1.default.backendSync.nodeRefreshIntervalSeconds * 1000);
    }
    refreshParentContainers() {
        this.edgesContainer.syncWithBackend();
        this.modulesContainer.syncWithBackend();
        this.servicesContainer.syncWithBackend();
    }
}
exports.Backend = Backend;
//# sourceMappingURL=backend.js.map