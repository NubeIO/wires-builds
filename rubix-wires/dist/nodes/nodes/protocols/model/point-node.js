"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const point_model_1 = require("../../../../backend/models/point-model");
const decorators_1 = require("../../../../utils/decorators");
const helper_1 = require("../../../../utils/helper");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const point_node_utils_1 = require("./point-node-utils");
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
        }
        onAdded() {
            this.updatePointValueOutput(this.handler().handleOnUpdate(this.handler().initializePointBySettingObject()));
            this.updateTitle();
        }
        onAfterSettingsChange(oldSettings, oldName) {
            this.handleDynamicInput(oldSettings);
            let prev = this.handler().initializePointBySettingObject(oldSettings);
            let current = (this.settings[this.modelSettingKey()].value = this.handler().initializePointBySettingInput());
            this.updatePointValueOutput(this.handler().handleOnUpdate(current, prev));
            this.updateTitle();
        }
        onInputUpdated() {
            let prev = this.handler().initializePointBySettingObject();
            this.reEvaluateSettingByInput(this.inputs, this.settings);
            let current = (this.settings[this.modelSettingKey()].value = this.handler().initializePointBySettingInput());
            this.updatePointValueOutput(this.handler().handleOnUpdate(current, prev));
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
        updatePointValueOutput(pv, nodeId) {
            var _a;
            let self = (nodeId ? registry_1.default._nodes[nodeId] : this);
            if (!self || !pv) {
                return null;
            }
            let npv = pv.merge((_a = self.settings[self.modelSettingKey()]) === null || _a === void 0 ? void 0 : _a.value.pointValue);
            self.setOutputData(this.valueOutputIdx(), npv.presentValue);
            self.setOutputData(this.priorityOutputIdx(), npv.priority);
            self.setOutputData(this.priorityArrayOutputIdx(), npv.priorityArray);
            self.settings[self.modelSettingKey()].value.pointValue = npv;
            return npv;
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
        mixinPointValueInputOutput() {
            this.addOutput('out', node_1.Type.NUMBER);
            this.addOutput('priority', node_1.Type.NUMBER);
            this.addOutput('priority-array', node_1.Type.JSON);
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
            this.addInputWithSettings(this._iPresentValue, node_1.Type.NUMBER, null, 'Present Value');
            this.addInputWithSettings(this._iPriority, node_1.Type.NUMBER, 16, 'Point Priority');
            this.addInputWithSettings(this._iPriorityArrayJson, node_1.Type.JSON, null, 'Priority Array in JSON or Array');
            this.inputs[this.priorityArrayInputIdx()].setting.hidden = true;
            let cfg = {};
            for (let value of helper_1.range(1, 16)) {
                this.settings[`in${value}`] = { description: `in${value}`, type: node_1.SettingType.BOOLEAN, value: false };
                this.addInput(`[in${value}]`, node_1.Type.NUMBER, { exist: false, nullable: true, hidden: true });
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
                return;
            }
            if (newInputMethod === point_node_utils_1.InputMethod.PRIORITY_ARRAY_LOT) {
                let hidden = [this.valueInputIdx(), this.priorityInputIdx(), this.priorityArrayInputIdx()];
                let show = [];
                for (let idx of helper_1.range(this.priorityArrayInputIdx() + 1, this.priorityArrayInputIdx() + 16)) {
                    this.settings[`in${idx - this.priorityArrayInputIdx()}`].value ? show.push(idx) : hidden.push(idx);
                }
                this.hideInput(false, ...hidden);
                this.showInput(false, ...show);
                return;
            }
            if (newInputMethod === point_node_utils_1.InputMethod.PRIORITY_ARRAY_JSON) {
                this.hideInput(false, this.valueInputIdx(), this.priorityInputIdx(), ...helper_1.range(this.priorityArrayInputIdx() + 1, this.priorityArrayInputIdx() + 16));
                this.showInput(false, this.priorityArrayInputIdx());
                return;
            }
        }
    }
    __decorate([
        decorators_1.ErrorHandler
    ], PointNodeMixinBase.prototype, "reEvaluateSettingByInput", null);
    return PointNodeMixinBase;
}
exports.PointNodeMixin = PointNodeMixin;
//# sourceMappingURL=point-node.js.map