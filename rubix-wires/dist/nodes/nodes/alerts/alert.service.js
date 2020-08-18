"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const request_1 = require("../../utils/axios/request");
let queryInProgress;
exports.default = {
    getAlert(alertId) {
        return request_1.default.get(`/alert/${alertId}`);
    },
    setStatus(alertId, data) {
        return request_1.default.put(`/alert/${alertId}/status`, data);
    },
    actionAlert(alertId, data) {
        return request_1.default.put(`/alert/${alertId}/action`, data);
    },
    tagAlert(alertId, data) {
        return request_1.default.put(`/alert/${alertId}/tag`, data);
    },
    untagAlert(alertId, data) {
        return request_1.default.put(`/alert/${alertId}/untag`, data);
    },
    updateAttributes(alertId, attributes) {
        let data = {
            attributes: attributes
        };
        return request_1.default.put(`/alert/${alertId}/attributes`, data);
    },
    addNote(alertId, data) {
        return request_1.default.put(`/alert/${alertId}/note`, data);
    },
    getNotes(alertId) {
        return request_1.default.get(`/alert/${alertId}/notes`);
    },
    updateNote(alertId, noteId, data) {
        return request_1.default.put(`/alert/${alertId}/note/${noteId}`, data);
    },
    deleteNote(alertId, noteId) {
        return request_1.default.delete(`/alert/${alertId}/note/${noteId}`);
    },
    getAlerts(query) {
        if (query && queryInProgress) {
            queryInProgress.cancel('Too many search requests. Cancelling current query.');
        }
        queryInProgress = axios_1.default.CancelToken.source();
        let config = {
            params: query,
            cancelToken: queryInProgress.token
        };
        return request_1.default.get('/alerts', config);
    },
    getAlertHistory(query) {
        let config = {
            params: query
        };
        return request_1.default.get('/alerts/history', config);
    },
    getCounts(query) {
        let config = {
            params: query
        };
        return request_1.default.get('/alerts/count', config);
    },
    getTop10Count(query) {
        let config = {
            params: query
        };
        return request_1.default.get('/alerts/top10/count', config);
    },
    getTop10Flapping(query) {
        let config = {
            params: query
        };
        return request_1.default.get('/alerts/top10/flapping', config);
    },
    getTop10Standing(query) {
        let config = {
            params: query
        };
        return request_1.default.get('/alerts/top10/standing', config);
    },
    deleteAlert(alertId) {
        return request_1.default.delete(`/alert/${alertId}`);
    },
    getEnvironments(query) {
        let config = {
            params: query
        };
        return request_1.default.get('/environments', config);
    },
    getServices(query) {
        let config = {
            params: query
        };
        return request_1.default.get('/services', config);
    },
    getGroups(query) {
        let config = {
            params: query
        };
        return request_1.default.get('/alerts/groups', config);
    },
    getTags(query) {
        let config = {
            params: query
        };
        return request_1.default.get('/alerts/tags', config);
    }
};
//# sourceMappingURL=alert.service.js.map