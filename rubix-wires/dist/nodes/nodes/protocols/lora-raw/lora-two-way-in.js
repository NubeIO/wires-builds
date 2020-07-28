"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
var LORA_DATA_TYPE_NAMES;
(function (LORA_DATA_TYPE_NAMES) {
    LORA_DATA_TYPE_NAMES[LORA_DATA_TYPE_NAMES["INT8"] = 0] = "INT8";
    LORA_DATA_TYPE_NAMES[LORA_DATA_TYPE_NAMES["UINT8"] = 1] = "UINT8";
    LORA_DATA_TYPE_NAMES[LORA_DATA_TYPE_NAMES["INT16"] = 2] = "INT16";
    LORA_DATA_TYPE_NAMES[LORA_DATA_TYPE_NAMES["UINT16"] = 3] = "UINT16";
    LORA_DATA_TYPE_NAMES[LORA_DATA_TYPE_NAMES["INT32"] = 4] = "INT32";
    LORA_DATA_TYPE_NAMES[LORA_DATA_TYPE_NAMES["UINT32"] = 5] = "UINT32";
    LORA_DATA_TYPE_NAMES[LORA_DATA_TYPE_NAMES["FLOAT"] = 6] = "FLOAT";
})(LORA_DATA_TYPE_NAMES = exports.LORA_DATA_TYPE_NAMES || (exports.LORA_DATA_TYPE_NAMES = {}));
exports.LORA_DATA_TYPE_LENGTHS = [
    1,
    1,
    2,
    2,
    4,
    4,
    4,
];
class LoRaRawTwoWayInput extends node_1.Node {
    constructor() {
        super();
        this.payloadDefinition = [];
        this.title = `Nube LoRaRAW Two Way In`;
        this.description = 'This node parses Nubes LoRa Two Way protocol';
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
        this.addInput('rawInput', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
    }
    init() {
        this.updateOutputs();
    }
    onAdded() {
        this.payloadDefinition = this.stringToDataTypes(this.settings['definition'].value);
    }
    onInputUpdated() {
        let data = this.getInputData(0) || '';
        if (this.settings['enable'].value === false)
            return;
        if (!data)
            return;
        if (!data || data.length <= 6 * 2 || data.substring(0, 8) !== 'FFFFFFFF') {
            return;
        }
        const senderId = parseInt(data.substring(10, 12), 16);
        const port = parseInt(data.substring(12, 14), 16);
        if (senderId !== this.settings['senderId'].value || port !== this.settings['port'].value) {
            return;
        }
        if (data.substring(data.length - 2, data.length) === '\r\n') {
            data = data.substring(0, data.length - 2);
        }
        else if (data.length % 2 === 1 && data[data.length - 1] === '\n') {
            data = data.substring(0, data.length - 1);
        }
        const parseError = msg => {
            this.setOutputData(0, 'parse error: ' + msg);
        };
        let buffer = Buffer.from(data.substring(14), 'hex');
        let pointParsed = new Array(this.payloadDefinition.length);
        pointParsed.fill(false);
        for (let i = 0; i < buffer.length;) {
            let point = buffer.readUInt8(i++);
            let type_length = 0;
            if (point >= this.payloadDefinition.length) {
                parseError('invalid point ' + point);
                return;
            }
            if (pointParsed[point]) {
                parseError('point already parsed: ' + point);
                return;
            }
            type_length = exports.LORA_DATA_TYPE_LENGTHS[this.payloadDefinition[point]];
            if (buffer.length - i < type_length) {
                parseError('invalid length');
                return;
            }
            switch (this.payloadDefinition[point]) {
                case LORA_DATA_TYPE_NAMES.INT8:
                    this.setOutputData(point + 1, buffer.readInt8(i));
                    break;
                case LORA_DATA_TYPE_NAMES.UINT8:
                    this.setOutputData(point + 1, buffer.readUInt8(i));
                    break;
                case LORA_DATA_TYPE_NAMES.INT16:
                    this.setOutputData(point + 1, buffer.readInt16LE(i));
                    break;
                case LORA_DATA_TYPE_NAMES.UINT16:
                    this.setOutputData(point + 1, buffer.readUInt16LE(i));
                    break;
                case LORA_DATA_TYPE_NAMES.INT32:
                    this.setOutputData(point + 1, buffer.readInt32LE(i));
                    break;
                case LORA_DATA_TYPE_NAMES.UINT32:
                    this.setOutputData(point + 1, buffer.readUInt32LE(i));
                    break;
                case LORA_DATA_TYPE_NAMES.FLOAT:
                    this.setOutputData(point + 1, buffer.readFloatLE(i));
                    break;
            }
            pointParsed[point] = true;
            i += type_length;
        }
        this.setOutputData(0, null);
    }
    onAfterSettingsChange() {
        this.payloadDefinition = this.updateOutputs();
        this.setOutputData(0, null);
        this.onInputUpdated();
    }
    updateOutputs() {
        const data = this.stringToDataTypes(this.settings['definition'].value);
        if (this.payloadDefinition.length !== data.length) {
            const outputsCount = this.getOutputsCount();
            for (let i = 1; i < outputsCount; i++) {
                this.removeOutput(i);
            }
            for (let i = 0; i < data.length; i++) {
                this.addOutput(i.toString(), node_1.Type.NUMBER);
            }
            this.updateNodeOutput();
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
                if (LORA_DATA_TYPE_NAMES[data[i]] === undefined) {
                    this.setOutputData(1, 'settings parse error');
                    return undefined;
                }
                data[i] = LORA_DATA_TYPE_NAMES[data[i]];
            }
        }
        return data;
    }
}
exports.LoRaRawTwoWayInput = LoRaRawTwoWayInput;
container_1.Container.registerNodeType('protocols/lora-raw/lora-raw-two-way-in', LoRaRawTwoWayInput);
//# sourceMappingURL=lora-two-way-in.js.map