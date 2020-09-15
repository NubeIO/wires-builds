"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const logplease_1 = require("logplease");
const point_model_1 = require("../../../../backend/models/point-model");
const decorators_1 = require("../../../../utils/decorators");
const helper_1 = require("../../../../utils/helper");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const node_io_1 = require("../../../node-io");
const point_node_utils_1 = require("./point-node-utils");
const logger = logplease_1.create('observer', { color: logplease_1.Colors.Yellow });
class MockHasPointOutputObservers {
    static cast(object) {
        if (helper_1.isEmpty(object)) {
            return MockHasPointOutputObservers.MOCK;
        }
        if (helper_1.isFunction(object['pointObservers'])) {
            return object;
        }
        return MockHasPointOutputObservers.MOCK;
    }
    pointObservers() {
        return [];
    }
    MockHasPointOutputObservers() {
    }
}
exports.MockHasPointOutputObservers = MockHasPointOutputObservers;
MockHasPointOutputObservers.MOCK = new MockHasPointOutputObservers();
class PointOutputObserver {
    constructor(node, outputSlots) {
        this.node = node;
        this.outputSlots = outputSlots;
    }
    update(data) {
        var _a, _b, _c, _d, _e, _f;
        logger.debug(`Node ${this.node.getReadableId()} receives point: ${data.point.identifier()} - ${data.connStatus.status.label}`);
        this.node.setOutputData(this.outputSlots.output, (_b = (_a = data.point) === null || _a === void 0 ? void 0 : _a.pointValue) === null || _b === void 0 ? void 0 : _b.presentValue);
        this.node.setOutputData(this.outputSlots.priority, (_d = (_c = data.point) === null || _c === void 0 ? void 0 : _c.pointValue) === null || _d === void 0 ? void 0 : _d.priority);
        this.node.setOutputData(this.outputSlots.priorityArray, (_f = (_e = data.point) === null || _e === void 0 ? void 0 : _e.pointValue) === null || _f === void 0 ? void 0 : _f.priorityArray);
    }
}
exports.PointOutputObserver = PointOutputObserver;
class CentralizedPointOutputObserver {
    constructor(node, outputSlot) {
        this.node = node;
        this.outputSlot = outputSlot;
    }
    update(data) {
        var _a, _b;
        logger.debug(`Node ${this.node.getReadableId()} receives point: ${data.point.identifier()} - ${data.connStatus.status.label}`);
        this.node.setOutputData(this.outputSlot, Object.assign(Object.assign({}, (_b = (_a = this.node.outputs[this.outputSlot]) === null || _a === void 0 ? void 0 : _a.data, (_b !== null && _b !== void 0 ? _b : {}))), this.convert(data)));
    }
}
exports.CentralizedPointOutputObserver = CentralizedPointOutputObserver;
function PointNodeMixin(Base) {
    class PointNodeMixinBase extends Base {
        constructor() {
            super(...arguments);
            this._iPresentValue = 'present-value';
            this._iPriority = 'point-priority';
            this._iPriorityArrayLot = 'inputPriorityArray';
            this._iPriorityArrayJson = 'priority-array';
            this._sInputGroup = 'inputGroup';
            this._sInputMethod = 'inputMethod';
            this._sDecimal = 'decimals';
            this._oOut = 'out';
            this._oPriority = 'priority';
            this._oPriorityArray = 'priority-array';
        }
        onAdded() {
            if (this.side !== container_1.Side.server) {
                return;
            }
            let current = this.flowHandler().initializePointBySettingObject();
            this.flowHandler().notifyOutput(this.flowHandler().handleOnUpdate(current), this.pointObservers());
            this.updateTitle();
        }
        onAfterSettingsChange(oldSettings, oldName) {
            this.handleDynamicInput(oldSettings);
            if (this.side !== container_1.Side.server) {
                return;
            }
            let prev = this.flowHandler().initializePointBySettingObject(oldSettings);
            let current = this.flowHandler().initializePointBySettingInput();
            this.flowHandler().notifyOutput(this.flowHandler().handleOnUpdate(current, prev), this.pointObservers());
            this.updateTitle();
        }
        onInputUpdated() {
            if (this.side !== container_1.Side.server) {
                return;
            }
            let prev = this.flowHandler().initializePointBySettingObject();
            this.reEvaluateSettingByInput(this.inputs, this.settings);
            let current = this.flowHandler().initializePointBySettingInput();
            this.flowHandler().notifyOutput(this.flowHandler().handleOnUpdate(current, prev), this.pointObservers());
            this.updateTitle();
        }
        reEvaluateSettingByInput(inputs, settings) {
            if (helper_1.isFunction(super['reEvaluateSettingByInput'])) {
                super['reEvaluateSettingByInput'](inputs, settings);
            }
            let inputMethod = point_node_utils_1.InputMethod.enumValueOf(this.settings[this._sInputMethod].value);
            let pv;
            if (inputMethod === point_node_utils_1.InputMethod.VALUE_PRIORITY) {
                let presentValue = this.inputs[this.valueInputIdx()].updated
                    ? this.inputs[this.valueInputIdx()].data
                    : this.settings[this._iPresentValue].value;
                let priority = this.inputs[this.priorityInputIdx()].updated
                    ? this.inputs[this.priorityInputIdx()].data
                    : this.settings[this._iPriority].value;
                pv = point_model_1.PointValueCreator.init(presentValue, priority);
                this.settings[this._iPresentValue].value = pv.presentValue;
                this.settings[this._iPriority].value = pv.priority;
            }
            if (inputMethod === point_node_utils_1.InputMethod.PRIORITY_ARRAY_LOT) {
                let startIdx = this.priorityArrayInputIdx();
                pv = point_model_1.PointValueCreator.by(Array.from(helper_1.range(startIdx + 1, startIdx + 16)).map(i => this.inputs[i].data));
                this.settings[this._iPriorityArrayLot].value = pv.priorityArray;
            }
            if (inputMethod === point_node_utils_1.InputMethod.PRIORITY_ARRAY_JSON) {
                pv = point_model_1.PointValueCreator.by(this.inputs[this.priorityArrayInputIdx()].data);
                this.settings[this._iPriorityArrayJson].value = pv.priorityArray;
            }
        }
        pointObservers() {
            return [new PointOutputObserver(this, {
                    output: this.valueOutputIdx(),
                    priority: this.priorityOutputIdx(),
                    priorityArray: this.priorityArrayOutputIdx(),
                })];
        }
        priorityInputIdx() {
            return this.valueInputIdx() + 1;
        }
        priorityArrayInputIdx() {
            return this.priorityInputIdx() + 1;
        }
        priorityOutputIdx() {
            return this.valueOutputIdx() + 1;
        }
        priorityArrayOutputIdx() {
            return this.priorityOutputIdx() + 1;
        }
        presentValueType() {
            return node_io_1.Type.NUMBER;
        }
        mixinPointValueInputOutput() {
            this.addOutput(this._oOut, node_io_1.Type.NUMBER);
            this.addOutput(this._oPriority, node_io_1.Type.NUMBER);
            this.addOutput(this._oPriorityArray, node_io_1.Type.JSON);
            this.settings[this.modelSettingKey()] = { description: '', value: null };
            this.settings[this._iPriorityArrayLot] = { description: '', value: null };
            this.settings[this._sInputGroup] = { description: 'Input Settings', value: '', type: node_1.SettingType.GROUP };
            this.settings[this._sDecimal] = { description: 'Decimal Places (Limit 5)', value: 3, type: node_1.SettingType.NUMBER };
            this.settings[this._sInputMethod] = {
                description: 'Input Method',
                type: node_1.SettingType.DROPDOWN,
                config: { items: point_node_utils_1.InputMethod.items() },
                value: point_node_utils_1.InputMethod.VALUE_PRIORITY.enumKey,
            };
            this.addInputWithSettings(this._iPresentValue, this.presentValueType(), null, 'Present Value');
            this.addInputWithSettings(this._iPriority, node_io_1.Type.NUMBER, 16, 'Point Priority');
            this.addInputWithSettings(this._iPriorityArrayJson, node_io_1.Type.JSON, null, 'Priority Array in JSON or Array');
            this.inputs[this.priorityArrayInputIdx()].setting.hidden = true;
            let cfg = {};
            for (let value of helper_1.range(1, 16)) {
                this.settings[`in${value}`] = { description: `in${value}`, type: node_1.SettingType.BOOLEAN, value: false };
                this.addInput(`[in${value}]`, node_io_1.Type.NUMBER, { exist: false, nullable: true, hidden: true });
                cfg[`in${value}`] = () => point_node_utils_1.InputMethod.PRIORITY_ARRAY_LOT.enumKey === this.settings[this._sInputMethod].value;
            }
            cfg[this.modelSettingKey()] = () => false;
            cfg[this._iPresentValue] = () => point_node_utils_1.InputMethod.VALUE_PRIORITY.enumKey === this.settings[this._sInputMethod].value;
            cfg[this._iPriority] = () => point_node_utils_1.InputMethod.VALUE_PRIORITY.enumKey === this.settings[this._sInputMethod].value;
            cfg[this._iPriorityArrayLot] = () => false;
            cfg[this._iPriorityArrayJson] = () => false;
            return { conditions: cfg };
        }
        updateTitle() {
            this.title = this.computeTitle();
            this.broadcastSettingsToClients();
        }
        createPointValue(st) {
            var _a, _b, _c;
            let inputMethod = point_node_utils_1.InputMethod.enumValueOf(st['inputMethod'].value);
            let pv;
            let cur = (_b = (_a = this.settings[this.modelSettingKey()]) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.pointValue;
            if (inputMethod === point_node_utils_1.InputMethod.VALUE_PRIORITY) {
                pv = point_model_1.PointValueCreator.create(st[this._iPresentValue].value, st[this._iPriority].value, (_c = cur) === null || _c === void 0 ? void 0 : _c.priorityArray);
            }
            if (inputMethod === point_node_utils_1.InputMethod.PRIORITY_ARRAY_LOT) {
                pv = point_model_1.PointValueCreator.by(st[this._iPriorityArrayLot].value);
            }
            if (inputMethod === point_node_utils_1.InputMethod.PRIORITY_ARRAY_JSON) {
                pv = point_model_1.PointValueCreator.by(st[this._iPriorityArrayJson].value);
            }
            return pv.merge(cur);
        }
        handleDynamicInput(oldSettings) {
            var _a;
            let oldInputMethod = point_node_utils_1.InputMethod.enumValueOf(oldSettings ? (_a = oldSettings[this._sInputMethod]) === null || _a === void 0 ? void 0 : _a.value : null);
            let newInputMethod = point_node_utils_1.InputMethod.enumValueOf(this.settings[this._sInputMethod].value);
            if (oldInputMethod && oldInputMethod === newInputMethod && newInputMethod !== point_node_utils_1.InputMethod.PRIORITY_ARRAY_LOT) {
                return;
            }
            if (newInputMethod === point_node_utils_1.InputMethod.VALUE_PRIORITY) {
                this.hideInput(false, ...helper_1.range(this.priorityArrayInputIdx(), this.priorityArrayInputIdx() + 16));
                this.showInput(false, this.valueInputIdx(), this.priorityInputIdx());
            }
            if (newInputMethod === point_node_utils_1.InputMethod.PRIORITY_ARRAY_LOT) {
                let hidden = [this.valueInputIdx(), this.priorityInputIdx(), this.priorityArrayInputIdx()];
                let show = [];
                for (let idx of helper_1.range(this.priorityArrayInputIdx() + 1, this.priorityArrayInputIdx() + 16)) {
                    this.settings[`in${idx - this.priorityArrayInputIdx()}`].value ? show.push(idx) : hidden.push(idx);
                }
                this.hideInput(false, ...hidden);
                this.showInput(false, ...show);
            }
            if (newInputMethod === point_node_utils_1.InputMethod.PRIORITY_ARRAY_JSON) {
                this.hideInput(false, this.valueInputIdx(), this.priorityInputIdx(), ...helper_1.range(this.priorityArrayInputIdx() + 1, this.priorityArrayInputIdx() + 16));
                this.showInput(false, this.priorityArrayInputIdx());
            }
            this.linkHandler.recomputeInputLinks();
        }
    }
    __decorate([
        decorators_1.ErrorHandler
    ], PointNodeMixinBase.prototype, "reEvaluateSettingByInput", null);
    return PointNodeMixinBase;
}
exports.PointNodeMixin = PointNodeMixin;
//# sourceMappingURL=point-node.js.map