"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const moment = require("moment");
const events_1 = require("../events");
const container_1 = require("./container");
const node_link_1 = require("./node-link");
const registry_1 = require("./registry");
const utils_1 = require("./utils");
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
    BROADCAST[BROADCAST["UPDATE_PROPERTIES"] = 6] = "UPDATE_PROPERTIES";
})(BROADCAST = exports.BROADCAST || (exports.BROADCAST = {}));
var Type;
(function (Type) {
    Type["STRING"] = "string";
    Type["NUMBER"] = "number";
    Type["BOOLEAN"] = "boolean";
    Type["ANY"] = "any";
    Type["JSON"] = "json";
    Type["DROPDOWN"] = "dropdown";
})(Type = exports.Type || (exports.Type = {}));
var NodeState;
(function (NodeState) {
    NodeState["NORMAL"] = "normal";
    NodeState["INFO"] = "info";
    NodeState["WARNING"] = "warning";
    NodeState["ERROR"] = "error";
    NodeState["DISABLED"] = "disabled";
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
        case Type.DROPDOWN:
            return SettingType.DROPDOWN;
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
        this.linkHandler = node_link_1.createLinkHandler(this);
        this.contextMenu = {};
        this.clonable = true;
        this.flags = {};
        this.showIcon = true;
        this.convertInput = (input, dataType, decimals = 3) => {
            const inputDataType = typeof input;
            if (dataType === Type.NUMBER) {
                input = Number((isNaN(input) ? 0 : Number(input)).toFixed(decimals));
            }
            else if (dataType === Type.BOOLEAN) {
                if (inputDataType === 'boolean')
                    input = Number(input);
                else
                    input = input === 1 || input === 'true' ? 1 : 0;
            }
            else if (dataType === Type.STRING && inputDataType !== 'string') {
                input = JSON.stringify(input);
            }
            return input;
        };
    }
    onAfterSettingsChange(oldSettings, oldName) { }
    configure(ser_node) {
        for (let key in ser_node) {
            if (key == 'console')
                continue;
            if (ser_node[key] == null)
                continue;
            if (typeof ser_node[key] == 'object') {
                if (this[key] && this[key].configure) {
                    this[key].configure(ser_node[key]);
                }
                else {
                    this[key] = utils_1.default.cloneObject(ser_node[key], this[key]);
                }
            }
            else {
                this[key] = ser_node[key];
            }
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
        if (val != null) {
            this.setOutputData(0, callback(val));
        }
        else {
            this.setOutputData(0, null);
        }
    }
    updateNodeInput() {
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, { $set: { inputs: this.inputs } });
    }
    updateNodeOutput() {
        if (this.container.db) {
            this.container.db.updateNode(this.id, this.container.id, { $set: { outputs: this.outputs } });
        }
    }
    persistProperties(saveSettings = false, saveProperties = false, saveInputs = false, saveOutputs = false) {
        if (!this.container.db)
            return;
        const props = {};
        if (saveSettings)
            props['props'] = this.settings;
        if (saveProperties)
            props['properties'] = this.properties;
        if (saveInputs)
            props['inputs'] = this.inputs;
        if (saveOutputs)
            props['outputs'] = this.outputs;
        this.container.db.updateNode(this.id, this.container.id, {
            $set: props,
        });
    }
    persistConfiguration(callback = doNothing) {
        if (this.container.db) {
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { settings: this.settings, properties: this.properties },
            }, callback);
        }
    }
    updateNodeInputOutput() {
        if (this.container.db) {
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { inputs: this.inputs, outputs: this.outputs },
            });
        }
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
            const input = this.inputs[slotId];
            let data = input.data;
            if (this.inputs[slotId] &&
                this.inputs[slotId].setting &&
                this.inputs[slotId].setting.exist &&
                (!utils_1.default.hasValidInput(data, this.inputs[slotId].setting.nullable) || input.type === Type.DROPDOWN)) {
                const settingName = this.inputs[slotId].name.match(/\[(.*?)\]/)[1];
                const setting = this.settings[settingName];
                if (input.type === Type.DROPDOWN) {
                    if (!setting.config.items.map(x => x.value).includes(data))
                        data = setting.value;
                }
                else
                    data = utils_1.default.parseValue(setting.value, input.type);
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
    addOutput(name, type, id = undefined, extra_info) {
        id = this.getFreeOutputId(id);
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
    getFreeOutputId(id = undefined) {
        if (!this.outputs)
            return 0;
        if (id !== undefined && !this.outputs[id]) {
            return id;
        }
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
    addInput(name, type, setting = { exist: false, nullable: false, hidden: false }, id = undefined, extra_info) {
        id = this.getFreeInputId(id);
        name = name || 'in ' + (id + 1);
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
    addInputWithSettings(name, type, defaultValue, description = name, nullable = true, config, extra_info) {
        const setting = { exist: true, nullable, hidden: false };
        this.addInput(`[${name}]`, type, setting, extra_info);
        this.settings[name] = {
            description,
            value: defaultValue,
            type: exports.convertType(type),
        };
        if (config) {
            this.settings[name] = Object.assign(Object.assign({}, this.settings[name]), { config: config });
        }
    }
    addInputAtPosition(position, name, type, setting = { exist: false, nullable: false, hidden: false }, extra_info = {}) {
        if (!this.inputs)
            this.inputs = {};
        const inputsCount = this.getInputsCount();
        if (position >= inputsCount) {
            return this.addInput(name, type, setting, extra_info);
        }
        const myID = this.id;
        for (let i = inputsCount; i > position; i--) {
            this.inputs[i] = this.inputs[i - 1];
            if (this.inputs[i].hasOwnProperty('link')) {
                const outputNode = this.container._nodes[`${this.inputs[i].link.target_node_id}`];
                let linksArray = outputNode.outputs[`${this.inputs[i].link.target_slot}`].links;
                const replaceLinkIndex = linksArray.findIndex(link => {
                    return link.target_node_id == myID && link.target_slot == i - 1;
                });
                if (replaceLinkIndex != -1)
                    linksArray.splice(replaceLinkIndex, 1, { target_node_id: myID, target_slot: i });
                outputNode.updateNodeOutput();
            }
        }
        let input = Object.assign({ name, type, setting }, extra_info);
        this.inputs[position] = input;
        this.size = this.computeSize();
        if (this['onInputAdded'])
            this['onInputAdded'](input);
        return position;
    }
    getFreeInputId(id = undefined) {
        if (!this.inputs)
            return 0;
        if (id !== undefined && !this.inputs[id]) {
            return id;
        }
        for (let i = 0; i < 1000; i++) {
            if (!this.inputs[i])
                return i;
        }
    }
    hideInput(immediateDirtyCanvas = true, ...ids) {
        for (let id of ids) {
            this.disconnectInputLink(null, id);
            this.inputs[id].setting.hidden = true;
        }
        this.redrawNode(immediateDirtyCanvas);
    }
    showInput(immediateDirtyCanvas = true, ...ids) {
        for (let id of ids) {
            this.inputs[id].setting.hidden = false;
        }
        this.redrawNode(immediateDirtyCanvas);
    }
    redrawNode(immediateDirtyCanvas = true) {
        if (immediateDirtyCanvas) {
            this.size = this.computeSize();
            this.setDirtyCanvas(true, true);
        }
    }
    removeInput(id) {
        this.disconnectInputLink(id);
        delete this.inputs[id];
        this.size = this.computeSize();
        if (this['onInputRemoved'])
            this['onInputRemoved'](id);
    }
    removeInputAtPosition(slot) {
        this.disconnectInputLink(slot);
        const inputsCount = this.getInputsCount();
        const myID = this.id;
        for (let i = slot; i < inputsCount - 1; i++) {
            this.inputs[i] = this.inputs[i + 1];
            if (this.inputs[i].hasOwnProperty('link')) {
                const outputNode = this.container._nodes[`${this.inputs[i].link.target_node_id}`];
                let linksArray = outputNode.outputs[`${this.inputs[i].link.target_slot}`].links;
                const replaceLinkIndex = linksArray.findIndex(link => {
                    return link.target_node_id == myID && link.target_slot == i + 1;
                });
                if (replaceLinkIndex != -1)
                    linksArray.splice(replaceLinkIndex, 1, { target_node_id: myID, target_slot: i });
                outputNode.updateNodeOutput();
            }
        }
        delete this.inputs[inputsCount - 1];
        this.size = this.computeSize();
        if (this['onInputRemoved'])
            this['onInputRemoved'](slot);
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
    getLastInputIndex() {
        return this.inputs ? Object.values(this.inputs).filter(value => !value.setting.hidden).length : 0;
    }
    getLastOutputIndex() {
        return this.outputs ? Object.values(this.outputs).length : 0;
    }
    computeHeight() {
        let i_slots = this.getLastInputIndex();
        let o_slots = this.getLastOutputIndex();
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
        if (this.inputs) {
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
        }
        if (this.outputs) {
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
    connect(output_id, target_node_id, target_input_slot, target_input_id) {
        return this.linkHandler.make({
            origin_id: this.id,
            origin_slot: output_id,
            target_id: target_node_id,
            target_slot: target_input_slot,
            target_input_id: target_input_id,
        });
    }
    disconnectOutputLinks(slot) {
        return this.linkHandler.disconnectOutput(slot);
    }
    disconnectInputLink(input_slot, input_id) {
        return this.linkHandler.disconnectInput(input_slot, input_id);
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
        if (this.container) {
            return `[${this.type}][${this.container.id}/${this.id}]`;
        }
        else {
            return `[${this.type}][-/${this.id}]`;
        }
    }
    sendMessageToServerSide(message) {
        if (this.side === container_1.Side.server) {
            log.warn(`Node ${this.getReadableId()} is trying to send message from server side to server side`);
        }
        else {
            this.container.client_socket.emit('nodeMessageToServerSide', {
                id: this.id,
                cid: this.container.id,
                message: message,
            });
        }
    }
    sendMessageToEditorSide(message, onlyConnectedUsers = true) {
        let m = { id: this.id, cid: this.container.id, message };
        if (this.side == container_1.Side.editor) {
            log.warn(`Node ${this.getReadableId()} is trying to send message from editor side to editor side`);
        }
        else if (this.side === container_1.Side.server) {
            let socket = this.container.server_editor_socket;
            if (onlyConnectedUsers) {
                socket.in('' + this.container.id).emit('nodeMessageToEditorSide', m);
            }
            else {
                socket.emit('nodeMessageToEditorSide', m);
            }
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
        if (this.side === container_1.Side.editor) {
            log.warn('Node ' + this.getReadableId() + ' is trying to send message from editor side to editor side');
        }
        else if (this.side === container_1.Side.server) {
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
        if (this.side === container_1.Side.editor) {
            log.warn('Node ' + this.getReadableId() + ' is trying to send message from editor side to editor side');
        }
        else if (this.side === container_1.Side.server) {
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
        if (this.side === container_1.Side.editor) {
            log.warn('Node ' + this.getReadableId() + ' is trying to send message from editor side to editor side');
        }
        else if (this.side === container_1.Side.server) {
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
        if (this.side === container_1.Side.editor) {
            log.warn('Node ' + this.getReadableId() + ' is trying to send message from editor side to editor side');
        }
        else if (this.side === container_1.Side.server) {
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
        this.container.server_editor_socket.in('' + this.container.id).emit('nodes-io-values', slots_values);
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
        this.sendMessageToEditorSide({ action: BROADCAST.UPDATE_SETTINGS, payload: this.settings });
    }
    broadcastPropertiesToClients() {
        this.sendMessageToEditorSide({ action: BROADCAST.UPDATE_PROPERTIES, payload: this.properties });
    }
    broadcastOutputsToClients() {
        this.sendMessageToEditorSide({ action: BROADCAST.UPDATE_OUTPUTS, payload: this.outputs });
    }
    broadcastNodeStateToClients() {
        this.sendMessageToEditorSide({ action: BROADCAST.UPDATE_STATE, payload: this.nodeState });
    }
    broadcastTitleToClients() {
        this.sendMessageToEditorSide({ action: BROADCAST.UPDATE_TITLE, payload: this.title });
    }
    broadcastNameToClients() {
        this.sendMessageToEditorSide({ action: BROADCAST.UPDATE_NAME, payload: this.name });
    }
    broadcastValToClients(key, val) {
        this.sendMessageToEditorSide({ action: BROADCAST.UPDATE_VALUE, key: key, payload: val });
    }
    onGetMessageToEditorSide({ action, payload, key }) {
        switch (action) {
            case BROADCAST.UPDATE_VALUE:
                this.settings[key].value = payload;
                return;
            case BROADCAST.UPDATE_SETTINGS:
                this.settings = payload;
                return;
            case BROADCAST.UPDATE_PROPERTIES:
                this.properties = payload;
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
    displayError(e, message = '') {
        this.container.server_editor_socket.emit(events_1.ERROR, `${message} ${this.extractErrorMessage(e)}`);
    }
    displayMessage(message) {
        this.container.server_editor_socket.emit(events_1.NOTIFICATION, message);
    }
    extractErrorMessage(e) {
        return lodash_1.get(e, 'response.data.message', lodash_1.get(e, 'message', e));
    }
}
exports.Node = Node;
//# sourceMappingURL=node.js.map