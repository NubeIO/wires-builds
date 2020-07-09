"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const utils_1 = require("../nodes/utils");
const { remoteApi } = require('../../config.json');
const { renameKey } = utils_1.default;
class Api {
    constructor() {
        this.client = axios_1.default.create({ baseURL: remoteApi.baseUrl });
    }
    fetchEdges() {
        return this.client
            .get('edge')
            .then(this.extractData)
            .then(v => v.edges);
    }
    fetchNetworksByDevice(deviceId) {
        return this.client
            .get(`edge/${deviceId}/network`)
            .then(this.extractData)
            .then(v => v.networks);
    }
    fetchDevicesByNetwork(networkId) {
        return this.client
            .get(`network/${networkId}/device`)
            .then(this.extractData)
            .then(v => v.devices.map(d => d.device));
    }
    fetchThingsByDevice(deviceId) {
        return this.client
            .get(`device/${deviceId}/thing`)
            .then(this.extractData)
            .then(v => v.things);
    }
    fetchPointsByThing(thingId) {
        return this.client
            .get(`thing/${thingId}/point`)
            .then(this.extractData)
            .then(v => v.points.map(p => p.point));
    }
    updatePoint(id, data) {
        return this.client.patch(`point/${id}`, data);
    }
    updateThing(id, data) {
        return this.client.patch(`thing/${id}`, data);
    }
    createThingForDevice(deviceId, thing) {
        return this.client
            .post(`device/${deviceId}/thing`, thing)
            .then(this.extractData)
            .then(v => v.resource);
    }
    createEdge(edge) {
        return this.client
            .post('edge', edge)
            .then(this.extractData)
            .then(v => v.resource);
    }
    removeThingFromDevice(deviceId, id) {
        return this.client.delete(`device/${deviceId}/thing/${id}?_force=true`).catch(console.log);
    }
    updateDevice(id, data) {
        return this.client.patch(`device/${id}`, data);
    }
    createNetworkForEdge(edgeId, network) {
        return this.client
            .post(`edge/${edgeId}/network`, network)
            .catch(console.log)
            .then(this.extractData)
            .then(v => v.resource);
    }
    removeNetworkFromEdge(edgeId, id) {
        return this.client.delete(`edge/${edgeId}/network/${id}?_force=true`).catch(console.log);
    }
    updateNetwork(id, data) {
        return this.client.patch(`network/${id}`, data);
    }
    updateEdge(id, data) {
        return this.client.patch(`edge/${id}`, data);
    }
    createDeviceForNetwork(networkId, device) {
        return this.client
            .post(`network/${networkId}/device`, { device })
            .catch(console.log)
            .then(this.extractData)
            .then(v => v.resource.device);
    }
    removeDeviceFromNetwork(networkId, id) {
        return this.client.delete(`network/${networkId}/device/${id}?_force=true`).catch(console.log);
    }
    createPoint(data) {
        return this.client.post('point', data);
    }
    extractData(response) {
        return response.data;
    }
    createPointForThing(thingId, point) {
        return this.client
            .post(`thing/${thingId}/point`, { point })
            .then(this.extractData)
            .then(v => v.resource.point);
    }
    removePointFromThing(thingId, id) {
        return this.client.delete(`thing/${thingId}/point/${id}`);
    }
    fetchPointData(pointId) {
        return this.client.get(`data/${pointId}`).then(this.extractData);
    }
    fetchModules() {
        return this.client
            .get('modules')
            .then(this.extractData)
            .then(v => v.services);
    }
    updateModule(id, metadata) {
        return this.client
            .patch(`modules/${id}`, { service_id: id, metadata })
            .then(r => {
            console.log(r);
            return r;
        })
            .catch(console.log);
    }
}
exports.default = Api;
//# sourceMappingURL=api.js.map