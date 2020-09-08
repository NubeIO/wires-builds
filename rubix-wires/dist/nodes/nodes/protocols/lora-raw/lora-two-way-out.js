"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const node_io_1 = require("../../../node-io");
const lora_two_way_in_1 = require("./lora-two-way-in");
class LoRaRawTwoWayOutput extends node_1.Node {
    constructor() {
        super();
        this.payloadDefinition = [];
        this.inputsUpdated = [];
        this.title = `Nube LoRaRAW Two Way Out`;
        this.description = 'This node compiles points to Nubes LoRa Two Way protocol';
        this.settings['enable'] = {
            description: 'enable',
            type: node_1.SettingType.BOOLEAN,
            value: false,
        };
        this.settings['senderId'] = {
            description: 'sender Id',
            type: node_1.SettingType.NUMBER,
            value: 0,
        };
        this.settings['port'] = {
            description: 'port number',
            type: node_1.SettingType.NUMBER,
            value: 0,
        };
        this.settings['types'] = {
            description: 'Types',
            type: node_1.SettingType.READONLY,
            value: 'INT8, INT16, INT32, FLOAT',
        };
        this.settings['definition'] = {
            description: 'payload definition (JSON)',
            type: node_1.SettingType.STRING,
            value: '',
        };
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addOutput('error', node_io_1.Type.STRING);
        this.addOutput('output', node_io_1.Type.ANY);
    }
    init() {
        this.updateOutputs();
    }
    onAdded() {
        this.payloadDefinition = this.stringToDataTypes(this.settings['definition'].value);
        this.inputsUpdated = new Array(this.payloadDefinition.length);
        this.inputsUpdated.fill(false);
    }
    onInputUpdated() {
        for (let i = 1; i < this.getInputsCount(); i++) {
            if (this.inputs[i].updated) {
                this.inputsUpdated[i - 1] = true;
            }
        }
        if (this.settings['enable'].value === false)
            return;
        if (!this.inputs[0].updated || this.getInputData(0) === false) {
            return;
        }
        const parseError = msg => {
            this.setOutputData(1, 'parse error: ' + msg);
        };
        const checkInputAndType = (value, type) => {
            let isOk = true;
            switch (type) {
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.INT8:
                    isOk = value >= -128 && value <= 127;
                    break;
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.UINT8:
                    isOk = value >= 0 && value <= 0xff;
                    break;
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.INT16:
                    isOk = value >= -32768 && value <= 32767;
                    break;
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.UINT16:
                    isOk = value >= 0 && value <= 0xffff;
                    break;
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.INT32:
                    isOk = value >= -2147483648 && value <= 2147483647;
                    break;
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.UINT32:
                    isOk = value >= 0 && value <= 0xffffffff;
                    break;
            }
            return isOk;
        };
        this.inputsUpdated.fill(true);
        let data_lengths = 0;
        for (let i = 0; i < this.payloadDefinition.length; i++) {
            if (this.inputsUpdated[i]) {
                data_lengths += lora_two_way_in_1.LORA_DATA_TYPE_LENGTHS[this.payloadDefinition[i]] + 1;
            }
        }
        if (data_lengths === 0) {
            parseError('No input updates');
            return;
        }
        let buffer = Buffer.alloc(data_lengths + 2);
        buffer.writeUInt8(this.settings['senderId'].value, 0);
        buffer.writeUInt8(this.settings['port'].value, 1);
        let point = 0;
        for (let i = 2; i < buffer.length;) {
            if (!this.inputsUpdated[point]) {
                point++;
                continue;
            }
            let type = this.payloadDefinition[point];
            let value = this.getInputData(point + 1);
            if (!checkInputAndType(value, type)) {
                parseError('invalid value input ' + point);
                return;
            }
            buffer.writeUInt8(point, i++);
            switch (type) {
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.INT8:
                    buffer.writeInt8(value, i);
                    break;
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.UINT8:
                    buffer.writeUInt8(value, i);
                    break;
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.INT16:
                    buffer.writeInt16LE(value, i);
                    break;
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.UINT16:
                    buffer.writeUInt16LE(value, i);
                    break;
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.INT32:
                    buffer.writeInt32LE(value, i);
                    break;
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.UINT32:
                    buffer.writeUInt32LE(value, i);
                    break;
                case lora_two_way_in_1.LORA_DATA_TYPE_NAMES.FLOAT:
                    buffer.writeFloatLE(value, i);
                    break;
            }
            i += lora_two_way_in_1.LORA_DATA_TYPE_LENGTHS[type];
            point++;
        }
        this.setOutputData(1, null);
        this.setOutputData(0, buffer);
        this.inputsUpdated.fill(false);
    }
    onAfterSettingsChange() {
        this.payloadDefinition = this.updateOutputs();
        this.setOutputData(1, null);
        this.onInputUpdated();
    }
    updateOutputs() {
        const data = this.stringToDataTypes(this.settings['definition'].value);
        if (this.payloadDefinition.length !== data.length) {
            const inputsCount = this.getInputsCount();
            for (let i = 1; i < inputsCount; i++) {
                this.removeInput(i);
            }
            this.inputsUpdated = new Array(data.length);
            for (let i = 0; i < data.length; i++) {
                this.addInput(i.toString(), node_io_1.Type.NUMBER);
                this.inputsUpdated[i] = false;
            }
        }
        return data;
    }
    stringToDataTypes(str) {
        const data = str
            .toUpperCase()
            .replace(/ /g, '')
            .split(',')
            .filter(x => x !== '');
        if (data && data.length) {
            for (let i = 0; i < data.length; i++) {
                if (lora_two_way_in_1.LORA_DATA_TYPE_NAMES[data[i]] === undefined) {
                    this.setOutputData(1, 'settings parse error');
                    return undefined;
                }
                data[i] = lora_two_way_in_1.LORA_DATA_TYPE_NAMES[data[i]];
            }
        }
        return data;
    }
}
exports.LoRaRawTwoWayOutput = LoRaRawTwoWayOutput;
container_1.Container.registerNodeType('protocols/lora-raw/lora-raw-two-way-out', LoRaRawTwoWayOutput);
//# sourceMappingURL=lora-two-way-out.js.map