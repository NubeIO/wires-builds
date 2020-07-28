"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
const container_node_1 = require("./container-node");
const utils_1 = require("./utils");
const container_utils_1 = require("./container-utils");
const registry_1 = require("./registry");
const lodash_1 = require("lodash");
const log = require('logplease').create('container', { color: 5 });
const doNothing = () => { };
var Side;
(function (Side) {
    Side[Side["server"] = 0] = "server";
    Side[Side["editor"] = 1] = "editor";
    Side[Side["dashboard"] = 2] = "dashboard";
})(Side = exports.Side || (exports.Side = {}));
class Container {
    constructor(side, id, properties) {
        this._nodes = {};
        if (typeof side !== 'number')
            throw 'Container side is not defined';
        this.renderers = null;
        this.id = id || ++Container.last_container_id;
        if (this.id === 0)
            this.name = 'Main';
        this.side = side;
        Container.containers[this.id] = this;
        this.clear();
        this.debug('Container created');
        let rootContainer = Container.containers[0];
        if (rootContainer) {
            if (rootContainer.server_dashboard_socket)
                this.server_dashboard_socket = rootContainer.server_dashboard_socket;
            if (rootContainer.server_editor_socket)
                this.server_editor_socket = rootContainer.server_editor_socket;
            if (rootContainer.client_socket)
                this.client_socket = rootContainer.client_socket;
            if (rootContainer.db)
                this.db = rootContainer.db;
            if (rootContainer.dashboard)
                this.dashboard = rootContainer.dashboard;
        }
    }
    static rootContainer() {
        return this.containers[0];
    }
    static clear() {
        Container.containers = {};
        Container.last_container_id = -1;
    }
    static registerNodeType(type, node_class, parentContainerNodeType = null, show_in_menu = true, recursive = false) {
        if (!(node_class.prototype instanceof node_1.Node))
            throw `Can't register node of type [${type}]. Class must inherit Node base class!`;
        let node = new node_class(this);
        node_class.type = type;
        node_class.category = type.substr(0, type.lastIndexOf('/'));
        node_class.node_name = type.substr(type.lastIndexOf('/') + 1, type.length);
        node_class.show_in_menu = show_in_menu;
        node_class.icon = node.iconImageUrl;
        node_class.color = node.headerColor;
        node_class.title = node.title || node.type;
        node_class.parentContainerNodeType = parentContainerNodeType;
        node_class.recursive = recursive;
        this.nodes_types[type] = node_class;
    }
    static createNode(type, container, position) {
        const node_class = this.nodes_types[type];
        if (node_class) {
            const node = new node_class(this, container, -1000);
            node.type = type;
            node.pos = position;
            node.size = node.computeSize(true);
            return node;
        }
        else {
            throw `Can't create node of type [${type}]. Make sure it is registered through registerNodeType`;
        }
    }
    static getNodeTypesInCategory(category) {
        return Object.values(this.nodes_types).filter(n => n.category == (category || null));
    }
    static getNodeTypes() {
        return Object.values(this.nodes_types);
    }
    static nodeIsInCategory(category) {
        return n => n.category == (category || null);
    }
    static getNodeTypesCategories() {
        return lodash_1.uniq(Object.values(this.nodes_types)
            .filter(n => !!n.category && n.show_in_menu)
            .map(n => n.category)
            .concat(['']));
    }
    clear() {
        this.stop();
        this.isRunning = false;
        this.last_node_id = 0;
        this._nodes = {};
        this.iteration = 0;
        this.config = {};
        this.globaltime = 0;
        this.runningtime = 0;
        this.fixedtime = 0;
        this.fixedtime_lapse = 0.01;
        this.elapsed_time = 0.01;
        this.starttime = 0;
        this.sendActionToRenderer('clear');
    }
    stop() {
        if (!this.isRunning)
            return;
        this.isRunning = false;
        if (this.onStopEvent)
            this.onStopEvent();
        if (this.execution_timer_id != null)
            clearInterval(this.execution_timer_id);
        this.execution_timer_id = null;
        for (let id in this._nodes) {
            let node = this._nodes[id];
            if (node['onStopContainer'])
                node['onStopContainer']();
        }
    }
    attachRenderer(renderer) {
        if (renderer.container && renderer.container != this) {
            renderer.deselectAllNodes();
            renderer.container.detachRenderer(renderer);
        }
        renderer.container = this;
        if (!this.renderers)
            this.renderers = [];
        this.renderers.push(renderer);
        for (let i in renderer.container._nodes) {
            let node = renderer.container._nodes[i];
            node.boxcolor = renderer.theme.NODE_DEFAULT_BOXCOLOR;
            node.setDirtyCanvas(true, true);
        }
    }
    detachRenderer(renderer) {
        if (!this.renderers)
            return;
        let pos = this.renderers.indexOf(renderer);
        if (pos == -1)
            return;
        renderer.container = null;
        this.renderers.splice(pos, 1);
        if (this.renderers.length == 0)
            delete this.renderers;
    }
    run(interval = 1) {
        if (this.isRunning)
            return;
        this.isRunning = true;
        if (this.onPlayEvent)
            this.onPlayEvent();
        for (let id in this._nodes) {
            let node = this._nodes[id];
            if (node['onRunContainer'])
                node['onRunContainer']();
        }
        this.starttime = utils_1.default.getTime();
        let that = this;
        this.execution_timer_id = setInterval(function () {
            that.runStep(1);
        }, interval);
    }
    runStep(steps = 1) {
        let start = utils_1.default.getTime();
        this.globaltime = 0.001 * (start - this.starttime);
        for (let i = 0; i < steps; i++) {
            this.transferDataBetweenNodes();
            let now = Date.now();
            for (let id in this._nodes) {
                let node = this._nodes[id];
                if (!node.EXECUTE_INTERVAL ||
                    (node.EXECUTE_INTERVAL && !node.executeLastTime) ||
                    (node.executeLastTime && now - node.executeLastTime >= node.EXECUTE_INTERVAL)) {
                    if (node['onExecute'])
                        node['onExecute']();
                    if (node.EXECUTE_INTERVAL)
                        node.executeLastTime = now;
                }
                if (node.isUpdated) {
                    if (!node.UPDATE_INPUTS_INTERVAL ||
                        (node.UPDATE_INPUTS_INTERVAL && !node.updateInputsLastTime) ||
                        (node.updateInputsLastTime && now - node.updateInputsLastTime >= node.UPDATE_INPUTS_INTERVAL)) {
                        if (node['onInputUpdated'])
                            node['onInputUpdated']();
                        node.isUpdated = false;
                        for (let i in node.inputs)
                            if (node.inputs[i].updated)
                                node.inputs[i].updated = false;
                        if (node.UPDATE_INPUTS_INTERVAL)
                            node.updateInputsLastTime = now;
                    }
                }
            }
            this.fixedtime += this.fixedtime_lapse;
            if (this.onExecuteStep)
                this.onExecuteStep();
        }
        if (this.onAfterExecute)
            this.onAfterExecute();
        let elapsed = utils_1.default.getTime() - start;
        if (elapsed == 0)
            elapsed = 1;
        this.elapsed_time = 0.001 * elapsed;
        this.globaltime += 0.001 * elapsed;
        this.iteration += 1;
    }
    transferDataBetweenNodes() {
        for (let id in this._nodes) {
            let node = this._nodes[id];
            if (!node.outputs)
                continue;
            for (let o in node.outputs) {
                let output = node.outputs[o];
                if (!output.updated)
                    continue;
                output.updated = false;
                if (output.links == null)
                    continue;
                for (let link of output.links) {
                    let target_node = this._nodes[link.target_node_id];
                    if (!target_node) {
                        this.debugErr("Can't transfer data from node " + node.getReadableId() + '. Target node not found');
                        continue;
                    }
                    let target_input = target_node.inputs[link.target_slot];
                    target_input.data = utils_1.default.parseValue(output.data, target_input.type);
                    target_node.isUpdated = true;
                    target_input.updated = true;
                }
            }
        }
    }
    getTime() {
        return this.globaltime;
    }
    sendActionToRenderer(action, params) {
        if (!this.renderers)
            return;
        for (let i = 0; i < this.renderers.length; ++i) {
            let c = this.renderers[i];
            if (c[action])
                c[action].apply(c, params);
        }
    }
    getNodes(includeSubcontainers = false) {
        let nodes = [];
        addNodes(this._nodes);
        function addNodes(_nodes) {
            for (let n in _nodes) {
                nodes.push(_nodes[n]);
                if (includeSubcontainers && _nodes[n].sub_container) {
                    addNodes(_nodes[n].sub_container._nodes);
                }
            }
        }
        return nodes;
    }
    static setProperties(properties, node) {
        if (properties) {
            for (let i in properties) {
                if (properties.hasOwnProperty(i)) {
                    switch (i) {
                        case 'inputs':
                            break;
                        case 'outputs':
                            break;
                        case 'settings':
                            container_utils_1.default.addSettingsProperties(node, properties[i]);
                            break;
                        default:
                            node[i] = properties[i];
                    }
                }
            }
        }
    }
    static setSettings(properties, node) {
        if (properties && properties['settings']) {
            container_utils_1.default.addSettingsProperties(node, properties['settings']);
        }
    }
    createNode(type, properties, serializedNode, force = false, callback = doNothing) {
        if (this.container_node && this.container_node.shouldRejectNodeType(type)) {
            this.debugErr('Trying to create non-compatible child node in container...');
            return null;
        }
        let node_class = Container.nodes_types[type];
        if (!node_class) {
            this.debugErr("Can't create node. Node class of type [" + type + '] not registered.');
            return null;
        }
        const { id, isNew } = this.getNodeId(properties, serializedNode);
        if (this._nodes[id]) {
            this.debugErr("Can't create node. Node id [" + id + '] already exist.');
            return null;
        }
        let node = new node_class(this, id, properties);
        node.id = id;
        node.cid = this.id;
        node.container = this;
        node.side = this.side;
        node.type = type;
        node.category = node_class.category;
        const settings = Object.assign({}, node.settings);
        if (serializedNode)
            node.configure(serializedNode);
        if (isNew || force) {
            if (node['setup'])
                node['setup']();
        }
        if (!isNew) {
            Object.keys(node.settings).forEach(key => {
                node.settings[key].validation = settings[key] ? settings[key].validation : null;
            });
        }
        Container.setProperties(properties, node);
        if (node instanceof container_node_1.ContainerNode && properties && properties.sub_container) {
            node.sub_container = Container.containers[properties.sub_container.id];
            node.settings.name.value =
                (node.settings && node.settings.name && node.settings.name.value) || 'Folder ' + properties.sub_container.id;
        }
        if (!node.title)
            node.title = node.type;
        if ((!properties || !properties.properties || !properties.properties.size) &&
            (!serializedNode || !serializedNode.size) &&
            !force) {
            node.size = node.computeSize(true);
        }
        node.id = id;
        if (isNew || force) {
            if (node['init'])
                node['init']();
            Container.setSettings(properties, node);
            this.createNewNode(node).then(() => {
                callNodeMethodOnAdded();
            });
        }
        else {
            callNodeMethodOnAdded();
        }
        if (isNew && this.db) {
            if (this.id == 0)
                this.db.updateLastRootNodeId(this.last_node_id, callback);
            else
                this.db.updateNode(this.container_node.id, this.container_node.container.id, {
                    $set: {
                        'sub_container.last_node_id': this.container_node.sub_container.last_node_id,
                    },
                }, callback);
        }
        else
            setTimeout(callback, 0);
        this.setDirtyCanvas(true, true);
        this._nodes[id] = node;
        registry_1.default._nodes[registry_1.default.getId(this.id, id)] = node;
        return node;
        function callNodeMethodOnAdded() {
            if (node['onAdded'])
                node['onAdded']();
        }
    }
    getNodeId(properties, serializedNode) {
        let id;
        let isNew = false;
        if (properties && properties.id != null)
            id = properties.id;
        else if (serializedNode && serializedNode.id != null)
            id = serializedNode.id;
        else {
            id = ++this.last_node_id;
            isNew = true;
        }
        return { id, isNew };
    }
    createNewNode(node) {
        this.debug('New node created: ' + node.getReadableId());
        if (node['onCreated'])
            node['onCreated']();
        return new Promise(resolve => {
            if (this.db) {
                this.db.addNode(node, () => {
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
    removeBroadcasted(node) {
        if (this.side === Side.server) {
            this.remove(node);
            this.server_editor_socket.emit('nodes-delete', { nodes: [node.id], cid: node.cid });
            if (node.isDashboardNode) {
                this.server_dashboard_socket.in('' + node.cid).emit('nodes-delete', { nodes: [node], cid: node.cid });
            }
        }
    }
    remove(node) {
        if (typeof node == 'number') {
            node = this._nodes[node];
            if (!node)
                this.debugErr("Can't remove node. Node id [" + node + ' not exist.');
            return null;
        }
        if (node.ignore_remove)
            return;
        const callback = lodash_1.get(node, 'onRemoved', () => { });
        Promise.resolve(callback.call(node))
            .then(() => this.afterOnRemoved(node))
            .catch(err => log.error(err));
    }
    afterOnRemoved(node) {
        if (node.inputs)
            for (let i in node.inputs) {
                let input = node.inputs[i];
                if (input.link != null)
                    node.disconnectInputLink(+i);
            }
        if (node.outputs)
            for (let o in node.outputs) {
                let output = node.outputs[o];
                if (output.links != null && output.links.length > 0)
                    node.disconnectOutputLinks(+o);
            }
        if (this.renderers) {
            for (let i = 0; i < this.renderers.length; ++i) {
                let renderer = this.renderers[i];
                if (renderer.selected_nodes[node.id])
                    delete renderer.selected_nodes[node.id];
                if (renderer.node_dragged == node)
                    renderer.node_dragged = null;
            }
        }
        delete this._nodes[node.id];
        delete registry_1.default._nodes[registry_1.default.getId(this.id, node.id)];
        this.debug('Node deleted: ' + node.getReadableId());
        node.container = null;
        if (this.db)
            this.db.removeNode(node.id, this.id);
        this.setDirtyCanvas(true, true);
    }
    getNodeById(id) {
        if (id == null)
            return null;
        return this._nodes[id];
    }
    getNodesByType(type, includeSubContainers = false) {
        type = type.toLowerCase();
        let r = [];
        for (let id in this._nodes) {
            let node = this._nodes[id];
            if (node.type.toLowerCase() == type)
                r.push(node);
        }
        if (includeSubContainers) {
            for (let id in this._nodes) {
                let node = this._nodes[id];
                if (node instanceof container_node_1.ContainerNode) {
                    let nodes = node.sub_container.getNodesByType(type, true);
                    nodes.forEach(n => r.push(n));
                }
            }
        }
        return r;
    }
    getNodesByClass(nodeClass, includeSubcontainers = false) {
        let r = [];
        for (let id in this._nodes) {
            let node = this._nodes[id];
            if (node instanceof nodeClass)
                r.push(node);
        }
        if (includeSubcontainers) {
            for (let id in this._nodes) {
                let node = this._nodes[id];
                if (node instanceof container_node_1.ContainerNode) {
                    let nodes = node.sub_container.getNodesByClass(nodeClass, true);
                    nodes.forEach(n => r.push(n));
                }
            }
        }
        return r;
    }
    getAllNodes(parent = this._nodes, parentId = 0) {
        let list = [];
        Object.keys(parent).forEach(id => {
            const node = parent[id];
            if (node instanceof container_node_1.ContainerNode) {
                list.push({
                    id: node.sub_container.id,
                    name: node.sub_container.name,
                    parentId,
                    list: this.getAllNodes(node.sub_container._nodes, node.sub_container.id),
                    isContainer: true,
                });
            }
            else {
                list.push({
                    id: node.id,
                    parentId,
                    name: node.name ? `${node.name}: ${node.title}` : node.title,
                    isContainer: false,
                });
            }
        });
        return list.sort((a, b) => {
            if (a.isContainer && b.isContainer) {
                return a.id - b.id;
            }
            else if (a.isContainer && !b.isContainer) {
                return -1;
            }
            else
                return 1;
        });
    }
    setDirtyCanvas(foreground, backgroud) {
        this.sendActionToRenderer('setDirty', [foreground, backgroud]);
    }
    runWithEditor(f) {
        const editor = lodash_1.get(this, 'renderers[0].editor');
        if (editor)
            f(editor);
    }
    serialize(only_dashboard_nodes = false) {
        let data = {
            id: this.id,
            last_node_id: this.last_node_id,
            name: this.name,
            config: this.config,
        };
        let ser_nodes = [];
        for (let id in this._nodes) {
            const node = this._nodes[id];
            if (only_dashboard_nodes && !node.isDashboardNode)
                continue;
            ser_nodes.push(node.serialize());
        }
        data.serializedNodes = ser_nodes;
        if (this.id == 0)
            data.last_container_id = Container.last_container_id;
        return data;
    }
    configure(data, keep_old = false) {
        if (!keep_old)
            this.clear();
        for (let i in data) {
            if (i == 'serializedNodes')
                continue;
            this[i] = data[i];
        }
        let error = false;
        if (data.serializedNodes) {
            for (let n of data.serializedNodes) {
                let node = this.createNode(n.type, null, n);
                if (!node)
                    error = true;
            }
        }
        if (data.last_container_id)
            Container.last_container_id = data.last_container_id;
        this.setDirtyCanvas(true, true);
        return error;
    }
    debug(message) {
        log.debug('[' + this.id + '] ' + message);
    }
    debugWarn(message, module) {
        log.warn('[' + this.id + '] ' + message);
    }
    debugErr(message, module) {
        log.error('[' + this.id + '] ' + message);
    }
}
exports.Container = Container;
Container.nodes_types = {};
Container.containers = {};
Container.last_container_id = -1;
//# sourceMappingURL=container.js.map