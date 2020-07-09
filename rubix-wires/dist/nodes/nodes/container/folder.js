"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const container_node_1 = require("../../container-node");
exports.CONTAINER_NODE_TYPE = 'container/folder';
container_1.Container.registerNodeType(exports.CONTAINER_NODE_TYPE, container_node_1.ContainerNode, null, true, true);
//# sourceMappingURL=folder.js.map