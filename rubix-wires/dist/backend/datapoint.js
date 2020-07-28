"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const entry_1 = require("./entry");
class EdgeAPI extends api_1.Api {
    list(_objId) {
        return this.fetchMany('edge', 'edges');
    }
    get(objId) {
        return this.fetchOne(`edge/${objId}`);
    }
    create(obj) {
        throw new Error('Method not implemented.');
    }
    update(obj, objId) {
        return this.client.patch(`edge/${objId}`, obj);
    }
    delete(objId) {
        throw new Error('Method not implemented.');
    }
    factoryEntry() {
        return this.newEntry(entry_1.Edge);
    }
}
exports.EdgeAPI = EdgeAPI;
class NetworkAPI extends api_1.Api {
    list(objId) {
        return this.fetchMany(`edge/${objId}/network`, 'networks');
    }
    get(objId) {
        return this.fetchOne(`network/${objId}`);
    }
    create(obj, parentId) {
        return this.client.post(`edge/${parentId}/network`, obj).then(this.extractData('resource'));
    }
    update(obj, objId) {
        return this.client.patch(`network/${objId}`, obj);
    }
    delete(objId) {
        return this.client.delete(`network/${objId}?_force=true`);
    }
    factoryEntry() {
        return this.newEntry(entry_1.Network);
    }
}
exports.NetworkAPI = NetworkAPI;
class DeviceAPI extends api_1.Api {
    factoryEntry() {
        return this.newEntry(entry_1.Device);
    }
    list(objId) {
        return this.client.get(`network/${objId}/device`)
            .then(this.extractData('devices'))
            .then(v => v.map(d => d.device))
            .then(this.assignAllTo(() => new entry_1.Device()));
    }
    get(objId) {
        return this.fetchOne(`device/${objId}`);
    }
    create(obj, parentId) {
        return this.client.post(`network/${parentId}/device`, obj).then(this.extractData('resource.device'));
    }
    update(obj, objId) {
        return this.client.patch(`device/${objId}`, obj);
    }
    delete(objId) {
        return this.client.delete(`device/${objId}?_force=true`);
    }
}
exports.DeviceAPI = DeviceAPI;
class FolderAPI extends api_1.Api {
    list(objId) {
        return this.fetchMany(`device/${objId}/folder`, 'folders');
    }
    get(objId) {
        return this.fetchOne(`folder/${objId}`);
    }
    create(obj, parentId) {
        return this.client.post(`device/${parentId}/folder`, obj).then(this.extractData('resource'));
    }
    update(obj, objId) {
        return this.client.patch(`folder/${objId}`, obj);
    }
    delete(objId) {
        return this.client.delete(`folder/${objId}?_force=true`);
    }
    factoryEntry() {
        return this.newEntry(entry_1.Folder);
    }
}
exports.FolderAPI = FolderAPI;
class PointAPI extends api_1.Api {
    factoryEntry() {
        return this.newEntry(entry_1.Point);
    }
    list(objId) {
        return this.fetchMany(`folder/${objId}/point`, 'points');
    }
    get(objId) {
        return this.fetchOne(`point/${objId}`);
    }
    create(obj, parentId) {
        return this.client.post(`folder/${parentId}/point`, obj).then(this.extractData('resource.point'));
    }
    update(obj, objId) {
        return this.client.patch(`point/${objId}`, obj);
    }
    delete(objId) {
        return this.client.delete(`point/${objId}?_force=true`);
    }
    fetchPointData(pointId) {
        return this.client.get(`point/${pointId}/data`).then(this.extractData());
    }
    updatePointData(pointId, priority, value) {
        return this.client.put(`point/${pointId}/data`, { priority, value });
    }
}
exports.PointAPI = PointAPI;
//# sourceMappingURL=datapoint.js.map