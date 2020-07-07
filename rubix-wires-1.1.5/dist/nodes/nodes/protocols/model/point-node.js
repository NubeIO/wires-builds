"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mixins_1 = require("../../../../mixins");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const point_model_1 = require("./point-model");
function PointNodeMixin(Base) {
    class PointNodeMixinBase extends Base {
        onAdded() {
            this.updateOutput(this.handler().handleOnUpdate(this.handler().initializePointBySettingObject()));
            this.updateTitle();
        }
        onAfterSettingsChange(oldSettings, oldName) {
            this.settings[this.modelSettingKey()].value = this.handler().initializePointBySettingInput();
            this.updateOutput(this.handler().handleOnUpdate(this.settings[this.modelSettingKey()].value, this.handler().initializePointBySettingObject(oldSettings)));
            this.updateTitle();
        }
        onInputUpdated() {
            let prev = this.handler().initializePointBySettingObject();
            this.reEvaluateSettingByInput();
            this.updateOutput(this.handler().handleOnUpdate(this.settings[this.modelSettingKey()].value, prev));
            this.updateTitle();
        }
        reEvaluateSettingByInput() {
            var _a, _b, _c;
            this.settings['present-value'].value = (_a = this.inputs[this.presentValueInputIdx()].data, (_a !== null && _a !== void 0 ? _a : this.settings['present-value'].value));
            this.settings['point-priority'].value = (_b = this.inputs[this.priorityInputIdx()].data, (_b !== null && _b !== void 0 ? _b : this.settings['point-priority'].value));
            this.settings['priority-array'].value = (_c = this.inputs[this.priorityArrayInputIdx()].data, (_c !== null && _c !== void 0 ? _c : this.settings['priority-array'].value));
            this.settings[this.modelSettingKey()].value = this.handler().initializePointBySettingInput();
            if (super['reEvaluateSettingByInput'] && mixins_1.isFunction(super['reEvaluateSettingByInput'])) {
                super['reEvaluateSettingByInput']();
            }
        }
        priorityInputIdx() {
            return this.presentValueInputIdx() + 1;
        }
        priorityArrayInputIdx() {
            return this.priorityInputIdx() + 1;
        }
        mixinPointValueInputOutput() {
            this.addInputWithSettings('present-value', node_1.Type.NUMBER, 0, 'Present Value');
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
            let self = (nodeId ? (registry_1.default._nodes[nodeId]) : this);
            if (!self || !pv) {
                return;
            }
            self.setOutputData(0, (_a = pv) === null || _a === void 0 ? void 0 : _a.presentValue);
            self.setOutputData(1, (_b = pv) === null || _b === void 0 ? void 0 : _b.priority);
            self.setOutputData(2, (_c = pv) === null || _c === void 0 ? void 0 : _c.priorityArray);
            self.settings[this.modelSettingKey()].value.pointValue = pv;
            self.settings['priority-array'].value = (_d = pv) === null || _d === void 0 ? void 0 : _d.priorityArray;
        }
        updateTitle() {
            this.title = this.computeTitle();
            this.broadcastSettingsToClients();
        }
        createPointValue(st) {
            return point_model_1.PointValueCreator.create(st['present-value'].value, st['point-priority'].value, st['priority-array'].value);
        }
    }
    return PointNodeMixinBase;
}
exports.PointNodeMixin = PointNodeMixin;
//# sourceMappingURL=point-node.js.map