"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mixins_1 = require("../../mixins");
const node_1 = require("../node");
class NodeInputOutputDecoratorProxy {
    constructor(func) {
        this.func = func;
    }
    static execute(func) {
        new NodeInputOutputDecoratorProxy(func).reEvaluateSettingByInput();
    }
    reEvaluateSettingByInput() {
        if (this.func && mixins_1.isFunction(this.func)) {
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
        ;
        reEvaluateSettingByInput() {
            var _a;
            this.settings[this.enableSettingKey()].value = (_a = this.inputs[this.enableInputIdx()].data, (_a !== null && _a !== void 0 ? _a : this.settings[this.enableSettingKey()].value));
            if (super['reEvaluateSettingByInput'] && mixins_1.isFunction(super['reEvaluateSettingByInput'])) {
                super['reEvaluateSettingByInput']();
            }
        }
        enableInputIdx() {
            return 0;
        }
        enableSettingKey() {
            return 'enable';
        }
        isEnabled() {
            return this.settings[this.enableSettingKey()].value;
        }
    }
    return AbleEnableNodeBase;
}
exports.AbleEnableNode = AbleEnableNode;
//# sourceMappingURL=node-mixin.js.map