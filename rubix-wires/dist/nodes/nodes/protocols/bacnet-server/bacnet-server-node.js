"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../../../../decorators");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const container_node_store_1 = require("../model/container-node-store");
const ProtocolDeviceNode_1 = require("../ProtocolDeviceNode");
const bacnet_server_node_event_1 = require("./bacnet-server-node-event");
const bacnet_device_1 = require("./core/bacnet-device");
const bacnet_model_1 = require("./core/bacnet-model");
class BACnetServerNode extends ProtocolDeviceNode_1.ProtocolDeviceNode {
    constructor(container) {
        super(container, 'BACnet Server', 'A BACnet server is used to host BACnet points to be read/written by other BACnet devices. ' +
            'The bacnet-server node acts as a container for bacnet-server-point nodes. ' +
            'All bacnet-server-point nodes should be added within the bacnet-server container. ' +
            'IP configurations for the BACnet server connection are set from settings.');
        this.device = null;
        this.points = new BacnetNodeServerStore();
        this.mixinEnableInputSetting();
        this.addInputWithSettings('address', node_1.Type.STRING, '0.0.0.0', 'BACnet Server Address');
        this.addInputWithSettings('broadcast', node_1.Type.STRING, '255.255.255.255', 'Broadcast Address');
        this.addInputWithSettings('port', node_1.Type.NUMBER, 47808, 'BACnet port');
        this.addInputWithSettings('id', node_1.Type.NUMBER, 1, 'BACnet Device Id');
        this.addInputWithSettings('name', node_1.Type.STRING, 'nube-bacnet', 'BACnet Device Name');
        this.addInputWithSettings('apdu', node_1.Type.NUMBER, 1476, 'BACnet APDU');
    }
    subscribe({ action, payload }) {
        this.debugInfo(`Handling ${action}:${payload.identifier}...`);
        switch (action) {
            case bacnet_server_node_event_1.REGISTER_BACNET_POINT:
                return this.points.register(payload, p => this.afterRegister(p));
            case bacnet_server_node_event_1.UPDATE_BACNET_POINT:
                return this.points.update(payload, p => this.afterRegister(p), p => this.afterUnregister(p));
            case bacnet_server_node_event_1.PUSH_BACNET_POINT_VALUE:
                return this.pushValue(payload);
            case bacnet_server_node_event_1.UNREGISTER_BACNET_POINT:
                return this.points.unregister(payload, true, p => this.afterUnregister(p));
            default:
                this.debugWarn(`Request action doesn't match`);
        }
    }
    applyTitle() {
        super.applyTitle();
        this.title = `BACnet Server (ID: ${this.settings['id'].value}, Name: ${this.settings['name'].value})`;
        this.name = `BACnet Server ${this.settings['name'].value}`;
        this.broadcastSettingsToClients();
        this.broadcastNameToClients();
    }
    createThenStart() {
        this.device = new bacnet_device_1.default({
            deviceId: this.settings['id'].value,
            name: this.settings['name'].value,
            databaseRevision: 1,
        }, {
            port: this.settings['port'].value,
            address: this.settings['address'].value,
            broadcast: this.settings['broadcast'].value,
            apduTimeout: this.settings['apdu'].value,
        }, registry_1.default.getId(this.cid, this.id), this.onListenPointChange);
        this.device.start();
    }
    stop() {
        if (!this.device) {
            return;
        }
        try {
            this.device.stop();
            this.device = null;
        }
        catch (e) {
            this.debugWarn(`Cannot closed BACnet client ${e}`);
        }
    }
    afterRegister(payload) {
        var _a, _b, _c, _d;
        if ((_a = payload) === null || _a === void 0 ? void 0 : _a.enabled) {
            this.device.addPoint((_b = payload) === null || _b === void 0 ? void 0 : _b.data);
            return (_d = (_c = payload) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.pointValue;
        }
        return null;
    }
    pushValue(payload) {
        var _a, _b, _c, _d;
        if ((_a = payload) === null || _a === void 0 ? void 0 : _a.enabled) {
            this.device.updatePointValue((_b = payload) === null || _b === void 0 ? void 0 : _b.data);
            return (_d = (_c = payload) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.pointValue;
        }
        return null;
    }
    afterUnregister(payload) {
        var _a, _b, _c, _d, _e, _f;
        if (((_b = (_a = payload) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.objectInstance) && this.device) {
            this.device.delObject((_d = (_c = payload) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.objectInstance, (_f = (_e = payload) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.objectType);
        }
        return null;
    }
    onListenPointChange(nodeId, objectType, objectId, presentValue, priority, priorityArray) {
        let node = registry_1.default._nodes[nodeId];
        if (!node) {
            throw new Error(`Cannot find nodeId ${nodeId}`);
        }
        let bp = bacnet_model_1.BacnetPointCreator.create(node.isEnabled(), objectId, objectType, null, presentValue, priority, priorityArray);
        let pointNode = node.points.lookup(bp.identifier());
        if (pointNode) {
            pointNode.func(bp.pointValue, pointNode.nodeId);
        }
        else {
        }
    }
}
__decorate([
    decorators_1.ErrorHandler
], BACnetServerNode.prototype, "createThenStart", null);
class BacnetNodeServerStore extends container_node_store_1.AbstractContainerStore {
    constructor() {
        super(...arguments);
        this.pointNodes = {};
    }
    checkExistence(payload) {
        var _a, _b;
        if (this.pointNodes[payload.identifier]) {
            throw new Error(`Already exist object with ${(_a = payload.data) === null || _a === void 0 ? void 0 : _a.objectInstance} and type ${(_b = payload.data) === null || _b === void 0 ? void 0 : _b.objectType}`);
        }
    }
    lookup(identifier) {
        var _a;
        return _a = this.pointNodes[identifier], (_a !== null && _a !== void 0 ? _a : null);
    }
    unregister(payload, force, cb) {
        var _a, _b;
        if (force) {
            delete this.pointNodes[(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier];
        }
        else {
            this.add(payload);
            this.pointNodes[(_b = payload) === null || _b === void 0 ? void 0 : _b.identifier].enabled = false;
        }
        return cb && cb(payload);
    }
    isDifferent(payload) {
        var _a, _b, _c;
        return !((_a = payload) === null || _a === void 0 ? void 0 : _a.data).equals((_c = (_b = payload) === null || _b === void 0 ? void 0 : _b.prev) === null || _c === void 0 ? void 0 : _c.data);
    }
    add(payload) {
        var _a, _b, _c, _d;
        this.pointNodes[(_a = payload) === null || _a === void 0 ? void 0 : _a.identifier] = {
            nodeId: (_b = payload) === null || _b === void 0 ? void 0 : _b.nodeId,
            enabled: (_c = payload) === null || _c === void 0 ? void 0 : _c.enabled,
            func: (_d = payload) === null || _d === void 0 ? void 0 : _d.callback,
        };
    }
}
exports.BacnetNodeServerStore = BacnetNodeServerStore;
exports.BACNET_SERVER_NODE_TYPE = 'protocols/bacnet-server/bacnet-server';
container_1.Container.registerNodeType(exports.BACNET_SERVER_NODE_TYPE, BACnetServerNode);
//# sourceMappingURL=bacnet-server-node.js.map