"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../utils/helper");
const node_io_1 = require("../node-io");
class NodeInputOutputDecoratorProxy {
    constructor(func) {
        this.func = func;
    }
    reEvaluateSettingByInput(inputs, settings) {
        if (this.func && helper_1.isFunction(this.func)) {
            this.func(inputs, settings);
        }
    }
}
exports.NodeInputOutputDecoratorProxy = NodeInputOutputDecoratorProxy;
function AbleEnableNode(Base) {
    class AbleEnableNodeBase extends Base {
        mixinEnableInputSetting() {
            this.addInputWithSettings(this.enableSettingKey(), node_io_1.Type.BOOLEAN, false, this.enableDescription());
            return { conditions: {} };
        }
        reEvaluateSettingByInput(inputs, settings) {
            var _a;
            if (helper_1.isFunction(super['reEvaluateSettingByInput'])) {
                super['reEvaluateSettingByInput'](inputs, settings);
            }
            this.settings[this.enableSettingKey()].value = (_a = this.inputs[this.enableInputIdx()].data, (_a !== null && _a !== void 0 ? _a : this.settings[this.enableSettingKey()].value));
        }
        enableInputIdx() {
            return 0;
        }
        enableSettingKey() {
            return 'enable';
        }
        isEnabled() {
            var _a;
            let parentIsEnabled = true;
            if (helper_1.isFunction(super['isEnabled'])) {
                parentIsEnabled = super['isEnabled']();
            }
            return parentIsEnabled && ((_a = this.settings[this.enableSettingKey()]) === null || _a === void 0 ? void 0 : _a.value);
        }
    }
    return AbleEnableNodeBase;
}
exports.AbleEnableNode = AbleEnableNode;
//# sourceMappingURL=node-mixin.js.map