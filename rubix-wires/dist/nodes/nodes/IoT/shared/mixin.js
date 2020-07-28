"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const promise_actor_1 = require("../../../../promise-actor");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
class Mixin extends node_1.Node {
    entry() {
        return this.properties.entry;
    }
    entryId() {
        return this.entry() && this.entry().entryId();
    }
    applyEntry(entry) {
        this.properties.entry = Object.assign(this.entryFactory(), entry);
        this.title = this.namePrefix() + ' ' + this.properties.entry.label();
        this.size = this.computeSize();
        if (this.settings['name']) {
            this.settings['name'].value = this.entryId();
        }
        lodash_1.merge(this.settings, this.createSettingForm(entry));
        this.broadcastSettingsToClients();
        this.broadcastTitleToClients();
    }
    createSettingForm(entry) {
        return Object.keys(this.settingFields)
            .map(key => ({
            [key]: {
                description: key,
                value: entry ? entry[key] : null,
                type: this.settingFields[key],
            },
        }))
            .reduce(lodash_1.merge);
    }
    deactivate() {
        this.properties.entry = null;
    }
    onCreated() {
        if (this.entry()) {
            this.applyEntry(this.entry());
        }
        else {
            if (this.side !== container_1.Side.server)
                return;
            promise_actor_1.singleton.process(() => this.createEntry()
                .then(entry => this.applyEntry(entry))
                .catch(e => {
                this.displayError(e, 'Entry not created.');
                console.log(e);
                this.deactivate();
                this.container.removeBroadcasted(this);
            }));
        }
    }
    onAdded() {
        if (this.entry()) {
            this.applyEntry(this.entry());
        }
    }
    onAfterSettingsChange() {
        if (this.side !== container_1.Side.server)
            return;
        const update = {};
        const current = {};
        Object.keys(this.settingFields)
            .filter(key => this.settingFields[key] !== node_1.SettingType.READONLY)
            .forEach(key => {
            update[key] = this.settings[key].value;
            current[key] = this.entry() && this.entry()[key];
        });
        if (!lodash_1.isEqual(current, update)) {
            promise_actor_1.singleton.process(() => this.updateEntry(update).catch(e => this.displayError(e, 'Unable to update entry remotely.')));
        }
    }
    onRemoved() {
        if (this.side !== container_1.Side.server || !this.entry())
            return Promise.resolve();
        return promise_actor_1.singleton.process(() => this.deleteEntry().catch(e => {
            this.displayError(e, 'Failed to remove entry from backend.');
            console.log(e);
        }));
    }
    findFreeIdentifier() {
        return this.getTakenIdentifiers().then(takenIdentifiers => {
            for (let i = 1;; i += 1) {
                const identifier = this.makeIdentifier(i);
                if (!takenIdentifiers.includes(identifier))
                    return identifier;
            }
        });
    }
    getTakenIdentifiers() {
        const globalSiblings = container_1.Container.rootContainer().getNodesByClass(this.constructor, true);
        return Promise.resolve(globalSiblings.filter(n => n.entry()).map(v => v.entry().identifier()));
    }
    makeIdentifier(n) {
        return `WIRES_${this.namePrefix().toUpperCase()}_${n}`;
    }
}
exports.default = Mixin;
//# sourceMappingURL=mixin.js.map