"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../utils/helper");
const node_1 = require("../node");
class NodeInputOutputDecoratorProxy {
    constructor(func) {
        this.func = func;
    }
    static execute(func) {
        new NodeInputOutputDecoratorProxy(func).reEvaluateSettingByInput();
    }
    reEvaluateSettingByInput() {
        if (this.func && helper_1.isFunction(this.func)) {
            this.func();
        }
    }
}
exports.NodeInputOutputDecoratorProxy = NodeInputOutputDecoratorProxy;
function AbleEnableNode(Base) {
    class AbleEnableNodeBase extends Base {
        mixinEnableInputSetting() {
            this.addInputWithSettings(this.enableSettingKey(), node_1.Type.BOOLEAN, false, this.enableDescription());
            return { conditions: {} };
        }
        reEvaluateSettingByInput() {
            var _a;
            if (super['reEvaluateSettingByInput'] && helper_1.isFunction(super['reEvaluateSettingByInput'])) {
                super['reEvaluateSettingByInput']();
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
            let parentIsEnabled = true;
            if (super['isEnabled'] && helper_1.isFunction(super['isEnabled'])) {
                parentIsEnabled = super['isEnabled']();
            }
            return parentIsEnabled && this.settings[this.enableSettingKey()].value;
        }
    }
    return AbleEnableNodeBase;
}
exports.AbleEnableNode = AbleEnableNode;
//# sourceMappingURL=node-mixin.js.map