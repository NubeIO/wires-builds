"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const api = {
    get(url, config) {
        return this.request('GET', url, null, config);
    },
    delete(url, config) {
        return this.request('DELETE', url, null, config);
    },
    head(url, config) {
        return this.request('HEAD', url, null, config);
    },
    post(url, data, config) {
        return this.request('POST', url, data, config);
    },
    put(url, data, config) {
        return this.request('PUT', url, data, config);
    },
    patch(url, data, config) {
        return this.request('PATCH', url, data, config);
    },
    request(method, url, data, config) {
        return axios_1.default.request(Object.assign(Object.assign({}, config), { url, method, data })).then(response => {
            return response.data;
        }).catch(err => err);
    }
};
exports.default = api;
//# sourceMappingURL=request.js.map