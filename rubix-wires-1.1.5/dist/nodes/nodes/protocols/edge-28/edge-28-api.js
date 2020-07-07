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
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const container_node_1 = require("../../../container-node");
const utils_1 = require("../../../utils");
const axios_1 = require("axios");
const edge_utils_1 = require("./edge-utils");
const edge_constant_1 = require("./edge-constant");
class Edge28ApiNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.pointNodes = [];
        this.inAlarmTrigger = 0;
        this.inHistoryTrigger = 1;
        this.inInput = 2;
        this.outVal = 0;
        this.outError = 1;
        this.outMessageJson = 2;
        this.outAlarm = 3;
        this.title = 'Edge 28 api';
        this.description = '';
        this.addInput('ping', node_1.Type.BOOLEAN);
        this.addOutput('connected', node_1.Type.BOOLEAN);
        this.addOutput('error', node_1.Type.STRING);
        this.addOutput('alarm', node_1.Type.BOOLEAN);
    }
    fetchPointValue(host, port, apiVer, pointType) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${utils_1.default.buildUrl(host, port)}/api/${apiVer}/read/all/${pointType}`;
            const pointValue = yield axios_1.default.get(url);
            return pointValue.data;
        });
    }
    onCreated() {
        super.onCreated();
        this.name = `id_${this.container.id.toString()}_${this.id.toString()}`;
    }
    onAdded() {
        if (this.side !== container_1.Side.server)
            return;
        this.onInputUpdated();
    }
    sendPayloadToPointNodesFunc() {
        for (let pointNode of this.pointNodes) {
            edge_utils_1.default.sendPayloadToChild(pointNode, {
                pointsDI: this.edgeReadDI_Store,
                pointsUI: this.edgeReadUI_Store,
            });
        }
    }
    subscribe({ action, payload }) {
        switch (action) {
            case edge_constant_1.ADD_POINT:
                this.pointNodes.push(payload);
                break;
            case edge_constant_1.REMOVE_POINT:
                this.pointNodes = this.pointNodes.filter(pointNode => pointNode.id !== payload.id);
                break;
            case edge_constant_1.GET_POINTS:
                return 'GET_POINTS';
            case edge_constant_1.GET_PRESENT_VALUE:
                return 'GET_PRESENT_VALUE';
            case edge_constant_1.SEND_PAYLOAD_TO_CHILD:
                return 'SEND_PAYLOAD_TO_CHILD';
            default:
                this.debugWarn("Request action doesn't match");
        }
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            const _ui = 'ui';
            const _di = 'di';
            this.fetchPointValue(edge_constant_1.edgeIp, edge_constant_1.edgePort, edge_constant_1.edgeApiVer, _ui)
                .then(e => (this.edgeReadUI_Store = e))
                .catch(err => this.debugInfo(`ERROR: getting edge point type: ${_ui} ${err}`));
            yield utils_1.default.sleep(50);
            this.fetchPointValue(edge_constant_1.edgeIp, edge_constant_1.edgePort, edge_constant_1.edgeApiVer, _di)
                .then(e => (this.edgeReadDI_Store = e))
                .catch(err => this.debugInfo(`ERROR: getting edge point type: ${_di} ${err}`));
            this.sendPayloadToPointNodesFunc();
        });
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('protocols/nube/edge-28-api', Edge28ApiNode);
//# sourceMappingURL=edge-28-api.js.map