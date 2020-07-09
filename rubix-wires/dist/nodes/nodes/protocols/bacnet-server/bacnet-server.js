"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../../container");
const container_node_1 = require("../../../container-node");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const RequiredValidation_1 = require("../../../validation/types/RequiredValidation");
const bacnet_device_1 = require("./bacnet-device");
const bacnet_model_1 = require("./utils/bacnet-model");
const bacnet_subscriber_helper_1 = require("./utils/bacnet-subscriber-helper");
class BACnetServerNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.device = null;
        this.pointNodes = {};
        this.title = 'BACnet Server';
        this.description =
            'A BACnet server is used to host BACnet points to be read/written by other BACnet devices. ' +
                'The bacnet-server node acts as a container for bacnet-server-point nodes. ' +
                'All bacnet-server-point nodes should be added within the bacnet-server container. ' +
                'IP configurations for the BACnet server connection are set from settings.';
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, false, 'BACnet Server Enable');
        this.addInputWithSettings('address', node_1.Type.STRING, '0.0.0.0', 'BACnet Server Address');
        this.addInputWithSettings('broadcast', node_1.Type.STRING, '255.255.255.255', 'Broadcast Address');
        this.addInputWithSettings('port', node_1.Type.NUMBER, 47808, 'BACnet port');
        this.addInputWithSettings('id', node_1.Type.NUMBER, 1, 'BACnet Device Id');
        this.addInputWithSettings('name', node_1.Type.STRING, 'nube-bacnet', 'BACnet Device Name');
        this.addInputWithSettings('apdu', node_1.Type.NUMBER, 1476, 'BACnet APDU');
        this.settings['id'].validation = new RequiredValidation_1.default();
    }
    onCreated() {
        super.onCreated();
        this.name = `id_${this.container.id.toString()}_${this.id.toString()}`;
    }
    onAdded() {
        this.startOrStop();
    }
    onAfterSettingsChange() {
        this.startOrStop();
    }
    applyTitle() {
        super.applyTitle();
        this.title = `BACnet Server (ID: ${this.settings['id'].value}, Name: ${this.settings['name'].value})`;
        this.broadcastSettingsToClients();
    }
    onRemoved() {
        this.stop();
        super.onRemoved();
    }
    subscribe({ action, payload }) {
        this.debug(`${action}: ${payload}`);
        switch (action) {
            case bacnet_subscriber_helper_1.ADD_POINT:
                return this.addBACnetPoint(payload);
            case bacnet_subscriber_helper_1.UPDATE_POINT:
                return this.updateBACnetPoint(payload);
            case bacnet_subscriber_helper_1.UPDATE_POINT_VALUE:
                return this.updateBACnetPointValue(payload);
            case bacnet_subscriber_helper_1.REMOVE_POINT:
                this.removeBACnetNode(payload);
                break;
            case bacnet_subscriber_helper_1.GET_NETWORK_SETTINGS:
                return 'GET_NETWORK_SETTINGS';
            case bacnet_subscriber_helper_1.GET_POINTS:
                return [];
            case bacnet_subscriber_helper_1.GET_PRESENT_VALUE:
                return 'GET_PRESENT_VALUE';
            case bacnet_subscriber_helper_1.SEND_PAYLOAD_TO_CHILD:
                break;
            default:
                this.debugWarn(`Request action doesn't match`);
        }
    }
    startOrStop() {
        if (this.side !== container_1.Side.server)
            return;
        if (this.device)
            this.stop();
        this.settings['enable'].value === true ? this.createThenStart() : this.stop();
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
        }, registry_1.default.getId(this.cid, this.id), this.broadcastAfterWrite);
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
    removeBACnetNode(payload, force = true) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (force) {
            delete this.pointNodes[(_b = (_a = payload) === null || _a === void 0 ? void 0 : _a.bp) === null || _b === void 0 ? void 0 : _b.identifier()];
        }
        else {
            this.pointNodes[(_d = (_c = payload) === null || _c === void 0 ? void 0 : _c.bp) === null || _d === void 0 ? void 0 : _d.identifier()]['enable'] = false;
        }
        if (((_f = (_e = payload) === null || _e === void 0 ? void 0 : _e.bp) === null || _f === void 0 ? void 0 : _f.objectInstance) && this.device) {
            this.device.delObject((_h = (_g = payload) === null || _g === void 0 ? void 0 : _g.bp) === null || _h === void 0 ? void 0 : _h.objectInstance, (_k = (_j = payload) === null || _j === void 0 ? void 0 : _j.bp) === null || _k === void 0 ? void 0 : _k.objectType);
        }
    }
    checkExistence(bacnetPoint) {
        var _a, _b, _c;
        if (this.pointNodes[(_a = bacnetPoint) === null || _a === void 0 ? void 0 : _a.identifier()]) {
            throw new Error(`Already exist object with id ${(_b = bacnetPoint) === null || _b === void 0 ? void 0 : _b.objectInstance} and type ${(_c = bacnetPoint) === null || _c === void 0 ? void 0 : _c.objectType}`);
        }
    }
    addBACnetPoint(payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.checkExistence((_a = payload) === null || _a === void 0 ? void 0 : _a.bp);
        this.pointNodes[(_c = (_b = payload) === null || _b === void 0 ? void 0 : _b.bp) === null || _c === void 0 ? void 0 : _c.identifier()] = {
            nodeId: (_d = payload) === null || _d === void 0 ? void 0 : _d.nodeId,
            enable: (_e = payload) === null || _e === void 0 ? void 0 : _e.enable,
            func: (_f = payload) === null || _f === void 0 ? void 0 : _f.func,
        };
        if ((_g = payload) === null || _g === void 0 ? void 0 : _g.enable) {
            this.device.addPoint((_h = payload) === null || _h === void 0 ? void 0 : _h.bp);
            return (_k = (_j = payload) === null || _j === void 0 ? void 0 : _j.bp) === null || _k === void 0 ? void 0 : _k.pointValue;
        }
        return null;
    }
    updateBACnetPoint(payload) {
        var _a, _b, _c, _d, _e;
        if (!((_a = payload) === null || _a === void 0 ? void 0 : _a.bp.equals((_b = payload) === null || _b === void 0 ? void 0 : _b.prev))) {
            try {
                this.checkExistence((_c = payload) === null || _c === void 0 ? void 0 : _c.prev);
            }
            catch (e) {
                this.debug(e);
                this.removeBACnetNode({ bp: (_d = payload) === null || _d === void 0 ? void 0 : _d.prev });
            }
            return this.addBACnetPoint(payload);
        }
        if ((_e = payload) === null || _e === void 0 ? void 0 : _e.enable) {
            return this.updateBACnetPointValue(payload);
        }
        this.removeBACnetNode(payload, false);
        return null;
    }
    updateBACnetPointValue(payload) {
        var _a, _b, _c;
        this.device.updatePointValue((_a = payload) === null || _a === void 0 ? void 0 : _a.bp);
        return (_c = (_b = payload) === null || _b === void 0 ? void 0 : _b.bp) === null || _c === void 0 ? void 0 : _c.pointValue;
    }
    broadcastAfterWrite(nodeId, objectType, objectId, presentValue, priority, priorityArray) {
        let node = registry_1.default._nodes[nodeId];
        if (!node) {
            throw new Error(`Cannot find nodeId ${nodeId}`);
        }
        let bp = bacnet_model_1.BacnetPointCreator.create(objectId, objectType, null, presentValue, priority, priorityArray);
        let pointNode = node.pointNodes[bp.identifier()];
        if (pointNode) {
            pointNode.func(bp.pointValue, pointNode.nodeId);
        }
        else {
        }
    }
}
exports.BACNET_SERVER_NODE_TYPE = 'protocols/bacnet-server/bacnet-server';
container_1.Container.registerNodeType(exports.BACNET_SERVER_NODE_TYPE, BACnetServerNode);
//# sourceMappingURL=bacnet-server.js.map