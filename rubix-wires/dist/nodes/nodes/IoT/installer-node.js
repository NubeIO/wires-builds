"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const installer_1 = require("../../../backend/installer");
const promise_actor_1 = require("../../../promise-actor");
const constants_1 = require("../../constants");
const container_1 = require("../../container");
const node_1 = require("../../node");
const api_node_1 = require("./shared/api-node");
const mixin_1 = require("./shared/mixin");
const top_level_api_container_node_1 = require("./shared/top-level-api-container-node");
class ModulesParentContainerNode extends top_level_api_container_node_1.default {
    constructor() {
        super(...arguments);
        this.title = 'Modules';
    }
    collectChildNodes(nodes) {
        return nodes.filter(v => v instanceof ModuleNode);
    }
    initAPI() {
        return new installer_1.ModuleAPI();
    }
    fetchChildren() {
        return this.api.list();
    }
    childNodeType() {
        return [constants_1.MODULE_NODE_TYPE];
    }
}
exports.ModulesParentContainerNode = ModulesParentContainerNode;
class ServicesParentContainerNode extends top_level_api_container_node_1.default {
    constructor() {
        super(...arguments);
        this.title = 'Services';
    }
    collectChildNodes(nodes) {
        return nodes.filter(v => v instanceof ServiceNode);
    }
    initAPI() {
        return new installer_1.ServiceAPI();
    }
    fetchChildren() {
        return this.api.list();
    }
    childNodeType() {
        return [constants_1.SERVICE_NODE_TYPE];
    }
}
exports.ServicesParentContainerNode = ServicesParentContainerNode;
class BaseServiceNode extends api_node_1.default {
    constructor(container) {
        super(container);
        this.required_settings = ['service_id', 'service_name', 'version'];
        this.settingFields = {
            service_id: node_1.SettingType.STRING,
            service_name: node_1.SettingType.STRING,
            version: node_1.SettingType.STRING,
            service_type: node_1.SettingType.STRING,
            published_by: node_1.SettingType.STRING,
            state: node_1.SettingType.STRING,
            deploy_id: node_1.SettingType.STRING,
            deploy_location: node_1.SettingType.STRING,
            created_at: node_1.SettingType.READONLY,
            modified_at: node_1.SettingType.READONLY,
        };
        this.settingsHeaderComponent = {
            props: ['self'],
            template: '<div>' +
                '  <v-alert v-if="self.properties.is_protected" type="warning">Waiting for required fields <br />' +
                `    <small>(${this.required_settings.join(', ')})</small>` +
                '  </v-alert>' +
                '</div>',
        };
        this.onAdded = mixin_1.default.prototype.onAdded.bind(this);
        this.onRemoved = mixin_1.default.prototype.onRemoved.bind(this);
        this.entryId = () => this.entry() && this.entry().service_id;
        this.syncWithBackend = () => {
        };
        this.title = this.namePrefix();
    }
    onAfterSettingsChange() {
        if (this.side !== container_1.Side.server || !this.areSettingsValid())
            return;
        if (!this.entry()) {
            promise_actor_1.singleton.process(() => this.createEntry()
                .then(entry => this.applyEntry(entry))
                .then(() => this.displayMessage(`${this.namePrefix()} entry created.`))
                .catch(e => this.displayError(e, 'Entry not created.')));
        }
        else {
            mixin_1.default.prototype.onAfterSettingsChange.call(this);
        }
    }
    applyEntry(entry) {
        this.settingFields['service_id'] = node_1.SettingType.READONLY;
        mixin_1.default.prototype.applyEntry.call(this, entry);
        this.properties.is_protected = !entry;
        this.broadcastPropertiesToClients();
    }
    onCreated() {
        if (this.entry()) {
            this.applyEntry(this.entry());
        }
        else {
            this.properties.is_protected = true;
            lodash_1.merge(this.settings, this.createSettingForm(null));
        }
    }
    createEntry() {
        const entry = Object.keys(this.settingFields)
            .map(key => ({ [key]: this.settings[key].value }))
            .reduce(lodash_1.merge);
        return this.backend.create(this.settings['service_id'].value, entry);
    }
    areSettingsValid() {
        return this.required_settings.map(key => this.settings[key].value).reduce((a, b) => a && b);
    }
}
class ModuleNode extends BaseServiceNode {
    namePrefix() {
        return 'Module';
    }
    initAPI() {
        return new installer_1.ModuleAPI();
    }
}
class ServiceNode extends BaseServiceNode {
    namePrefix() {
        return 'Service';
    }
    initAPI() {
        return new installer_1.ServiceAPI();
    }
}
container_1.Container.registerNodeType(constants_1.MODULES_PARENT_CONTAINER_TYPE, ModulesParentContainerNode, null, false);
container_1.Container.registerNodeType(constants_1.SERVICES_PARENT_CONTAINER_TYPE, ServicesParentContainerNode, null, false);
container_1.Container.registerNodeType(constants_1.MODULE_NODE_TYPE, ModuleNode, null, false);
container_1.Container.registerNodeType(constants_1.SERVICE_NODE_TYPE, ServiceNode, null, false);
//# sourceMappingURL=installer-node.js.map