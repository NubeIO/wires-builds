"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const enumify_1 = require("enumify");
const decorators_1 = require("../../../utils/decorators");
const helper_1 = require("../../../utils/helper");
const container_1 = require("../../container");
const container_node_1 = require("../../container-node");
const node_1 = require("../../node");
const node_mixin_1 = require("../node-mixin");
class ConnectionStatus extends enumify_1.Enumify {
    constructor(label) {
        super();
        this.label = label;
    }
    isConnected() {
        return this === ConnectionStatus.CONNECTED;
    }
    isError() {
        return this === ConnectionStatus.ERROR;
    }
    isDisconnected() {
        return this === ConnectionStatus.DISCONNECTED;
    }
    isUnconnected() {
        return this === ConnectionStatus.UNCONNECTED;
    }
}
exports.ConnectionStatus = ConnectionStatus;
ConnectionStatus.CONNECTED = new ConnectionStatus('CONNECTED');
ConnectionStatus.DISCONNECTED = new ConnectionStatus('DISCONNECTED');
ConnectionStatus.ERROR = new ConnectionStatus('ERROR');
ConnectionStatus.UNCONNECTED = new ConnectionStatus('UNCONNECTED');
ConnectionStatus._ = ConnectionStatus.closeEnum();
function ExternalConnectionNodeMixin(Base) {
    class ExternalConnectionNodeMixinBase extends node_mixin_1.AbleEnableNode(Base) {
        constructor() {
            super(...arguments);
            this.connectionStatus = ConnectionStatus.UNCONNECTED;
        }
        static setOutputStatus(node, status, errMsg) {
            node.connectionStatus = status;
            node.setOutputData(node.statusOutputIdx(), node.getConnectionStatus().label);
            node.setOutputData(node.errorOutputIdx(), (errMsg !== null && errMsg !== void 0 ? errMsg : ''));
        }
        errorOutputIdx() {
            return this.statusOutputIdx() + 1;
        }
        getConnectionStatus() {
            if (!this.isEnabled()) {
                return (this.connectionStatus = ConnectionStatus.UNCONNECTED);
            }
            if (this.connectionStatus.isError()) {
                return this.connectionStatus;
            }
            this.connectionStatus = this.connectedCondition() ? ConnectionStatus.CONNECTED : ConnectionStatus.DISCONNECTED;
            return this.connectionStatus;
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
class ProtocolDeviceNode extends ExternalConnectionNodeMixin(container_node_1.ContainerNode) {
    constructor(container, title, description) {
        super(container);
        this._title = title;
        this.description = description;
        this.mixinConnectionStatusOutput();
    }
    statusOutputIdx() {
        return 0;
    }
    onCreated() {
        super.onCreated();
        this.name = `${this._title} cid_${this.container.id}_id${this.id}`;
    }
    onAdded() {
        this.startOrStop();
        this.applyTitle();
    }
    onAfterSettingsChange() {
        this.startOrStop();
        this.applyTitle();
    }
    onInputUpdated() {
        this.reEvaluateSettingByInput(this.inputs, this.settings);
        this.onAfterSettingsChange();
    }
    onRemoved() {
        this.stop();
        super.onRemoved();
    }
    applyTitle() {
        super.applyTitle();
    }
    emit(connectionStatus, dependants) {
        dependants.filter(d => helper_1.isNotNull(d)).forEach(dependant => dependant.watch(connectionStatus));
    }
    enableDescription() {
        return `Enable ${this._title}`;
    }
    startOrStop() {
        if (this.side !== container_1.Side.server)
            return;
        this.stop();
        ProtocolDeviceNode.setOutputStatus(this, ConnectionStatus.UNCONNECTED);
        if (this.isEnabled()) {
            this.kickoff(this);
        }
        this.emit(this.getConnectionStatus(), this.dependantsConnectionNode());
    }
    kickoff(node) {
        node.createThenStart();
        ProtocolDeviceNode.setOutputStatus(node, ConnectionStatus.CONNECTED);
    }
    handleErrorInKickOff(err, node) {
        var _a;
        ProtocolDeviceNode.setOutputStatus(node, ConnectionStatus.ERROR, (_a = err) === null || _a === void 0 ? void 0 : _a.message);
    }
}
__decorate([
    decorators_1.ErrorCallbackHandler((err, node) => node.handleErrorInKickOff(err, node))
], ProtocolDeviceNode.prototype, "kickoff", null);
exports.ProtocolDeviceNode = ProtocolDeviceNode;
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
        watch(connectionStatus) {
            DependantConnectionNodeMixinBase.setOutputStatus(this, connectionStatus);
        }
        connectedCondition() {
            let parentNode = this.getParentNode();
            if (parentNode && helper_1.isFunction(parentNode['getConnectionStatus'])) {
                return parentNode['getConnectionStatus']().isConnected();
            }
            return true;
        }
        handleError(err, func) {
            var _a;
            this.debug(`Error when executing function ${func} in node ${this.getReadableId()}`);
            DependantConnectionNodeMixinBase.setOutputStatus(this, ConnectionStatus.ERROR, (_a = err) === null || _a === void 0 ? void 0 : _a.message);
        }
        executeFunction(func, ...args) {
            try {
                this.connectionStatus = ConnectionStatus.UNCONNECTED;
                if (super[func] && helper_1.isFunction(super[func])) {
                    super[func](...args);
                }
                DependantConnectionNodeMixinBase.setOutputStatus(this, this.getConnectionStatus());
            }
            catch (err) {
                this.handleError(err, func);
            }
        }
    }
    return DependantConnectionNodeMixinBase;
}
exports.DependantConnectionNodeMixin = DependantConnectionNodeMixin;
//# sourceMappingURL=ProtocolDeviceNode.js.map