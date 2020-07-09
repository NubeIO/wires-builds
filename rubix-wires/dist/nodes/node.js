"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const container_1 = require("./container");
const utils_1 = require("./utils");
const registry_1 = require("./registry");
const log = require('logplease').create('node', { color: 5 });
const doNothing = () => { };
class NodeOutput {
}
exports.NodeOutput = NodeOutput;
class NodeInput {
}
exports.NodeInput = NodeInput;
class Link {
}
exports.Link = Link;
var BROADCAST;
(function (BROADCAST) {
    BROADCAST[BROADCAST["UPDATE_SETTINGS"] = 0] = "UPDATE_SETTINGS";
    BROADCAST[BROADCAST["UPDATE_OUTPUTS"] = 1] = "UPDATE_OUTPUTS";
    BROADCAST[BROADCAST["UPDATE_TITLE"] = 2] = "UPDATE_TITLE";
    BROADCAST[BROADCAST["UPDATE_VALUE"] = 3] = "UPDATE_VALUE";
    BROADCAST[BROADCAST["UPDATE_STATE"] = 4] = "UPDATE_STATE";
    BROADCAST[BROADCAST["UPDATE_NAME"] = 5] = "UPDATE_NAME";
})(BROADCAST = exports.BROADCAST || (exports.BROADCAST = {}));
var Type;
(function (Type) {
    Type["STRING"] = "string";
    Type["NUMBER"] = "number";
    Type["BOOLEAN"] = "boolean";
    Type["ANY"] = "any";
    Type["JSON"] = "json";
})(Type = exports.Type || (exports.Type = {}));
var NodeState;
(function (NodeState) {
    NodeState["NORMAL"] = "normal";
    NodeState["INFO"] = "info";
    NodeState["WARNING"] = "warning";
    NodeState["ERROR"] = "error";
})(NodeState = exports.NodeState || (exports.NodeState = {}));
var SettingType;
(function (SettingType) {
    SettingType["STRING"] = "string";
    SettingType["NUMBER"] = "number";
    SettingType["BOOLEAN"] = "boolean";
    SettingType["READONLY"] = "readonly";
    SettingType["DROPDOWN"] = "dropdown";
    SettingType["TREE_SELECT"] = "treeselect";
    SettingType["CODE_AREA"] = "codearea";
    SettingType["PASSWORD"] = "password";
    SettingType["GROUP"] = "group";
})(SettingType = exports.SettingType || (exports.SettingType = {}));
exports.convertStringToType = (type) => {
    switch (type) {
        case Type.STRING:
            return Type.STRING;
        case Type.NUMBER:
            return Type.NUMBER;
        case Type.BOOLEAN:
            return Type.BOOLEAN;
        case Type.JSON:
            return Type.JSON;
    }
    return Type.ANY;
};
exports.convertType = (type) => {
    switch (type) {
        case Type.STRING:
            return SettingType.STRING;
        case Type.NUMBER:
            return SettingType.NUMBER;
        case Type.BOOLEAN:
            return SettingType.BOOLEAN;
    }
    return SettingType.STRING;
};
exports.convertSettingType = (type) => {
    switch (type) {
        case SettingType.STRING:
            return Type.STRING;
        case SettingType.NUMBER:
            return Type.NUMBER;
        case SettingType.BOOLEAN:
            return Type.BOOLEAN;
    }
    return Type.ANY;
};
class Node {
    constructor(container, id, properties) {
        this.pos = [100, 100];
        this.MIN_WIDTH = 100;
        this.properties = {};
        this.settings = {};
        this.settingConfigs = {};
        this.contextMenu = {};
        this.flags = {};
        this.showIcon = true;
        this.clonable = true;
    }
    onAfterSettingsChange(oldSettings, oldName) { }
    configure(ser_node) {
        for (let key in ser_node) {
            if (key == 'console')
                continue;
            if (ser_node[key] == null)
                continue;
            if (typeof ser_node[key] == 'object') {
                if (this[key] && this[key].configure)
                    this[key].configure(ser_node[key]);
                else
                    this[key] = utils_1.default.cloneObject(ser_node[key], this[key]);
            }
            else
                this[key] = ser_node[key];
        }
    }
    serialize() {
        let n = {
            cid: this.container.id,
            id: this.id,
            type: this.type,
            pos: this.pos,
            name: this.name,
            size: this.size,
        };
        if (this.settings)
            n.settings = utils_1.default.cloneObject(this.settings);
        Object.keys(n.settings).forEach(key => {
            delete n.settings[key].validation;
        });
        if (this.properties)
            n.properties = utils_1.default.cloneObject(this.properties);
        if (this.flags)
            n.flags = utils_1.default.cloneObject(this.flags);
        if (this.inputs) {
            n.inputs = {};
            for (let id in this.inputs) {
                let i = this.inputs[id];
                n.inputs[id] = {
                    setting: i.setting,
                    name: i.name,
                    type: i.type,
                    link: i.link,
                    label: i.label,
                    locked: i.locked,
                    pos: i.pos,
                    round: i.round,
                    isOptional: i.isOptional,
                };
            }
        }
        if (this.outputs) {
            n.outputs = {};
            for (let id in this.outputs) {
                let o = this.outputs[id];
                n.outputs[id] = {
                    name: o.name,
                    type: o.type,
                    links: o.links,
                    label: o.label,
                    locked: o.locked,
                    pos: o.pos,
                    round: o.round,
                };
            }
        }
        if (this.onSerialize)
            this.onSerialize(n);
        return n;
    }
    toString() {
        return JSON.stringify(this.serialize());
    }
    getTitle() {
        return this.title;
    }
    getName() {
        return this.name;
    }
    getDefinedInputValues() {
        return Object.keys(this.inputs)
            .map(key => this.inputs[key].data)
            .filter(v => v != null);
    }
    emitTransformedInput(callback) {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, callback(val));
        else
            this.setOutputData(0, null);
    }
    updateNodeInput() {
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, { $set: { inputs: this.inputs } });
    }
    updateNodeOutput() {
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, { $set: { outputs: this.outputs } });
    }
    persistConfiguration(callback = doNothing) {
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { settings: this.settings, properties: this.properties },
            }, callback);
    }
    updateNodeInputOutput() {
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { inputs: this.inputs, outputs: this.outputs },
            });
    }
    setOutputData(output_id, data, only_if_new = false) {
        if (!this.outputs[output_id])
            return;
        if (data === undefined)
            return;
        if (only_if_new && this.outputs[output_id].data === data)
            return;
        this.outputs[output_id].updated = true;
        if (!this.isRecentlyActive)
            this.isRecentlyActive = true;
        this.outputs[output_id].data = data;
    }
    getInputData(slotId) {
        try {
            let data = this.inputs[slotId].data;
            if (this.inputs[slotId] &&
                this.inputs[slotId].setting &&
                this.inputs[slotId].setting.exist &&
                !utils_1.default.hasValidInput(data, this.inputs[slotId].setting.nullable)) {
                data = utils_1.default.parseValue(this.settings[this.inputs[slotId].name.match(/\[(.*?)\]/)[1]].value, this.inputs[slotId].type);
            }
            return data;
        }
        catch (err) {
            this.debugErr(`Get input data! ${err}`);
        }
    }
    getInputInfo(slot) {
        if (!this.inputs)
            return null;
        return this.inputs[slot];
    }
    addOutput(name, type, extra_info) {
        let id = this.getFreeOutputId();
        name = name || 'out ' + (id + 1);
        let output = { name: name, type: type, links: null };
        if (extra_info)
            for (let i in extra_info)
                output[i] = extra_info[i];
        if (!this.outputs)
            this.outputs = {};
        this.outputs[id] = output;
        if (this['onOutputAdded'])
            this['onOutputAdded'](output);
        this.size = this.computeSize();
        return id;
    }
    getFreeOutputId() {
        if (!this.outputs)
            return 0;
        for (let i = 0; i < 1000; i++) {
            if (!this.outputs[i])
                return i;
        }
    }
    removeOutput(id) {
        this.disconnectOutputLinks(id);
        delete this.outputs[id];
        this.size = this.computeSize();
        if (this['onOutputRemoved'])
            this['onOutputRemoved'](id);
    }
    addInput(name, type, setting = { exist: false, nullable: false }, extra_info) {
        let id = this.getFreeInputId();
        let input = { name, type, setting };
        if (extra_info) {
            input = Object.assign(Object.assign({}, input), extra_info);
        }
        if (!this.inputs)
            this.inputs = {};
        this.inputs[id] = input;
        this.size = this.computeSize();
        if (this['onInputAdded'])
            this['onInputAdded'](input);
        return id;
    }
    addInputWithSettings(name, type, defaultValue, description = name, nullable = true, extra_info) {
        const setting = { exist: true, nullable };
        this.addInput(`[${name}]`, type, setting, extra_info);
        this.settings[name] = {
            description,
            value: defaultValue,
            type: exports.convertType(type),
        };
    }
    getFreeInputId() {
        if (!this.inputs)
            return 0;
        for (let i = 0; i < 1000; i++) {
            if (!this.inputs[i])
                return i;
        }
    }
    removeInput(id) {
        this.disconnectInputLink(id);
        delete this.inputs[id];
        this.size = this.computeSize();
        if (this['onInputRemoved'])
            this['onInputRemoved'](id);
    }
    getInputsCount() {
        return this.inputs ? Object.keys(this.inputs).length : 0;
    }
    getOutputsCount() {
        return this.outputs ? Object.keys(this.outputs).length : 0;
    }
    changeInputsCount(target_count, type) {
        let current_count = this.getInputsCount();
        let diff = target_count - current_count;
        if (diff > 0)
            for (let i = 0; i < diff; i++)
                this.addInput(null, type);
        if (diff < 0) {
            let ids = Object.keys(this.inputs);
            for (let i = 0; i > diff; i--) {
                let id = ids[ids.length + i - 1];
                this.removeInput(+id);
            }
        }
    }
    changeOutputsCount(target_count, type) {
        let current_count = this.getOutputsCount();
        let diff = target_count - current_count;
        if (diff > 0)
            for (let i = 0; i < diff; i++)
                this.addOutput(null, type);
        if (diff < 0) {
            let ids = Object.keys(this.outputs);
            for (let i = 0; i > diff; i--) {
                let id = ids[ids.length + i - 1];
                this.removeOutput(+id);
            }
        }
    }
    getLastInputIndes() {
        if (!this.inputs)
            return -1;
        let last = -1;
        for (let i in this.inputs)
            if (+i > last)
                last = +i;
        return last;
    }
    getLastOutputIndex() {
        if (!this.outputs)
            return -1;
        let last = -1;
        for (let i in this.outputs)
            if (+i > last)
                last = +i;
        return last;
    }
    computeHeight() {
        let i_slots = this.getLastInputIndes() + 1;
        let o_slots = this.getLastOutputIndex() + 1;
        let rows = (this.inputs ? i_slots : 0) + (this.outputs ? o_slots : 0);
        rows = Math.max(rows, 1);
        return rows * 15 + 6;
    }
    computeSize(changeWidth = false) {
        let size = [0, 0];
        size[1] = this.computeHeight();
        if (!changeWidth && this.size != undefined) {
            size[0] = this.size[0];
            return size;
        }
        let font_size = 14;
        let title_width = compute_text_size(this.title);
        let maxLabelWidth = 0;
        let maxNameWidth = 0;
        if (this.inputs)
            for (let i in this.inputs) {
                let input = this.inputs[i];
                let label = input.label || '';
                let name = input.name || '';
                let labelWidth = compute_text_size(label);
                let nameWidth = compute_text_size(name);
                if (maxLabelWidth < labelWidth)
                    maxLabelWidth = labelWidth;
                if (maxNameWidth < nameWidth)
                    maxNameWidth = nameWidth;
            }
        if (this.outputs)
            for (let o in this.outputs) {
                let output = this.outputs[o];
                let label = output.label || '';
                let name = output.name || '';
                let labelWidth = compute_text_size(label);
                let nameWidth = compute_text_size(name);
                if (maxLabelWidth < labelWidth)
                    maxLabelWidth = labelWidth;
                if (maxNameWidth < nameWidth)
                    maxNameWidth = nameWidth;
            }
        if (maxLabelWidth == 0)
            maxLabelWidth = maxNameWidth;
        size[0] = Math.max(maxLabelWidth + maxNameWidth + 10, title_width);
        size[0] = Math.max(size[0], this.MIN_WIDTH);
        function compute_text_size(text) {
            if (!text)
                return 0;
            return font_size * text.length * 0.6;
        }
        return size;
    }
    calculateMinWidth(...width) {
        return Math.max(this.MIN_WIDTH, ...width);
    }
    connect(output_id, target_node_id, input_id) {
        let target_node = this.container.getNodeById(target_node_id);
        if (!target_node) {
            this.debugErr("Can't connect, target node not found");
            return false;
        }
        if (!this.outputs || !this.outputs[output_id]) {
            this.debugErr("Can't connect, output not found");
            return false;
        }
        if (!target_node.inputs || !target_node.inputs[input_id]) {
            this.debugErr("Can't connect, input not found");
            return false;
        }
        let output = this.outputs[output_id];
        let input = target_node.inputs[input_id];
        if (target_node['onConnectInput'])
            if (target_node['onConnectInput'](input_id, output) == false)
                return false;
        if (input.link)
            target_node.disconnectInputLink(input_id);
        if (!output.links)
            output.links = [];
        output.links.push({ target_node_id: target_node_id, target_slot: input_id });
        input.link = { target_node_id: this.id, target_slot: output_id };
        input.updated = true;
        input.data = utils_1.default.parseValue(output.data, input.type);
        target_node.isUpdated = true;
        if (this.container.db) {
            let s_node = this.serialize();
            if (target_node.id == this.id) {
                this.container.db.updateNode(this.id, this.container.id, {
                    $set: { outputs: s_node.outputs, inputs: s_node.inputs },
                });
            }
            else {
                let s_t_node = target_node.serialize();
                this.container.db.updateNode(this.id, this.container.id, {
                    $set: { outputs: s_node.outputs },
                });
                this.container.db.updateNode(target_node.id, target_node.container.id, {
                    $set: { inputs: s_t_node.inputs },
                });
            }
        }
        this.setDirtyCanvas(false, true);
        this.debug('connected to ' + target_node.getReadableId());
        return true;
    }
    disconnectOutputLinks(slot) {
        if (!this.outputs || !this.outputs[slot]) {
            this.debugErr(`Can't disconnect, output slot: ${slot} not found on node: ${this.id}`);
            return false;
        }
        const output = this.outputs[slot];
        if (!output.links)
            return false;
        let i = output.links.length;
        while (i--) {
            let link = output.links[i];
            const targetNode = this.container.getNodeById(link.target_node_id);
            if (!targetNode) {
                this.debugErr(`Node: ${link.target_node_id} is not available`);
            }
            if (targetNode &&
                targetNode.inputs &&
                targetNode.inputs[link.target_slot] &&
                targetNode.inputs[link.target_slot].link) {
                delete targetNode.inputs[link.target_slot].link;
                targetNode.inputs[link.target_slot].data = undefined;
                targetNode.inputs[link.target_slot].updated = true;
                targetNode.isUpdated = true;
                if (this.container.db) {
                    let s_t_node = targetNode.serialize();
                    this.container.db.updateNode(targetNode.id, targetNode.container.id, {
                        $set: { inputs: s_t_node.inputs },
                    });
                }
            }
            else {
                log.error(`Tried to delete input link on: ${targetNode} of slot: ${link.target_slot}`);
            }
            output.links.splice(i, 1);
            this.debug(`Disconnected from ${targetNode.getReadableId()}`);
        }
        delete output.links;
        if (this.container.db) {
            let s_node = this.serialize();
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { outputs: s_node.outputs },
            });
        }
        this.setDirtyCanvas(false, true);
        return true;
    }
    disconnectInputLink(slot) {
        if (!this.inputs || !this.inputs[slot]) {
            this.debugErr(`Can't disconnect, input slot: ${slot} not found on node: ${this.id}`);
            return false;
        }
        const input = this.inputs[slot];
        const link = input.link;
        if (!link)
            return false;
        let targetNode = this.container.getNodeById(link.target_node_id);
        if (!targetNode)
            return false;
        let output = targetNode.outputs[link.target_slot];
        if (!output || !output.links)
            return false;
        let i = output.links.length;
        while (i--) {
            let outputLink = output.links[i];
            if (outputLink.target_node_id == this.id && outputLink.target_slot == slot) {
                output.links.splice(i, 1);
                break;
            }
        }
        if (output.links.length == 0)
            delete output.links;
        delete input.link;
        input.data = undefined;
        input.updated = true;
        this.isUpdated = true;
        if (this.container.db) {
            let serializedNode = this.serialize();
            let serializedTargetNode = targetNode.serialize();
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { inputs: serializedNode.inputs },
            });
            this.container.db.updateNode(targetNode.id, targetNode.container.id, {
                $set: { outputs: serializedTargetNode.outputs },
            });
        }
        this.setDirtyCanvas(false, true);
        this.debug(`Disconnected from ${targetNode.getReadableId()}`);
        return true;
    }
    setDirtyCanvas(dirty_foreground, dirty_background) {
        if (!this.container)
            return;
        this.container.sendActionToRenderer('setDirty', [dirty_foreground, dirty_background]);
    }
    collapse() {
        this.flags.collapsed = !this.flags.collapsed;
        this.setDirtyCanvas(true, true);
    }
    debug(message) {
        log.debug(this.getReadableId() + ' ' + message);
    }
    debugInfo(message) {
        log.info(this.getReadableId() + ' ' + message);
    }
    debugWarn(message, module) {
        log.warn(this.getReadableId() + ' ' + message);
    }
    debugErr(message, module) {
        log.error(this.getReadableId() + ' ' + message);
    }
    getReadableId() {
        if (this.container)
            return `[${this.type}][${this.container.id}/${this.id}]`;
        else
            return `[${this.type}][-/${this.id}]`;
    }
    sendMessageToServerSide(message) {
        if (this.side == container_1.Side.server)
            log.warn(`Node ${this.getReadableId()} is trying to send message from server side to server side`);
        else
            this.container.client_socket.emit('nodeMessageToServerSide', {
                id: this.id,
                cid: this.container.id,
                message: message,
            });
    }
    sendMessageToEditorSide(message, onlyConnectedUsers = true) {
        let m = { id: this.id, cid: this.container.id, message };
        if (this.side == container_1.Side.editor) {
            log.warn(`Node ${this.getReadableId()} is trying to send message from editor side to editor side`);
        }
        else if (this.side == container_1.Side.server) {
            let socket = this.container.server_editor_socket;
            if (onlyConnectedUsers)
                socket.in('' + this.container.id).emit('nodeMessageToEditorSide', m);
            else
                socket.emit('nodeMessageToEditorSide', m);
        }
        else {
            this.container.client_socket.emit('nodeMessageToEditorSide', m);
        }
    }
    sendAddInputToEditorSide(name, type, extra_info) {
        let m = {
            id: this.id,
            cid: this.container.id,
            input: {
                name: name,
                type: type,
                extra_info: extra_info,
            },
        };
        if (this.side == container_1.Side.editor) {
            log.warn('Node ' +
                this.getReadableId() +
                ' is trying to send message from editor side to editor side');
        }
        else if (this.side == container_1.Side.server) {
            let socket = this.container.server_editor_socket;
            socket.emit('node-add-input', m);
        }
        else {
            this.container.client_socket.emit('node-add-input', m);
        }
    }
    sendAddOutputToEditorSide(name, type, extra_info) {
        let m = {
            id: this.id,
            cid: this.container.id,
            output: {
                name: name,
                type: type,
                extra_info: extra_info,
            },
        };
        if (this.side == container_1.Side.editor) {
            log.warn('Node ' +
                this.getReadableId() +
                ' is trying to send message from editor side to editor side');
        }
        else if (this.side == container_1.Side.server) {
            let socket = this.container.server_editor_socket;
            socket.emit('node-add-output', m);
        }
        else {
            this.container.client_socket.emit('node-add-output', m);
        }
    }
    sendRemoveInputToEditorSide(id) {
        let m = {
            id: this.id,
            cid: this.container.id,
            input: id,
        };
        if (this.side == container_1.Side.editor) {
            log.warn('Node ' +
                this.getReadableId() +
                ' is trying to send message from editor side to editor side');
        }
        else if (this.side == container_1.Side.server) {
            let socket = this.container.server_editor_socket;
            socket.emit('node-remove-input', m);
        }
        else {
            this.container.client_socket.emit('node-remove-input', m);
        }
    }
    sendRemoveOutputToEditorSide(id) {
        let m = {
            id: this.id,
            cid: this.container.id,
            output: id,
        };
        if (this.side == container_1.Side.editor) {
            log.warn('Node ' +
                this.getReadableId() +
                ' is trying to send message from editor side to editor side');
        }
        else if (this.side == container_1.Side.server) {
            let socket = this.container.server_editor_socket;
            socket.emit('node-remove-output', m);
        }
        else {
            this.container.client_socket.emit('node-remove-output', m);
        }
    }
    sendIOValuesToEditor() {
        let inputs_values = [];
        let outputs_values = [];
        if (this.inputs) {
            for (let i in this.inputs) {
                const data = this.inputs[i].data;
                inputs_values.push({
                    nodeId: this.id,
                    inputId: i,
                    data: data,
                });
            }
        }
        if (this.outputs) {
            for (let o in this.outputs) {
                const data = this.outputs[o].data;
                outputs_values.push({
                    nodeId: this.id,
                    outputId: o,
                    data: data,
                });
            }
        }
        let slots_values = {
            cid: this.container.id,
            inputs: inputs_values,
            outputs: outputs_values,
        };
        this.container.server_editor_socket
            .in('' + this.container.id)
            .emit('nodes-io-values', slots_values);
    }
    updateInputsLabels() {
        if (this.inputs) {
            for (let i in this.inputs) {
                let input = this.inputs[i];
                input.label = '';
            }
            this.setDirtyCanvas(true, true);
        }
    }
    updateOutputsLabels() {
        if (this.outputs) {
            for (let o in this.outputs) {
                let output = this.outputs[o];
                output.label = '';
            }
            this.setDirtyCanvas(true, true);
        }
    }
    broadcastSettingsToClients() {
        this.sendMessageToEditorSide({
            action: BROADCAST.UPDATE_SETTINGS,
            payload: this.settings,
        });
    }
    broadcastOutputsToClients() {
        this.sendMessageToEditorSide({
            action: BROADCAST.UPDATE_OUTPUTS,
            payload: this.outputs,
        });
    }
    broadcastNodeStateToClients() {
        this.sendMessageToEditorSide({
            action: BROADCAST.UPDATE_STATE,
            payload: this.nodeState,
        });
    }
    broadcastTitleToClients() {
        this.sendMessageToEditorSide({
            action: BROADCAST.UPDATE_TITLE,
            payload: this.title,
        });
    }
    broadcastNameToClients() {
        this.sendMessageToEditorSide({
            action: BROADCAST.UPDATE_NAME,
            payload: this.name,
        });
    }
    broadcastValToClients(key, val) {
        this.sendMessageToEditorSide({
            action: BROADCAST.UPDATE_VALUE,
            key: key,
            payload: val,
        });
    }
    onGetMessageToEditorSide({ action, payload, key }) {
        switch (action) {
            case BROADCAST.UPDATE_VALUE:
                this.settings[key].value = payload;
                return;
            case BROADCAST.UPDATE_SETTINGS:
                this.settings = payload;
                return;
            case BROADCAST.UPDATE_OUTPUTS:
                this.outputs = payload;
                break;
            case BROADCAST.UPDATE_TITLE:
                this.title = payload;
                this.size = this.computeSize();
                break;
            case BROADCAST.UPDATE_STATE:
                this.nodeState = payload;
                break;
            case BROADCAST.UPDATE_NAME:
                this.name = payload;
                break;
            default:
                this.debugErr(`Received unknown editor action ${action} with payload ${JSON.stringify(payload)}`);
                break;
        }
    }
    setSettingsConfig(config) {
        this.settingConfigs = config;
    }
    formattedExecutionTime() {
        return moment(this.executeLastTime).format('YYYY-MM-DDTHH:MM:ss');
    }
    setNodeState(state) {
        this.nodeState = state;
        if (this.side == container_1.Side.server) {
            this.broadcastNodeStateToClients();
        }
    }
    getParentNode() {
        return registry_1.default._nodes[registry_1.default.getId(this.container.parent_container_id, this.container.parent_id)];
    }
    settingsWithValidation(inputSettings) {
        const outputSettings = inputSettings;
        let node_class = container_1.Container.nodes_types[this.type];
        let tempNode = new node_class(this.container, this.id, this.properties);
        const settings = Object.assign({}, tempNode.settings);
        Object.keys(outputSettings).forEach(key => {
            outputSettings[key].validation = settings[key] ? settings[key].validation : null;
        });
        return outputSettings;
    }
}
exports.Node = Node;
//# sourceMappingURL=node.js.map