"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../nodes/constants");
class NormalEntry {
    entryId() {
        return this.id;
    }
    identifier() {
        return this.code;
    }
    nodeType() {
        return this._nodeType;
    }
    label() {
        return this.identifier() || this.entryId();
    }
}
class Edge extends NormalEntry {
    constructor() {
        super(...arguments);
        this._nodeType = constants_1.EDGE_CONTAINER_TYPE;
    }
}
exports.Edge = Edge;
class Network extends NormalEntry {
    constructor() {
        super(...arguments);
        this._nodeType = constants_1.NETWORK_CONTAINER_TYPE;
    }
}
exports.Network = Network;
class Device extends NormalEntry {
    constructor() {
        super(...arguments);
        this._nodeType = constants_1.DEVICE_CONTAINER_TYPE;
    }
}
exports.Device = Device;
class Folder extends NormalEntry {
    constructor() {
        super(...arguments);
        this._nodeType = constants_1.GROUP_CONTAINER_TYPE;
    }
    label() {
        return this.name || super.label();
    }
}
exports.Folder = Folder;
class Point extends NormalEntry {
    constructor() {
        super(...arguments);
        this._nodeType = constants_1.POINT_NODE_TYPE;
    }
}
exports.Point = Point;
class Service {
    constructor() {
        this._nodeType = constants_1.MODULE_NODE_TYPE;
    }
    entryId() {
        return this.service_id;
    }
    identifier() {
        return this.service_name;
    }
    nodeType() {
        return this._nodeType;
    }
    label() {
        return `${this.identifier()} ${this.version}` || this.entryId();
    }
}
exports.Service = Service;
class PointData {
}
exports.PointData = PointData;
//# sourceMappingURL=entry.js.map