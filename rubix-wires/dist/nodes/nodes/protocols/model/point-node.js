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
function PointNodeMixin(Base) {
    class PointNodeMixinBase extends Base {
        onAdded() {
            this.updateOutput(this.handler().handleOnUpdate(this.handler().initializePointBySettingObject()));
            this.updateTitle();
        }
        onAfterSettingsChange(oldSettings, oldName) {
            this.settings[this.modelSettingKey()].value = this.handler().initializePointBySettingInput();
            this.updateOutput(this.handler().handleOnUpdate(this.handler().initializePointBySettingObject(), this.handler().initializePointBySettingObject(oldSettings)));
            this.updateTitle();
        }
        onInputUpdated() {
            let prev = this.handler().initializePointBySettingObject();
            this.reEvaluateSettingByInput();
            this.updateOutput(this.handler().handleOnUpdate(this.handler().initializePointBySettingObject(), prev));
            this.updateTitle();
        }
        reEvaluateSettingByInput() {
            if (super['reEvaluateSettingByInput'] && helper_1.isFunction(super['reEvaluateSettingByInput'])) {
                super['reEvaluateSettingByInput']();
            }
            let prevPV = this.createPointValue(this.settings);
            let currentPV = point_model_1.PointValueCreator.init(this.inputs[this.presentValueInputIdx()].data, this.inputs[this.priorityInputIdx()].data, this.inputs[this.priorityArrayInputIdx()].data);
            let cov = currentPV.changedOfValue(prevPV);
            this.settings['present-value'].value = this.inputs[this.presentValueInputIdx()].data = cov
                ? cov.presentValue
                : currentPV.presentValue;
            this.settings['point-priority'].value = this.inputs[this.priorityInputIdx()].data = cov
                ? cov.priority
                : currentPV.priority;
            this.settings['priority-array'].value = this.inputs[this.priorityArrayInputIdx()].data = cov
                ? cov.priorityArray
                : currentPV.priorityArray;
            this.settings[this.modelSettingKey()].value = this.handler().initializePointBySettingInput();
        }
        priorityInputIdx() {
            return this.presentValueInputIdx() + 1;
        }
        priorityArrayInputIdx() {
            return this.priorityInputIdx() + 1;
        }
        mixinPointValueInputOutput() {
            this.settings['input_group'] = { description: 'Input Settings', value: '', type: node_1.SettingType.GROUP };
            this.settings['decimals'] = { description: 'Decimal Places (Limit 5)', value: 3, type: node_1.SettingType.NUMBER };
            this.settings['inputMethod'] = {
                description: 'Input Method',
                type: node_1.SettingType.DROPDOWN,
                config: {
                    items: [
                        { value: 0, text: 'Value and Priority' },
                        { value: 1, text: 'Priority Array' },
                        { value: 2, text: 'JSON' },
                    ],
                },
                value: 0,
            };
            this.addInputWithSettings('present-value', node_1.Type.NUMBER, null, 'Present Value');
            this.addInputWithSettings('point-priority', node_1.Type.NUMBER, 16, 'Point Priority');
            this.addInputWithSettings('priority-array', node_1.Type.JSON, null, 'Priority Array in JSON or Array');
            this.addOutput('out', node_1.Type.NUMBER);
            this.addOutput('priority', node_1.Type.NUMBER);
            this.addOutput('priority-array', node_1.Type.JSON);
            this.settings[this.modelSettingKey()] = { description: '', value: null };
            let cfg = {};
            cfg[this.modelSettingKey()] = () => false;
            cfg['priority-array'] = () => false;
            return { conditions: cfg };
        }
        updateOutput(pv, nodeId) {
            var _a, _b, _c, _d;
            let self = (nodeId ? registry_1.default._nodes[nodeId] : this);
            if (!self || !pv) {
                return;
            }
            let priorityArray = (_b = (_a = pv) === null || _a === void 0 ? void 0 : _a.priorityArray, (_b !== null && _b !== void 0 ? _b : self.settings['priority-array'].value));
            let npv = point_model_1.PointValueCreator.create((_c = pv) === null || _c === void 0 ? void 0 : _c.presentValue, (_d = pv) === null || _d === void 0 ? void 0 : _d.priority, priorityArray);
            self.setOutputData(0, npv.presentValue);
            self.setOutputData(1, npv.priority);
            self.setOutputData(2, npv.priorityArray);
            self.settings[self.modelSettingKey()].value.pointValue = npv;
            self.settings['priority-array'].value = npv.priorityArray;
            return npv;
        }
        updateTitle() {
            this.title = this.computeTitle();
            this.broadcastSettingsToClients();
        }
        createPointValue(st) {
            return point_model_1.PointValueCreator.create(st['present-value'].value, st['point-priority'].value, st['priority-array'].value);
        }
    }
    __decorate([
        decorators_1.ErrorHandler
    ], PointNodeMixinBase.prototype, "reEvaluateSettingByInput", null);
    return PointNodeMixinBase;
}
exports.PointNodeMixin = PointNodeMixin;
//# sourceMappingURL=point-node.js.map