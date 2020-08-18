"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const point_node_1 = require("../model/point-node");
const ProtocolDeviceNode_1 = require("../ProtocolDeviceNode");
const bacnet_server_node_1 = require("./bacnet-server-node");
const bacnet_server_node_event_1 = require("./bacnet-server-node-event");
const bacnet_model_1 = require("./core/bacnet-model");
class BACnetServerPointNode extends ProtocolDeviceNode_1.DependantConnectionNodeMixin(point_node_1.PointNodeMixin(node_1.Node)) {
    constructor() {
        super();
        this.title = 'BACnet Server Point';
        this.description =
            'Bacnet-server-point nodes should be added within a bacnet-server container node. ' +
                'BACnet point details should be set in settings. BACnet point settings include ID, Type, and Name.';
        this.mixinEnableInputSetting();
        this.mixinConnectionStatusOutput();
        this.addInputWithSettings('point-id', node_1.Type.NUMBER, 1, 'BACnet Object Id');
        this.settings['point-kind'] = {
            description: 'BACnet Object Type',
            type: node_1.SettingType.DROPDOWN,
            config: { items: bacnet_model_1.PointKindOpts },
            value: 0,
        };
        this.addInputWithSettings('point-name', node_1.Type.STRING, 'bacnet-point', 'BACnet Point Name');
        this.setSettingsConfig(this.mixinPointValueInputOutput());
    }
    onCreated() {
        this.name = `BACnet Point: cid_${this.container.id}_id${this.id}`;
    }
    onRemoved() {
        bacnet_server_node_event_1.default.unregisterPoint(this.getParentNode(), this.createPayload(this.initializePointBySettingObject()));
    }
    handleOnUpdate(current, prev) {
        var _a, _b;
        if (this.side !== container_1.Side.server || (!((_a = prev) === null || _a === void 0 ? void 0 : _a.objectInstance) && !((_b = current) === null || _b === void 0 ? void 0 : _b.objectInstance))) {
            return null;
        }
        let payload = this.createPayload(current);
        payload.callback = (pv, nodeId) => this.updatePointValueOutput(pv, nodeId);
        if (!prev) {
            return bacnet_server_node_event_1.default.registerPoint(this.getParentNode(), payload);
        }
        if (!current.mightOnlyValueChanged(prev)) {
            payload.prev = this.createPayload(prev);
            return bacnet_server_node_event_1.default.updatePoint(this.getParentNode(), payload);
        }
        let cov = current.pointValue.changedOfValue(prev.pointValue);
        if (cov) {
            payload.data.pointValue = cov;
        }
        return bacnet_server_node_event_1.default.pushPointValue(this.getParentNode(), payload);
    }
    initializePointBySettingObject(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return bacnet_model_1.BacnetPointCreator.from(st[this.modelSettingKey()].value);
    }
    initializePointBySettingInput(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return bacnet_model_1.BacnetPointCreator.by(this.isEnabled(), st['point-id'].value, st['point-kind'].value, st['point-name'].value, this.createPointValue(st));
    }
    reEvaluateSettingByInput(inputs, settings) {
        settings['point-id'].value = inputs[1].updated ? inputs[1].data : settings['point-id'].value;
        settings['point-name'].value = inputs[2].updated ? inputs[2].data : settings['point-name'].value;
        super.reEvaluateSettingByInput(inputs, settings);
    }
    statusOutputIdx() {
        return 0;
    }
    enableDescription() {
        return 'Enable BACnet Point';
    }
    handler() {
        return this;
    }
    modelSettingKey() {
        return 'bp';
    }
    valueInputIdx() {
        return 3;
    }
    valueOutputIdx() {
        return this.errorOutputIdx() + 1;
    }
    computeTitle() {
        return `BACnet Point (ObjectType: ${this.settings['point-kind'].value}, ObjectId: ${this.settings['point-id'].value})`;
    }
    createPayload(point) {
        return {
            identifier: point.identifier(),
            enabled: point.enabled,
            data: point,
            nodeId: registry_1.default.getId(this.cid, this.id),
        };
    }
}
container_1.Container.registerNodeType('protocols/bacnet-server/bacnet-server-point', BACnetServerPointNode, bacnet_server_node_1.BACNET_SERVER_NODE_TYPE);
//# sourceMappingURL=bacnet-server-point.js.map