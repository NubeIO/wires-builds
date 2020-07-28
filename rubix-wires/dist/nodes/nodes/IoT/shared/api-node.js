"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const mixin_1 = require("./mixin");
class ApiNode extends node_1.Node {
    constructor(container) {
        super(container);
        this.clonable = false;
        this.removable = false;
        this.movable = false;
        this.entry = mixin_1.default.prototype.entry.bind(this);
        this.entryId = mixin_1.default.prototype.entryId.bind(this);
        this.deactivate = mixin_1.default.prototype.deactivate.bind(this);
        this.createSettingForm = mixin_1.default.prototype.createSettingForm.bind(this);
        this.getTakenIdentifiers = mixin_1.default.prototype.getTakenIdentifiers.bind(this);
        this.makeIdentifier = mixin_1.default.prototype.makeIdentifier.bind(this);
        this.findFreeIdentifier = mixin_1.default.prototype.findFreeIdentifier.bind(this);
        this.entryFactory = () => this.backend.factoryEntry();
        this.updateEntry = (body) => this.backend.update(body, this.entryId());
        this.deleteEntry = () => this.backend.delete(this.entryId());
        this.description = 'placeholder';
        this.backend = this.initAPI();
        this.settings['name'] = {
            description: 'Entry',
            value: this.title,
            type: node_1.SettingType.READONLY,
        };
    }
}
exports.default = ApiNode;
//# sourceMappingURL=api-node.js.map