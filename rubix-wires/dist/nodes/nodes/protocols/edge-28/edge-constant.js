"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../../config");
const edgeApi = config_1.default.edge28;
exports.SEND_PAYLOAD_TO_CHILD = 'SEND_PAYLOAD_TO_CHILD';
exports.ADD_POINT = 'ADD_POINT';
exports.REMOVE_POINT = 'REMOVE_POINT';
exports.edgeIp = edgeApi.baseURL;
exports.edgePort = edgeApi.port;
exports.edgeApiVer = edgeApi.apiVer;
//# sourceMappingURL=edge-constant.js.map