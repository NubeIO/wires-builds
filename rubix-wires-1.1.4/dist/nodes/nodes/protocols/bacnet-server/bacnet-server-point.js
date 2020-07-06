"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const decorators_1 = require("../../../../decorators");
const container_1 = require("../../../container");
const container_node_1 = require("../../../container-node");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const bacnet_server_1 = require("./bacnet-server");
const bacnet_model_1 = require("./utils/bacnet-model");
const bacnet_subscriber_helper_1 = require("./utils/bacnet-subscriber-helper");
class BACnetServerPointNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.title = 'BACnet Server Point';
        this.description =
            'Bacnet-server-point nodes should be added within a bacnet-server container node. ' +
                'BACnet point details should be set in settings. BACnet point settings include ID, Type, and Name.';
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, false, 'Enable BACnet Point');
        this.addInputWithSettings('point-id', node_1.Type.NUMBER, 1, 'BACnet Object Id');
        this.settings['point-kind'] = {
            description: 'BACnet Object Type',
            type: node_1.SettingType.DROPDOWN,
            config: { items: bacnet_model_1.PointKindOpts },
            value: 0,
        };
        this.addInputWithSettings('point-name', node_1.Type.STRING, 'bacnet-point', 'BACnet Point Name');
        this.addInputWithSettings('present-value', node_1.Type.NUMBER, 0, 'Present Value');
        this.addInputWithSettings('point-priority', node_1.Type.NUMBER, 16, 'Point Priority');
        this.addInputWithSettings('priority-array', node_1.Type.JSON, null, 'Priority Array in JSON or Array');
        this.addOutput('out', node_1.Type.NUMBER);
        this.addOutput('priority', node_1.Type.NUMBER);
        this.addOutput('priority-array', node_1.Type.JSON);
        this.settings['bp'] = { description: '', value: null };
        this.setSettingsConfig({ conditions: { 'bp': () => false, 'priority-array': () => false } });
    }
    onAdded() {
        const _super = Object.create(null, {
            onAdded: { get: () => super.onAdded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onAdded.call(this);
            this.name = `BACnet Point: cid_${this.container.id}_id${this.id}`;
            this.updateOutput(this.handleEvent(this.initializePointBySettingObject()));
        });
    }
    onRemoved() {
        bacnet_subscriber_helper_1.default.removePoint(this.getParentNode(), {
            bp: this.initializePointBySettingObject(),
        });
        super.onRemoved();
    }
    onAfterSettingsChange(oldSettings, oldName) {
        this.settings['bp'].value = this.initializePointBySettingInput();
        this.updateOutput(this.handleEvent(this.settings['bp'].value, this.initializePointBySettingObject(oldSettings)));
        this.updateTitle();
    }
    applyTitle() {
        super.applyTitle();
        this.updateTitle();
    }
    onInputUpdated() {
        let prev = this.initializePointBySettingObject();
        this.reEvaluateSettingByInput();
        this.updateOutput(this.handleEvent(this.settings['bp'].value, prev));
        this.updateTitle();
    }
    reEvaluateSettingByInput() {
        var _a, _b, _c, _d, _e, _f;
        this.settings['enable'].value = (_a = this.inputs[0].data, (_a !== null && _a !== void 0 ? _a : this.settings['enable'].value));
        this.settings['point-id'].value = (_b = this.inputs[1].data, (_b !== null && _b !== void 0 ? _b : this.settings['point-id'].value));
        this.settings['point-name'].value = (_c = this.inputs[2].data, (_c !== null && _c !== void 0 ? _c : this.settings['point-name'].value));
        this.settings['present-value'].value = (_d = this.inputs[3].data, (_d !== null && _d !== void 0 ? _d : this.settings['present-value'].value));
        this.settings['point-priority'].value = (_e = this.inputs[4].data, (_e !== null && _e !== void 0 ? _e : this.settings['point-priority'].value));
        this.settings['priority-array'].value = (_f = this.inputs[5].data, (_f !== null && _f !== void 0 ? _f : this.settings['priority-array'].value));
        this.settings['bp'].value = this.initializePointBySettingInput();
    }
    updateTitle() {
        this.title = `BACnet Point (FC: ${this.settings['point-kind'].value}, AD: ${this.settings['point-id'].value})`;
        this.broadcastSettingsToClients();
    }
    handleEvent(current, prev) {
        var _a, _b;
        if (this.side !== container_1.Side.server || (!((_a = prev) === null || _a === void 0 ? void 0 : _a.objectInstance) && !((_b = current) === null || _b === void 0 ? void 0 : _b.objectInstance))) {
            return null;
        }
        let payload = {
            bp: current,
            enable: this.settings['enable'].value,
            nodeId: registry_1.default.getId(this.cid, this.id),
            func: this.updateOutput,
        };
        if (!prev) {
            return bacnet_subscriber_helper_1.default.addPoint(this.getParentNode(), payload);
        }
        if (!this.settings['enable'].value || !current.mightOnlyValueChanged(prev)) {
            payload['prev'] = prev;
            return bacnet_subscriber_helper_1.default.updatePoint(this.getParentNode(), payload);
        }
        return bacnet_subscriber_helper_1.default.updatePointValue(this.getParentNode(), payload);
    }
    initializePointBySettingObject(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return st['bp'].value
            ? bacnet_model_1.BacnetPointCreator.from(st['bp'].value)
            : this.initializePointBySettingInput(st);
    }
    initializePointBySettingInput(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return bacnet_model_1.BacnetPointCreator.create(st['point-id'].value, st['point-kind'].value, st['point-name'].value, st['present-value'].value, st['point-priority'].value, st['priority-array'].value);
    }
    updateOutput(pv, nodeId) {
        var _a, _b, _c, _d;
        let self = nodeId ? registry_1.default._nodes[nodeId] : this;
        if (!self || !pv) {
            return;
        }
        self.setOutputData(0, (_a = pv) === null || _a === void 0 ? void 0 : _a.presentValue);
        self.setOutputData(1, (_b = pv) === null || _b === void 0 ? void 0 : _b.priority);
        self.setOutputData(2, (_c = pv) === null || _c === void 0 ? void 0 : _c.priorityArray);
        self.settings['bp'].value.pointValue = pv;
        self.settings['priority-array'].value = (_d = pv) === null || _d === void 0 ? void 0 : _d.priorityArray;
    }
}
__decorate([
    decorators_1.ErrorHandler
], BACnetServerPointNode.prototype, "handleEvent", null);
__decorate([
    decorators_1.ErrorHandler
], BACnetServerPointNode.prototype, "initializePointBySettingObject", null);
__decorate([
    decorators_1.ErrorHandler
], BACnetServerPointNode.prototype, "initializePointBySettingInput", null);
container_1.Container.registerNodeType('protocols/bacnet-server/bacnet-server-point', BACnetServerPointNode, bacnet_server_1.BACNET_SERVER_NODE_TYPE);
//# sourceMappingURL=bacnet-server-point.js.map