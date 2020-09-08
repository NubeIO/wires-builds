"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const datapoint_1 = require("../../../backend/datapoint");
const entry_1 = require("../../../backend/entry");
const config_1 = require("../../../config");
const events_1 = require("../../../events");
const promise_actor_1 = require("../../../promise-actor");
const constants_1 = require("../../constants");
const container_1 = require("../../container");
const node_1 = require("../../node");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
const api_container_node_1 = require("./shared/api-container-node");
const mixin_1 = require("./shared/mixin");
const top_level_api_container_node_1 = require("./shared/top-level-api-container-node");
const doNothing = () => {
};
class EdgesParentContainerNode extends top_level_api_container_node_1.default {
    constructor() {
        super(...arguments);
        this.title = 'Edges';
        this.extra_node_types = [];
    }
    collectChildNodes(nodes) {
        return nodes.filter(n => n instanceof EdgeContainerNode);
    }
    initAPI() {
        return new datapoint_1.EdgeAPI();
    }
    fetchChildren() {
        return this.api.list();
    }
    childNodeType() {
        return [constants_1.EDGE_CONTAINER_TYPE];
    }
}
exports.EdgesParentContainerNode = EdgesParentContainerNode;
class EdgeContainerNode extends api_container_node_1.default {
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
    onAdded() {
        this.ignore_remove = true;
        this.removable = false;
        this.movable = false;
        super.onAdded();
    }
    createEntry() {
        return Promise.reject('ERROR: Edge creation not currently supported.');
    }
    deleteEntry() {
        return Promise.reject('ERROR: Edge deletion not currently supported.');
    }
    collectChildNodes(nodes) {
        return nodes.filter(v => v instanceof NetworkContainerNode);
    }
    namePrefix() {
        return 'Edge';
    }
    initAPI() {
        return new datapoint_1.EdgeAPI();
    }
    fetchChildren() {
        return new datapoint_1.NetworkAPI().list(this.entryId());
    }
    childNodeType() {
        return [constants_1.NETWORK_CONTAINER_TYPE];
    }
}
exports.EdgeContainerNode = EdgeContainerNode;
class NetworkContainerNode extends api_container_node_1.default {
    constructor() {
        super(...arguments);
        this.title = 'Network Container';
        this.settingFields = {
            state: node_1.SettingType.READONLY,
            protocol: node_1.SettingType.READONLY,
            code: node_1.SettingType.STRING,
        };
        this.protocols = ['GPIO', 'BACNET', 'MODBUS', 'UNKNOWN'].map(point => ({
            value: point,
            text: point,
        }));
        this.createSettingForm = (entry) => {
            return lodash_1.merge(mixin_1.default.prototype.createSettingForm.call(this, entry), {
                protocol: {
                    value: this.protocols[this.protocols.length - 1].value,
                    type: node_1.SettingType.DROPDOWN,
                    config: {
                        items: this.protocols,
                    },
                },
            });
        };
    }
    collectChildNodes(nodes) {
        return nodes.filter(v => v instanceof DeviceContainerNode);
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
        return this.findFreeIdentifier().then(code => this.api.create({ code }, edge_node.entryId()));
    }
    initAPI() {
        return new datapoint_1.NetworkAPI();
    }
    fetchChildren() {
        return new datapoint_1.DeviceAPI().list(this.entryId());
    }
    childNodeType() {
        return [constants_1.DEVICE_CONTAINER_TYPE];
    }
}
exports.NetworkContainerNode = NetworkContainerNode;
class DeviceContainerNode extends api_container_node_1.default {
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
    collectChildNodes(nodes) {
        return nodes.filter(v => v instanceof GroupContainerNode || v instanceof PointNode);
    }
    namePrefix() {
        return 'Device';
    }
    createEntry() {
        const network_node = this.container.container_node;
        const edge_node = network_node.container.container_node;
        if (!(network_node instanceof NetworkContainerNode)) {
            const errorMessage = 'Error: Trying to create device, but device node does not exist inside a valid Network container...';
            return Promise.reject(errorMessage);
        }
        return this.findFreeIdentifier().then(code => this.api.create({
            edge_id: edge_node.entryId(),
            device: {
                type: 'EQUIPMENT',
                code,
            },
        }, network_node.entryId()));
    }
    initAPI() {
        return new datapoint_1.DeviceAPI();
    }
    fetchChildren() {
        return new datapoint_1.FolderAPI().list(this.entryId());
    }
    childNodeType() {
        return [constants_1.GROUP_CONTAINER_TYPE, constants_1.POINT_NODE_TYPE];
    }
}
exports.DeviceContainerNode = DeviceContainerNode;
class GroupContainerNode extends api_container_node_1.default {
    constructor() {
        super(...arguments);
        this.title = 'Group Container';
        this.settingFields = {
            name: node_1.SettingType.STRING,
        };
    }
    collectChildNodes(nodes) {
        return nodes.filter(v => v instanceof PointNode);
    }
    namePrefix() {
        return 'Group';
    }
    createEntry() {
        const device_node = this.container.container_node;
        const network_node = device_node.container.container_node;
        const edge_node = network_node.container.container_node;
        if (!(device_node instanceof DeviceContainerNode) ||
            !(network_node instanceof NetworkContainerNode) ||
            !(edge_node instanceof EdgeContainerNode)) {
            const errorMessage = 'Error: Trying to create group, but group node does not exist inside a valid Device container hierarchy...';
            return Promise.reject(errorMessage);
        }
        return this.findFreeIdentifier().then(name => this.api.create({ folder: { name } }, device_node.entryId()));
    }
    initAPI() {
        return new datapoint_1.FolderAPI();
    }
    fetchChildren() {
        return new datapoint_1.PointAPI().list(this.entryId());
    }
    childNodeType() {
        return [constants_1.POINT_NODE_TYPE];
    }
}
exports.GroupContainerNode = GroupContainerNode;
class PointNode extends node_1.Node {
    constructor(container) {
        super(container);
        this.clonable = false;
        this.movable = false;
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
        this.entry = mixin_1.default.prototype.entry.bind(this);
        this.entryId = mixin_1.default.prototype.entryId.bind(this);
        this.onAfterSettingsChange = mixin_1.default.prototype.onAfterSettingsChange.bind(this);
        this.applyEntry = mixin_1.default.prototype.applyEntry.bind(this);
        this.deactivate = mixin_1.default.prototype.deactivate.bind(this);
        this.onCreated = mixin_1.default.prototype.onCreated.bind(this);
        this.makeIdentifier = mixin_1.default.prototype.makeIdentifier.bind(this);
        this.findFreeIdentifier = mixin_1.default.prototype.findFreeIdentifier.bind(this);
        this.getTakenIdentifiers = mixin_1.default.prototype.getTakenIdentifiers.bind(this);
        this.createSettingForm = mixin_1.default.prototype.createSettingForm.bind(this);
        this.title = 'Point container';
        this.description = 'placeholder';
        this.backend = new datapoint_1.PointAPI();
        this.settings['name'] = {
            description: 'Point ID',
            value: this.title,
            type: node_1.SettingType.READONLY,
        };
        this.settings['priority'] = {
            description: 'Priority',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.addOutput('value', node_io_1.Type.NUMBER);
        this.addInput('in', node_io_1.Type.NUMBER);
    }
    entryFactory() {
        return new entry_1.Point();
    }
    onAdded() {
        mixin_1.default.prototype.onAdded.call(this);
        this.syncWithBackend();
        this.interval = (setInterval(() => this.syncWithBackend(), config_1.default.backendSync.pointRefreshIntervalSeconds * 1000));
    }
    onRemoved() {
        return mixin_1.default.prototype.onRemoved.call(this);
    }
    namePrefix() {
        return 'Point';
    }
    syncWithBackend() {
        if (this.side !== container_1.Side.server)
            return;
        promise_actor_1.singleton.process(() => {
            if (!this.entry())
                return;
            return this.backend
                .fetchPointData(this.entryId())
                .then(data => {
                if (!this.entry())
                    return;
                this.setOutputData(0, lodash_1.get(data, 'value'));
            })
                .catch(doNothing);
        });
    }
    onInputUpdated() {
        let value = parseFloat(this.getInputData(0));
        if (isNaN(value) || value === null) {
            console.log('WARNING: Received non-numeric value on point inlet.');
            return;
        }
        this.setOutputData(0, value);
        const priority = utils_1.default.clamp(this.settings['priority'].value, 1, 17);
        this.backend
            .updatePointData(this.entryId(), priority, value)
            .catch(e => this.container.server_editor_socket.emit(events_1.ERROR, `Could not patch point value. ${e.message}`));
    }
    createEntry() {
        const parentNode = this.container.container_node;
        const device_node = parentNode.container.container_node;
        const network_node = device_node.container.container_node;
        const edge_node = network_node.container.container_node;
        if (!(parentNode instanceof GroupContainerNode) || !(parentNode instanceof DeviceContainerNode)) {
            const errorMessage = 'Error: Trying to create point, but point node does not exist inside a valid Group container hierarchy...';
            console.log(errorMessage);
            return Promise.reject(errorMessage);
        }
        return this.findFreeIdentifier().then(code => this.backend.create({
            device_id: device_node.entryId(),
            point: {
                network: network_node.entryId(),
                edge: edge_node.entryId(),
                code,
                unit: { type: 'number' },
                enabled: false,
            },
        }, parentNode.entryId()));
    }
    updateEntry(body) {
        return this.backend.update(body, this.entryId());
    }
    deleteEntry() {
        return this.backend.delete(this.entryId());
    }
}
exports.PointNode = PointNode;
container_1.Container.registerNodeType(constants_1.EDGES_PARENT_CONTAINER_TYPE, EdgesParentContainerNode, null, false);
container_1.Container.registerNodeType(constants_1.EDGE_CONTAINER_TYPE, EdgeContainerNode, null, false);
container_1.Container.registerNodeType(constants_1.NETWORK_CONTAINER_TYPE, NetworkContainerNode, null, false);
container_1.Container.registerNodeType(constants_1.DEVICE_CONTAINER_TYPE, DeviceContainerNode, null, false);
container_1.Container.registerNodeType(constants_1.GROUP_CONTAINER_TYPE, GroupContainerNode, null, false);
container_1.Container.registerNodeType(constants_1.POINT_NODE_TYPE, PointNode, null, false);
//# sourceMappingURL=datapoint-node.js.map