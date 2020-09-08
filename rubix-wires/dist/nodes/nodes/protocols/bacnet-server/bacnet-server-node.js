"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../../../../utils/decorators");
const helper_1 = require("../../../../utils/helper");
const container_1 = require("../../../container");
const node_io_1 = require("../../../node-io");
const registry_1 = require("../../../registry");
const container_node_store_1 = require("../model/container-node-store");
const point_node_1 = require("../model/point-node");
const ProtocolDeviceNode_1 = require("../ProtocolDeviceNode");
const bacnet_device_1 = require("./core/bacnet-device");
const bacnet_model_1 = require("./core/bacnet-model");
exports.BACNET_SERVER_NODE_TYPE = 'protocols/bacnet-server/bacnet-server';
exports.REGISTER_BACNET_POINT = 'REGISTER_BACNET_POINT';
exports.UPDATE_BACNET_POINT = 'UPDATE_BACNET_POINT';
exports.PUSH_BACNET_POINT_VALUE = 'PUSH_BACNET_POINT_VALUE';
exports.UNREGISTER_BACNET_POINT = 'UNREGISTER_BACNET_POINT';
class BACNetCentralizedPointOutputObserver extends point_node_1.CentralizedPointOutputObserver {
    convert(data) {
        let output = {};
        output[data.point.identifier()] = {
            objectId: data.point.objectInstance,
            objectType: data.point.objectType.label,
            objectName: data.point.objectName,
            pointValue: data.point.pointValue,
            status: data.connStatus.status.label,
            error: data.connStatus.error,
        };
        return output;
    }
}
class BacnetNodeServerStore extends container_node_store_1.OneIdentifierOneNodeStore {
    getError() {
        return this.errors;
    }
    getNodes() {
        return this.nodes;
    }
    alreadyExistedMsg(payload) {
        var _a, _b;
        return `Already exist object with ${(_a = payload.data) === null || _a === void 0 ? void 0 : _a.objectInstance} and type ${(_b = payload.data) === null || _b === void 0 ? void 0 : _b.objectType}`;
    }
}
class BACnetServerNode extends ProtocolDeviceNode_1.ProtocolDeviceNode {
    constructor(container) {
        super(container, 'BACnet Server', 'A BACnet server is used to host BACnet points to be read/written by other BACnet devices. ' +
            'The bacnet-server node acts as a container for bacnet-server-point nodes. ' +
            'All bacnet-server-point nodes should be added within the bacnet-server container. ' +
            'IP configurations for the BACnet server connection are set from settings.');
        this._oPointsSlot = 2;
        this.device = null;
        this.store = new BacnetNodeServerStore();
        this.mixinEnableInputSetting();
        this.addInputWithSettings('address', node_io_1.Type.STRING, '0.0.0.0', 'BACnet Server Address');
        this.addInputWithSettings('broadcast', node_io_1.Type.STRING, '255.255.255.255', 'Broadcast Address');
        this.addInputWithSettings('port', node_io_1.Type.NUMBER, 47808, 'BACnet port');
        this.addInputWithSettings('id', node_io_1.Type.NUMBER, 1, 'BACnet Device Id');
        this.addInputWithSettings('name', node_io_1.Type.STRING, 'nube-bacnet', 'BACnet Device Name');
        this.addInputWithSettings('apdu', node_io_1.Type.NUMBER, 1476, 'BACnet APDU');
        this.addOutput('points', node_io_1.Type.JSON);
    }
    listen({ action, payload }) {
        this.debugInfo(`Handling ${action}:${payload.identifier}...`);
        switch (action) {
            case exports.REGISTER_BACNET_POINT:
                return this.store.register(payload, p => this.afterRegister(p));
            case exports.UPDATE_BACNET_POINT:
                return this.store.update(payload, p => this.afterUpdate(p), (p, force) => this.afterUnregister(p, force));
            case exports.PUSH_BACNET_POINT_VALUE:
                return this.pushValue(payload);
            case exports.UNREGISTER_BACNET_POINT:
                return this.store.unregister(payload, true, p => this.afterUnregister(p, true));
            default:
                this.debugWarn(`Request action doesn't match`);
        }
    }
    connObserverNodes() {
        return this.store.listNodeIds()
            .map(id => registry_1.default._nodes[id])
            .filter(n => n)
            .map(n => n.statusObserver());
    }
    pointObservers() {
        return [new BACNetCentralizedPointOutputObserver(this, this._oPointsSlot)];
    }
    applyTitle() {
        super.applyTitle();
        this.broadcastSettingsToClients();
        this.broadcastNameToClients();
    }
    isConnConnected() {
        return this.device !== null;
    }
    onReceiveMessage(object) {
        if (!this.getConnectionStatus().isConnected()) {
            return;
        }
        let kind = bacnet_model_1.PointKind.lookupByValue(object['objectType']);
        let bp = bacnet_model_1.BacnetPointCreator.create(this.isEnabled(), object['objectId'], kind, null, object['presentValue'], object['priority'], object['priorityArray']);
        let pointNode = this.store.lookup(bp.identifier());
        if (pointNode && registry_1.default._nodes[pointNode.nodeId] && helper_1.isFunction(pointNode.func)) {
            pointNode.func(bp);
        }
        else {
            this.debug(`Receive message to BACnet Point ${bp.identifier()} but not found node`);
        }
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
        }, data => this.onReceiveMessage(data));
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
        if (payload.enabled && this.getConnectionStatus().isConnected()) {
            this.device.addPoint(payload.data);
            return payload.data;
        }
        return null;
    }
    afterUpdate(payload) {
        if (payload.enabled && this.getConnectionStatus().isConnected()) {
            return this.device.updatePoint(payload.data);
        }
        return null;
    }
    pushValue(payload) {
        if (payload.enabled && this.getConnectionStatus().isConnected()) {
            return this.device.updateValue(payload.data);
        }
        return null;
    }
    afterUnregister(payload, force) {
        var _a, _b, _c, _d;
        if (((_a = payload.data) === null || _a === void 0 ? void 0 : _a.objectInstance) && this.getConnectionStatus().isConnected()) {
            this.device.delObject((_b = payload.data) === null || _b === void 0 ? void 0 : _b.objectInstance, (_d = (_c = payload.data) === null || _c === void 0 ? void 0 : _c.objectType) === null || _d === void 0 ? void 0 : _d.value);
        }
        if (force) {
            let output = this.outputs[this._oPointsSlot].data;
            if (output) {
                delete output[payload.identifier];
            }
            this.setOutputData(this._oPointsSlot, output);
        }
    }
}
__decorate([
    decorators_1.ErrorHandler
], BACnetServerNode.prototype, "onReceiveMessage", null);
container_1.Container.registerNodeType(exports.BACNET_SERVER_NODE_TYPE, BACnetServerNode);
//# sourceMappingURL=bacnet-server-node.js.map