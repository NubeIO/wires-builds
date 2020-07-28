"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const config_1 = require("../../../../config");
const promise_actor_1 = require("../../../../promise-actor");
const constants_1 = require("../../../constants");
const container_1 = require("../../../container");
const container_node_1 = require("../../../container-node");
const node_1 = require("../../../node");
const mixin_1 = require("./mixin");
class ApiContainerNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.extra_node_types = this.childNodeType().filter(v => constants_1.IOT_TYPES.includes(v));
        this.clonable = false;
        this.movable = false;
        this.entry = mixin_1.default.prototype.entry.bind(this);
        this.entryId = mixin_1.default.prototype.entryId.bind(this);
        this.deactivate = mixin_1.default.prototype.deactivate.bind(this);
        this.createSettingForm = mixin_1.default.prototype.createSettingForm.bind(this);
        this.getTakenIdentifiers = mixin_1.default.prototype.getTakenIdentifiers.bind(this);
        this.makeIdentifier = mixin_1.default.prototype.makeIdentifier.bind(this);
        this.findFreeIdentifier = mixin_1.default.prototype.findFreeIdentifier.bind(this);
        this.description = 'placeholder';
        this.api = this.initAPI();
        this.settings['name'] = {
            description: 'Entry',
            value: this.title,
            type: node_1.SettingType.READONLY,
        };
    }
    entryFactory() {
        return this.api.factoryEntry();
    }
    updateEntry(body) {
        return this.api.update(body, this.entryId());
    }
    deleteEntry() {
        return this.api.delete(this.entryId());
    }
    onAdded() {
        mixin_1.default.prototype.onAdded.call(this);
        super.onAdded();
    }
    applyEntry(entry) {
        mixin_1.default.prototype.applyEntry.call(this, entry);
        this.applyTitle();
        this.broadcastTitleToClients();
    }
    applyTitle() {
        this.sub_container.name = this.title;
        this.size = this.computeSize();
        this.container.runWithEditor(e => {
            if (lodash_1.get(e, 'renderer.container.id') === this.container.id) {
                e.emit('rerender-siderbar-containers');
            }
        });
    }
    onAfterSettingsChange(old) {
        mixin_1.default.prototype.onAfterSettingsChange.call(this);
        super.onAfterSettingsChange(old);
    }
    onCreated() {
        super.onCreated();
        const namePrefix = this.namePrefix();
        const nameSuffix = this.entry() ? ' ' + this.entryId() : '';
        this.settings['name'].value = namePrefix + nameSuffix;
        mixin_1.default.prototype.onCreated.call(this);
    }
    onRemoved() {
        mixin_1.default.prototype.onRemoved.call(this);
    }
    shouldRejectNodeType(type) {
        return !this.childNodeType().includes(type);
    }
    syncWithBackend() {
        if (this.side !== container_1.Side.server)
            return;
        promise_actor_1.singleton.process(() => this.fetchChildren().then(children => {
            const childIds = children.map(v => v.entryId());
            const childNodes = this.collectChildNodes(this.sub_container.getNodes()).map(n => n);
            const existingChildNodes = childNodes.filter(n => childIds.includes(n.entryId()));
            const obsoleteChildNodes = childNodes.filter(n => !n.properties.is_protected && !childIds.includes(n.entryId()));
            obsoleteChildNodes.forEach(n => {
                n.deactivate();
                n.container.removeBroadcasted(n);
            });
            this.processNextChildEntry(children, existingChildNodes);
        }));
    }
    onGetMessageToEditorSide({ action, payload }) {
        super.onGetMessageToEditorSide({ action, payload, key: null });
        if (action === node_1.BROADCAST.UPDATE_TITLE)
            this.applyTitle();
    }
    processNextChildEntry(remaining, childNodes) {
        if (!remaining || remaining.length === 0)
            return;
        const entry = remaining.pop();
        let existingNode = childNodes.find(node => node.entryId() === entry.entryId());
        const callback = () => {
            if (existingNode instanceof ApiContainerNode) {
                existingNode.syncWithBackend();
            }
            this.processNextChildEntry(remaining, childNodes);
        };
        if (!existingNode) {
            const maxVerticalPosition = Math.max(100, ...this.sub_container.getNodes(false).map(n => n.pos[1]));
            const pos = [250, maxVerticalPosition + config_1.default.backendSync.nodeDistance];
            existingNode = (this.sub_container.createNode(entry.nodeType(), { properties: { entry }, pos }, null, false, callback));
        }
        else if (!lodash_1.isEqual(existingNode.entry(), entry)) {
            existingNode.applyEntry(entry);
            existingNode.persistConfiguration(callback);
        }
        else {
            callback();
        }
    }
}
exports.default = ApiContainerNode;
//# sourceMappingURL=api-container-node.js.map