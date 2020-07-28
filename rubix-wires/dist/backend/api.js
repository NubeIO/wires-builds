"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const lodash_1 = require("lodash");
const config_1 = require("../config");
class Api {
    constructor() {
        this.client = axios_1.default.create({ baseURL: config_1.default.backendSync.baseUrl });
    }
    fetchMany(url, respKey) {
        return this.client.get(url).then(this.extractData(respKey)).then(this.assignAllTo(() => this.factoryEntry()));
    }
    fetchOne(url, respKey) {
        return this.client.get(url).then(this.extractData(respKey)).then(p => Object.assign(this.factoryEntry(), p));
    }
    newEntry(c) {
        return new c();
    }
    extractData(path = null) {
        return (response) => (path ? lodash_1.get(response.data, path) : response.data);
    }
    assignAllTo(factory) {
        return (properties) => properties.map(p => Object.assign(factory(), p));
    }
}
exports.Api = Api;
//# sourceMappingURL=api.js.map