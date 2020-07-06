"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const container_node_1 = require("../container-node");
const container_1 = require("../container");
const node_1 = require("../node");
const api_1 = require("../../backend/api");
const node_icons_1 = require("../node-icons");
const constants_1 = require("../constants");
const { backendSync } = require('../../../config.json');
let uiMainIcon = node_icons_1.default.uiMainIcon;
let uiMainColour = node_icons_1.default.uiMainColour;
let compareMainIcon = node_icons_1.default.uiMainIcon;
let compareMainColour = node_icons_1.default.uiMainColour;
const doNothing = () => { };
class PromiseActor {
    constructor() {
        this.stack = Promise.resolve(null);
    }
    process(f) {
        const callback = () => f();
        this.stack = this.stack.then(callback, error => {
            console.log(error);
            return callback();
        });
        return Promise.resolve(this.stack);
    }
}
const actor = new PromiseActor();
class Mixin extends node_1.Node {
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
            actor.process(() => this.updateEntry(update));
        }
    }
    onRemoved() {
        if (this.side !== container_1.Side.server || !this.entry())
            return Promise.resolve();
        return actor.process(() => this.deleteEntry());
    }
    entryId() {
        return this.entry() && this.entry().id;
    }
    entry() {
        return this.properties.entry;
    }
    applyEntry(entry) {
        this.properties.entry = entry;
        this.title = this.namePrefix() + ' ' + this.entryId();
        this.size = this.computeSize();
        if (this.settings['name']) {
            this.settings['name'].value = this.entryId();
        }
        Mixin.prototype.createSettingForm.call(this, entry);
        this.broadcastSettingsToClients();
        this.broadcastTitleToClients();
    }
    createSettingForm(entry) {
        Object.keys(this.settingFields).forEach(key => {
            this.settings[key] = {
                description: key,
                value: entry ? entry[key] : null,
                type: this.settingFields[key],
            };
        });
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
            actor.process(() => this.createEntry().then(entry => this.applyEntry(entry)));
        }
    }
    onAdded() {
        if (this.entry()) {
            this.applyEntry(this.entry());
        }
    }
}
class BaseApiParentContainerNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.entry = Mixin.prototype.entry.bind(this);
        this.entryId = Mixin.prototype.entryId.bind(this);
        this.deactivate = Mixin.prototype.deactivate.bind(this);
        this.applyEntry = (entry) => {
            Mixin.prototype.applyEntry.call(this, entry);
            this.size = this.computeSize();
            this.sub_container.name = this.title;
            this.broadcastTitleToClients();
        };
        this.description = 'placeholder';
        this.api = new api_1.default();
        this.settings['name'] = {
            description: 'Entry',
            value: this.title,
            type: node_1.SettingType.READONLY,
        };
        this.headerColor = uiMainColour;
        this.iconImageUrl = uiMainIcon;
    }
    onAdded() {
        Mixin.prototype.onAdded.call(this);
    }
    changeTitle() {
        if (this.entry())
            this.applyEntry(this.entry());
    }
    onAfterSettingsChange(old) {
        super.onAfterSettingsChange(old);
        Mixin.prototype.onAfterSettingsChange.call(this);
    }
    onCreated() {
        super.onCreated();
        const namePrefix = this.namePrefix();
        const nameSuffix = this.entry() ? ' ' + this.entry().id : '';
        this.settings['name'].value = namePrefix + nameSuffix;
        Mixin.prototype.onCreated.call(this);
    }
    shouldRejectNodeType(type) {
        return constants_1.IOT_TYPES.includes(type) && type !== this.childNodeType();
    }
    syncWithBackend() {
        if (this.side !== container_1.Side.server)
            return;
        console.log('Now syncing children of ' + this.namePrefix() + ' ' + (this.entryId() || ''));
        actor.process(() => this.fetchChildren().then(children => {
            const childIds = children.map(v => v.id);
            const childNodes = this.collectChildNodes(this.sub_container.getNodes());
            const existingChildNodes = childNodes.filter(n => childIds.includes(n.entryId()));
            const obsoleteChildNodes = childNodes.filter(n => !n.properties.is_protected && !childIds.includes(n.entryId()));
            obsoleteChildNodes.forEach(n => {
                n.deactivate();
                this.container.remove(n);
            });
            this.proccessNextChildEntry(children, existingChildNodes);
        }));
    }
    proccessNextChildEntry(remaining, childNodes) {
        if (!remaining || remaining.length === 0)
            return;
        const entry = remaining.pop();
        let existingNode = childNodes.find(node => node.entryId() === entry.id);
        const callback = () => {
            if (existingNode instanceof BaseApiParentContainerNode) {
                existingNode.syncWithBackend();
            }
            this.proccessNextChildEntry(remaining, childNodes);
        };
        if (!existingNode) {
            console.log('Creating child node for ' + this.title + ' ' + (entry.id || ''));
            const maxVerticalPosition = Math.max(100, ...this.sub_container.getNodes(false).map(n => n.pos[1]));
            const pos = [250, maxVerticalPosition + backendSync.nodeDistance];
            existingNode = (this.sub_container.createNode(this.childNodeType(), { properties: { entry }, pos }, null, false, callback));
        }
        else if (!lodash_1.isEqual(existingNode.entry(), entry)) {
            console.log('Found existing node with outdated entry, updating...');
            existingNode.applyEntry(entry);
            existingNode.persistConfiguration(callback);
        }
        else
            callback();
    }
    onRemoved() {
        return Mixin.prototype.onRemoved.call(this);
    }
}
class TopLevelApiContainerNode extends BaseApiParentContainerNode {
    constructor() {
        super(...arguments);
        this.settingFields = {};
        this.applyEntry = () => {
            this.title = this.namePrefix();
            this.sub_container.name = this.title;
        };
    }
    onAdded() {
        this.applyEntry();
        this.syncWithBackend();
    }
    createEntry() {
        return Promise.resolve(null);
    }
    updateEntry(body) {
        return Promise.resolve(null);
    }
    deleteEntry() {
        return Promise.resolve(null);
    }
    namePrefix() {
        return this.title;
    }
}
class EdgesParentContainerNode extends TopLevelApiContainerNode {
    constructor() {
        super(...arguments);
        this.title = 'Edges';
    }
    fetchChildren() {
        return this.api.fetchEdges();
    }
    collectChildNodes(nodes) {
        return nodes.filter(v => v instanceof EdgeContainerNode);
    }
    childNodeType() {
        return constants_1.EDGE_CONTAINER_TYPE;
    }
}
exports.EdgesParentContainerNode = EdgesParentContainerNode;
container_1.Container.registerNodeType(constants_1.EDGES_PARENT_CONTAINER_TYPE, EdgesParentContainerNode);
class EdgeContainerNode extends BaseApiParentContainerNode {
    constructor() {
        super(...arguments);
        this.title = 'Edge Container';
        this.settingFields = {
            code: node_1.SettingType.STRING,
            customer_code: node_1.SettingType.STRING,
            side_code: node_1.SettingType.STRING,
            model: node_1.SettingType.STRING,
            firmware_version: node_1.SettingType.STRING,
            data_version: node_1.SettingType.STRING,
        };
    }
    fetchChildren() {
        return this.api.fetchNetworksByDevice(this.entryId());
    }
    createEntry() {
        console.log('ERROR: Edge creation not currently supported.');
        return Promise.resolve(null);
    }
    updateEntry(body) {
        return this.api.updateEdge(this.entryId(), body);
    }
    deleteEntry() {
        return Promise.resolve(null);
    }
    collectChildNodes(nodes) {
        return nodes.filter(v => v instanceof NetworkContainerNode);
    }
    childNodeType() {
        return constants_1.NETWORK_CONTAINER_TYPE;
    }
    namePrefix() {
        return 'Edge';
    }
}
exports.EdgeContainerNode = EdgeContainerNode;
container_1.Container.registerNodeType(constants_1.EDGE_CONTAINER_TYPE, EdgeContainerNode);
class NetworkContainerNode extends BaseApiParentContainerNode {
    constructor() {
        super(...arguments);
        this.title = 'Network Container';
        this.settingFields = {
            state: node_1.SettingType.READONLY,
            protocol: node_1.SettingType.READONLY,
            code: node_1.SettingType.STRING,
        };
    }
    fetchChildren() {
        return this.api.fetchDevicesByNetwork(this.entryId());
    }
    collectChildNodes(nodes) {
        return nodes.filter(v => v instanceof DeviceContainerNode);
    }
    childNodeType() {
        return constants_1.DEVICE_CONTAINER_TYPE;
    }
    namePrefix() {
        return 'Network';
    }
    createEntry() {
        const edge_node = this.container.container_node;
        if (!(edge_node instanceof EdgeContainerNode)) {
            const errorMessage = 'Error: Trying to create network, but network node does not exist inside a valid Edge container...';
            console.log(errorMessage);
            return Promise.reject(errorMessage);
        }
        return this.api.createNetworkForEdge(edge_node.entryId(), {
            code: `WIRES_NETWORK_${this.id}`,
        });
    }
    updateEntry(body) {
        return this.api.updateNetwork(this.entryId(), body);
    }
    deleteEntry() {
        const edge_node = this.container.container_node;
        return this.api.removeNetworkFromEdge(edge_node.entryId(), this.entryId());
    }
}
exports.NetworkContainerNode = NetworkContainerNode;
container_1.Container.registerNodeType(constants_1.NETWORK_CONTAINER_TYPE, NetworkContainerNode);
class DeviceContainerNode extends BaseApiParentContainerNode {
    constructor() {
        super(...arguments);
        this.title = 'Device Container';
        this.settingFields = {
            state: node_1.SettingType.READONLY,
            code: node_1.SettingType.STRING,
            manufacturer: node_1.SettingType.STRING,
            protocol: node_1.SettingType.STRING,
            type: node_1.SettingType.STRING,
        };
    }
    fetchChildren() {
        return this.api.fetchThingsByDevice(this.entryId());
    }
    collectChildNodes(nodes) {
        return nodes.filter(v => v instanceof ThingContainerNode);
    }
    childNodeType() {
        return constants_1.THING_CONTAINER_TYPE;
    }
    namePrefix() {
        return 'Device';
    }
    createEntry() {
        const network_node = this.container.container_node;
        const edge_node = network_node.container.container_node;
        if (!(network_node instanceof NetworkContainerNode)) {
            const errorMessage = 'Error: Trying to create device, but device node does not exist inside a valid Network container...';
            console.log(errorMessage);
            return Promise.reject(errorMessage);
        }
        return this.api.createDeviceForNetwork(network_node.entryId(), {
            edge: edge_node.entryId(),
            code: `WIRES_DEVICE_${this.id}`,
            type: 'EQUIPMENT',
        });
    }
    updateEntry(body) {
        return this.api.updateDevice(this.entryId(), body);
    }
    deleteEntry() {
        const network_node = this.container.container_node;
        return this.api.removeDeviceFromNetwork(network_node.entryId(), this.entryId());
    }
}
exports.DeviceContainerNode = DeviceContainerNode;
container_1.Container.registerNodeType(constants_1.DEVICE_CONTAINER_TYPE, DeviceContainerNode);
class ThingContainerNode extends BaseApiParentContainerNode {
    constructor() {
        super(...arguments);
        this.title = 'Thing Container';
        this.settingFields = {
            code: node_1.SettingType.STRING,
            category: node_1.SettingType.STRING,
            measure_unit: node_1.SettingType.STRING,
            type: node_1.SettingType.STRING,
        };
    }
    fetchChildren() {
        return this.api.fetchPointsByThing(this.entryId());
    }
    collectChildNodes(nodes) {
        return nodes.filter(v => v instanceof PointNode);
    }
    childNodeType() {
        return constants_1.POINT_NODE_TYPE;
    }
    namePrefix() {
        return 'Thing';
    }
    createEntry() {
        console.log('Creating entry....');
        const device_node = this.container.container_node;
        const network_node = device_node.container.container_node;
        const edge_node = network_node.container.container_node;
        if (!(device_node instanceof DeviceContainerNode) ||
            !(network_node instanceof NetworkContainerNode) ||
            !(edge_node instanceof EdgeContainerNode)) {
            const errorMessage = 'Error: Trying to create thing, but thing node does not exist inside a valid Device container hierachy...';
            console.log(errorMessage);
            return Promise.reject(errorMessage);
        }
        return this.api.createThingForDevice(device_node.entryId(), {
            network: network_node.entryId(),
            edge: edge_node.entryId(),
            code: `WIRES_THING_${this.id}`,
            category: 'BASE',
            measure_unit: 'number',
        });
    }
    updateEntry(body) {
        return this.api.updateThing(this.entryId(), body);
    }
    deleteEntry() {
        const device_node = this.container.container_node;
        return this.api.removeThingFromDevice(device_node.entryId(), this.entryId());
    }
}
exports.ThingContainerNode = ThingContainerNode;
container_1.Container.registerNodeType(constants_1.THING_CONTAINER_TYPE, ThingContainerNode);
class PointNode extends node_1.Node {
    constructor(container) {
        super(container);
        this.settingFields = {
            edge: node_1.SettingType.READONLY,
            network: node_1.SettingType.READONLY,
            code: node_1.SettingType.STRING,
            enabled: node_1.SettingType.BOOLEAN,
            kind: node_1.SettingType.STRING,
            measure_unit: node_1.SettingType.STRING,
            offset: node_1.SettingType.NUMBER,
            precision: node_1.SettingType.NUMBER,
            protocol: node_1.SettingType.STRING,
            type: node_1.SettingType.STRING,
        };
        this.entry = Mixin.prototype.entry.bind(this);
        this.entryId = Mixin.prototype.entryId.bind(this);
        this.onAfterSettingsChange = Mixin.prototype.onAfterSettingsChange.bind(this);
        this.applyEntry = Mixin.prototype.applyEntry.bind(this);
        this.deactivate = Mixin.prototype.deactivate.bind(this);
        this.onCreated = Mixin.prototype.onCreated.bind(this);
        this.title = 'Point container';
        this.description = 'placeholder';
        this.api = new api_1.default();
        this.settings['name'] = {
            description: 'Point ID',
            value: this.title,
            type: node_1.SettingType.READONLY,
        };
        this.headerColor = uiMainColour;
        this.iconImageUrl = uiMainIcon;
        this.addOutput('value', node_1.Type.NUMBER);
    }
    onAdded() {
        Mixin.prototype.onAdded.call(this);
        this.syncWithBackend();
        this.interval = (setInterval(() => this.syncWithBackend(), backendSync.pointRefreshIntervalSeconds * 1000));
    }
    onRemoved() {
        return Mixin.prototype.onRemoved.call(this);
        if (this.interval)
            clearInterval(this.interval);
    }
    namePrefix() {
        return 'Point';
    }
    syncWithBackend() {
        if (this.side !== container_1.Side.server)
            return;
        actor.process(() => {
            if (!this.entry())
                return;
            return this.api
                .fetchPointData(this.entryId())
                .then(data => {
                if (!this.entry())
                    return;
                this.setOutputData(0, data && data.value);
            })
                .catch(doNothing);
        });
    }
    createEntry() {
        const thing_node = this.container.container_node;
        const device_node = thing_node.container.container_node;
        const network_node = device_node.container.container_node;
        const edge_node = network_node.container.container_node;
        if (!(thing_node instanceof ThingContainerNode) ||
            !(device_node instanceof DeviceContainerNode) ||
            !(network_node instanceof NetworkContainerNode) ||
            !(edge_node instanceof EdgeContainerNode)) {
            const errorMessage = 'Error: Trying to create point, but point node does not exist inside a valid Thing container hierachy...';
            console.log(errorMessage);
            return Promise.reject(errorMessage);
        }
        return this.api.createPointForThing(thing_node.entryId(), {
            device: device_node.entryId(),
            network: network_node.entryId(),
            edge: edge_node.entryId(),
            code: 'WIRES_POINT_' + this.id,
            unit: { type: 'number' },
            enabled: false,
        });
    }
    updateEntry(body) {
        return this.api.updatePoint(this.entryId(), body);
    }
    deleteEntry() {
        const thing_node = this.container.container_node;
        return this.api.removePointFromThing(thing_node.entryId(), this.entryId());
    }
}
exports.PointNode = PointNode;
container_1.Container.registerNodeType(constants_1.POINT_NODE_TYPE, PointNode);
class ModulesParentContainerNode extends TopLevelApiContainerNode {
    constructor() {
        super(...arguments);
        this.title = 'Modules';
    }
    fetchChildren() {
        return this.api.fetchModules();
    }
    collectChildNodes(nodes) {
        return nodes.filter(v => v instanceof ServiceNode);
    }
    childNodeType() {
        return constants_1.SERVICE_NODE_TYPE;
    }
}
exports.ModulesParentContainerNode = ModulesParentContainerNode;
container_1.Container.registerNodeType(constants_1.MODULES_PARENT_CONTAINER_TYPE, ModulesParentContainerNode);
class ServiceNode extends node_1.Node {
    constructor(container) {
        super(container);
        this.settingFields = {
            service_id: node_1.SettingType.STRING,
            service_name: node_1.SettingType.STRING,
            service_type: node_1.SettingType.STRING,
            version: node_1.SettingType.STRING,
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
                '  <span v-if="self.properties.is_protected">Waiting for configuration</span>' +
                '</div>',
        };
        this.entry = Mixin.prototype.entry.bind(this);
        this.onAfterSettingsChange = Mixin.prototype.onAfterSettingsChange.bind(this);
        this.deactivate = Mixin.prototype.deactivate.bind(this);
        this.onAdded = Mixin.prototype.onAdded.bind(this);
        this.onRemoved = Mixin.prototype.onRemoved.bind(this);
        this.syncWithBackend = doNothing;
        this.title = 'Service';
        this.description = 'placeholder';
        this.api = new api_1.default();
        this.headerColor = uiMainColour;
        this.iconImageUrl = uiMainIcon;
    }
    applyEntry(entry) {
        Mixin.prototype.applyEntry.call(this, entry);
        this.properties.is_protected = !entry;
    }
    onCreated() {
        if (this.entry()) {
            this.applyEntry(this.entry());
        }
        else {
            this.properties.is_protected = true;
            Mixin.prototype.createSettingForm.call(this, null);
        }
    }
    namePrefix() {
        return 'Service';
    }
    entryId() {
        console.log(this.entry() && this.entry().service_id);
        return this.entry() && this.entry().service_id;
    }
    createEntry() {
        return Promise.resolve(null);
    }
    updateEntry(body) {
        return this.api.updateModule(this.entryId(), body);
    }
    deleteEntry() {
        return Promise.resolve(null);
    }
}
exports.ServiceNode = ServiceNode;
container_1.Container.registerNodeType(constants_1.SERVICE_NODE_TYPE, ServiceNode);
//# sourceMappingURL=iot.js.map