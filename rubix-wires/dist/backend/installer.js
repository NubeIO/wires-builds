"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const entry_1 = require("./entry");
class ApplicationAPI extends api_1.Api {
    list(_objId) {
        return this.fetchMany(this.url(), 'services');
    }
    get(objId) {
        return this.fetchOne(`${this.url()}/${objId}`);
    }
    create(obj, parentId) {
        return this.client.post(this.url(), { obj }).then(() => this.get(parentId));
    }
    update(obj, objId) {
        return this.client.patch(`${this.url()}/${objId}`, { service_id: objId, obj });
    }
    delete(objId) {
        return this.client.delete(`${this.url()}/${objId}`);
    }
    factoryEntry() {
        return this.newEntry(entry_1.Service);
    }
}
class ModuleAPI extends ApplicationAPI {
    url() {
        return 'modules';
    }
}
exports.ModuleAPI = ModuleAPI;
class ServiceAPI extends ApplicationAPI {
    url() {
        return 'services';
    }
}
exports.ServiceAPI = ServiceAPI;
//# sourceMappingURL=installer.js.map