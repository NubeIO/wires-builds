"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logplease_1 = require("logplease");
const enums_1 = require("../../../utils/enums");
const helper_1 = require("../../../utils/helper");
const node_1 = require("../../node");
const registry_1 = require("../../registry");
const node_mixin_1 = require("../node-mixin");
const logger = logplease_1.create('observer', { color: logplease_1.Colors.Yellow });
class ConnectionOutput {
    constructor(status, error) {
        this.status = status;
        this.error = error;
    }
}
exports.ConnectionOutput = ConnectionOutput;
class ConnectionOutputObserver {
    constructor(node, outputSlots) {
        this.node = node;
        this.outputSlots = outputSlots;
    }
    update(data, eventSourceId) {
        var _a, _b;
        let current = enums_1.ConnectionStatus.lookupByLabel(this.node.outputs[this.outputSlots.status].data);
        let nodeId = registry_1.default.getId(this.node.cid, this.node.id);
        let itselfConnected = helper_1.isFunction(this.node['isConnConnected']) ? this.node['isConnConnected']() : true;
        if (eventSourceId && nodeId !== eventSourceId && (((_a = current) === null || _a === void 0 ? void 0 : _a.isError()) || !itselfConnected)) {
            return;
        }
        logger.debug(`Node ${this.node.getReadableId()} receives connection status '${data.status.label}' ` +
            `from source id '${(eventSourceId !== null && eventSourceId !== void 0 ? eventSourceId : nodeId)}'`);
        this.node.setOutputData(this.outputSlots.status, data.status.label);
        this.node.setOutputData(this.outputSlots.error, (_b = data.error, (_b !== null && _b !== void 0 ? _b : '')));
    }
}
exports.ConnectionOutputObserver = ConnectionOutputObserver;
function ExternalConnectionNodeMixin(Base) {
    class ExternalConnectionNodeMixinBase extends node_mixin_1.AbleEnableNode(Base) {
        constructor() {
            super(...arguments);
            this.connectionStatus = enums_1.ConnectionStatus.UNCONNECTED;
        }
        statusObserver() {
            return new ConnectionOutputObserver(this, { status: this.statusOutputIdx(), error: this.errorOutputIdx() });
        }
        getConnectionStatus() {
            var _a;
            if (!this.isEnabled()) {
                return (this.connectionStatus = enums_1.ConnectionStatus.UNCONNECTED);
            }
            if ((_a = this.connectionStatus) === null || _a === void 0 ? void 0 : _a.isError()) {
                return this.connectionStatus;
            }
            this.connectionStatus = this.isConnConnected() ? enums_1.ConnectionStatus.CONNECTED : enums_1.ConnectionStatus.DISCONNECTED;
            return this.connectionStatus;
        }
        errorOutputIdx() {
            return this.statusOutputIdx() + 1;
        }
        mixinConnectionStatusOutput() {
            this.addOutput('status', node_1.Type.STRING);
            this.addOutput('error', node_1.Type.STRING);
            this.setOutputData(this.statusOutputIdx(), this.getConnectionStatus().label);
            return {};
        }
    }
    return ExternalConnectionNodeMixinBase;
}
exports.ExternalConnectionNodeMixin = ExternalConnectionNodeMixin;
function DependantConnectionNodeMixin(Base) {
    class DependantConnectionNodeMixinBase extends ExternalConnectionNodeMixin(Base) {
        onAdded() {
            this.executeFunction('onAdded');
        }
        onAfterSettingsChange(oldSettings, oldName) {
            this.executeFunction('onAfterSettingsChange', oldSettings, oldName);
        }
        onInputUpdated() {
            this.executeFunction('onInputUpdated');
        }
        parentConnectionNode() {
            let parentNode = this.getParentNode();
            if (parentNode && helper_1.isFunction(parentNode['getConnectionStatus'])) {
                return parentNode;
            }
            return null;
        }
        isConnConnected() {
            var _a, _b;
            let isParentConnected = (_b = (_a = this.parentConnectionNode()) === null || _a === void 0 ? void 0 : _a.getConnectionStatus().isConnected(), (_b !== null && _b !== void 0 ? _b : false));
            return this.isEnabled() && isParentConnected;
        }
        handleError(err, func) {
            this.debug(`Error when executing function ${func} in node ${this.getReadableId()} - ${err.stack}`);
            this.statusObserver().update(new ConnectionOutput(this.getConnectionStatus(), err.message));
        }
        executeFunction(func, ...args) {
            try {
                if (super[func] && helper_1.isFunction(super[func])) {
                    super[func](...args);
                }
                this.connectionStatus = null;
                this.statusObserver().update(new ConnectionOutput(this.getConnectionStatus()));
            }
            catch (err) {
                this.connectionStatus = enums_1.ConnectionStatus.ERROR;
                this.handleError(err, func);
            }
        }
    }
    return DependantConnectionNodeMixinBase;
}
exports.DependantConnectionNodeMixin = DependantConnectionNodeMixin;
//# sourceMappingURL=connection-node-mixin.js.map