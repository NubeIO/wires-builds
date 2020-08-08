"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const edge_constant_1 = require("./edge-constant");
const utils_1 = require("../../../utils");
const axios_1 = require("axios");
const Logger = require('logplease');
const logger = Logger.create('edge-utils', { color: Logger.Colors.Grey });
class Edge28Utils {
    static sendPayloadToChild(childNode, payload) {
        if (childNode['subscribe']) {
            childNode['subscribe'](this.createMessage(edge_constant_1.SEND_PAYLOAD_TO_CHILD, payload));
        }
        else {
            logger.error('Child Node is not available on sendPayloadToChild');
        }
    }
    static addPoint(parentNode, payload) {
        if (parentNode && parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(edge_constant_1.ADD_POINT, payload));
        }
        else {
            logger.error('Parent Node is not available on addPoint');
        }
    }
    static removePoint(parentNode, payload) {
        if (parentNode && parentNode['subscribe']) {
            parentNode['subscribe'](this.createMessage(edge_constant_1.REMOVE_POINT, payload));
        }
        else {
            logger.error('Parent Node is not available on removePoint');
        }
    }
    static createMessage(action, payload = null) {
        return { action, payload };
    }
    static writePointValue(host, port, apiVer, pointType, pointId, val, priority) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${utils_1.default.buildUrl(host, port)}/api/${apiVer}/write/${pointType}/${pointId}/${val}/${priority}`;
            const pointValue = yield axios_1.default.get(url);
            return pointValue.data;
        });
    }
}
exports.default = Edge28Utils;
//# sourceMappingURL=edge-utils.js.map