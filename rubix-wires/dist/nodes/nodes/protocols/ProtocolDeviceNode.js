"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../../../utils/decorators");
const enums_1 = require("../../../utils/enums");
const pattern_1 = require("../../../utils/pattern");
const container_1 = require("../../container");
const container_node_1 = require("../../container-node");
const registry_1 = require("../../registry");
const connection_node_mixin_1 = require("./connection-node-mixin");
class ProtocolDeviceNode extends connection_node_mixin_1.ExternalConnectionNodeMixin(container_node_1.ContainerNode) {
    constructor(container, title, description) {
        super(container);
        this._title = title;
        this.description = description;
        this.mixinConnectionStatusOutput();
    }
    onCreated() {
        super.onCreated();
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
    statusObservable(observers) {
        observers.push(this.statusObserver());
        return new pattern_1.DefaultObservable(observers);
    }
    statusOutputIdx() {
        return 0;
    }
    enableDescription() {
        return `Enable ${this._title}`;
    }
    startOrStop() {
        if (this.side !== container_1.Side.server)
            return;
        this.stop();
        this.connectionStatus = enums_1.ConnectionStatus.UNCONNECTED;
        if (this.isEnabled()) {
            this.kickoff(this);
        }
        this.notifyConnStatusOutput();
    }
    kickoff(node) {
        node.createThenStart();
        this.notifyConnStatusOutput(enums_1.ConnectionStatus.CONNECTED);
    }
    handleErrorInKickOff(err) {
        this.notifyConnStatusOutput(enums_1.ConnectionStatus.ERROR, err.message);
    }
    notifyConnStatusOutput(status, errMsg) {
        this.connectionStatus = (status !== null && status !== void 0 ? status : this.connectionStatus);
        let nodeId = registry_1.default.getId(this.cid, this.id);
        this.statusObservable(this.connObserverNodes()).notify(new connection_node_mixin_1.ConnectionOutput(this.getConnectionStatus(), errMsg), nodeId);
    }
}
__decorate([
    decorators_1.ErrorCallbackHandler((err, node) => node.handleErrorInKickOff(err))
], ProtocolDeviceNode.prototype, "kickoff", null);
exports.ProtocolDeviceNode = ProtocolDeviceNode;
//# sourceMappingURL=ProtocolDeviceNode.js.map