"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_model_1 = require("../../../../backend/models/point-model");
const helper_1 = require("../../../../utils/helper");
const pattern_1 = require("../../../../utils/pattern");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const connection_node_mixin_1 = require("../connection-node-mixin");
const point_node_1 = require("../model/point-node");
const bacnet_server_node_1 = require("./bacnet-server-node");
const bacnet_model_1 = require("./core/bacnet-model");
class BACnetServerPointNode extends connection_node_mixin_1.DependantConnectionNodeMixin(point_node_1.PointNodeMixin(node_1.Node)) {
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
            config: { items: bacnet_model_1.PointKind.items() },
            value: bacnet_model_1.PointKind.ANALOG_INPUT.enumKey,
        };
        this.addInputWithSettings('point-name', node_1.Type.STRING, 'bacnet-point', 'BACnet Point Name');
        this.setSettingsConfig(this.mixinPointValueInputOutput());
    }
    flowHandler() {
        return this;
    }
    listener() {
        var _a;
        return _a = this.getParentNode(), (_a !== null && _a !== void 0 ? _a : pattern_1.MockCentralizedListener.LISTENER);
    }
    pointObservers() {
        return [...super.pointObservers(),
            ...(this.getParentNode().pointObservers())];
    }
    notifyOutput(point, observers) {
        var _a, _b, _c;
        let cp = (_a = this.initializePointBySettingObject(), (_a !== null && _a !== void 0 ? _a : point));
        if (helper_1.isNull(cp)) {
            return;
        }
        point.pointValue = helper_1.isNull((_b = point) === null || _b === void 0 ? void 0 : _b.pointValue) ? point_model_1.PointValueCreator.by() : (_c = point) === null || _c === void 0 ? void 0 : _c.pointValue.merge(cp.pointValue);
        this.settings[this.modelSettingKey()].value = point;
        new pattern_1.DefaultObservable(observers).notify({ point: point, connStatus: { status: this.getConnectionStatus() } });
    }
    onRemoved() {
        if (this.listener() === pattern_1.MockCentralizedListener.LISTENER) {
            return;
        }
        let event = {
            action: bacnet_server_node_1.UNREGISTER_BACNET_POINT,
            payload: this.createPayload(this.initializePointBySettingObject()),
        };
        this.listener().listen(event);
    }
    handleOnUpdate(current, prev) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (this.side !== container_1.Side.server || (!((_a = prev) === null || _a === void 0 ? void 0 : _a.objectInstance) && !((_b = current) === null || _b === void 0 ? void 0 : _b.objectInstance))) {
            return null;
        }
        let payload = this.createPayload(current);
        if (!prev || this.getConnectionStatus().isError()) {
            this.listener().listen({ action: bacnet_server_node_1.REGISTER_BACNET_POINT, payload });
        }
        else if (!current.mightOnlyValueChanged(prev)) {
            if (!current.equals(prev)) {
                current.pointValue = point_model_1.PointValueCreator.by();
            }
            payload.prev = this.createPayload(prev);
            this.listener().listen({ action: bacnet_server_node_1.UPDATE_BACNET_POINT, payload });
        }
        if (!current.enabled || (helper_1.isNull((_d = (_c = current) === null || _c === void 0 ? void 0 : _c.pointValue) === null || _d === void 0 ? void 0 : _d.presentValue) &&
            (prev && !current.equals(prev) || helper_1.isNull((_f = (_e = prev) === null || _e === void 0 ? void 0 : _e.pointValue) === null || _f === void 0 ? void 0 : _f.presentValue)))) {
            return current;
        }
        let cov = current.pointValue.changedOfValue((_g = prev) === null || _g === void 0 ? void 0 : _g.pointValue);
        if (cov) {
            payload.data.pointValue = cov;
        }
        current.pointValue = this.listener().listen({ action: bacnet_server_node_1.PUSH_BACNET_POINT_VALUE, payload });
        return current;
    }
    initializePointBySettingObject(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return bacnet_model_1.BacnetPointCreator.from(st[this.modelSettingKey()].value);
    }
    initializePointBySettingInput(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        let kind = bacnet_model_1.PointKind.enumValueOf(st['point-kind'].value);
        return bacnet_model_1.BacnetPointCreator.by(this.isEnabled(), st['point-id'].value, kind, st['point-name'].value, this.createPointValue(st));
    }
    reEvaluateSettingByInput(inputs, settings) {
        settings['point-id'].value = inputs[1].updated ? inputs[1].data : settings['point-id'].value;
        settings['point-name'].value = inputs[2].updated ? inputs[2].data : settings['point-name'].value;
        super.reEvaluateSettingByInput(inputs, settings);
    }
    onReceiveMessage(point) {
        this.notifyOutput(point, this.pointObservers());
    }
    statusOutputIdx() {
        return 0;
    }
    enableDescription() {
        return 'Enable BACnet Point';
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
        let kind = bacnet_model_1.PointKind.enumValueOf(this.settings['point-kind'].value);
        return `BACnet Point (ObjectType: ${kind.label}, ObjectId: ${this.settings['point-id'].value})`;
    }
    createPayload(point) {
        var _a, _b;
        return {
            identifier: (_a = point) === null || _a === void 0 ? void 0 : _a.identifier(),
            enabled: (_b = point) === null || _b === void 0 ? void 0 : _b.enabled,
            data: point,
            nodeId: registry_1.default.getId(this.cid, this.id),
            callback: (p) => this.onReceiveMessage(p),
        };
    }
}
container_1.Container.registerNodeType('protocols/bacnet-server/bacnet-server-point', BACnetServerPointNode, bacnet_server_node_1.BACNET_SERVER_NODE_TYPE);
//# sourceMappingURL=bacnet-server-point.js.map