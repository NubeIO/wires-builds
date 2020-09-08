"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_1 = require("../../node");
const node_io_1 = require("../../node-io");
class IntToBits extends node_1.Node {
    constructor() {
        super();
        this.title = 'Bit Split';
        this.description =
            'A node to split an Int (or Int array) into all individual bits\nAssuming all Ints are 8 bits (UINT8)';
        this.settings['start'] = {
            description: 'Start index if Array',
            type: node_1.SettingType.NUMBER,
            value: 0,
        };
        this.settings['bytes'] = {
            description: 'Bytes to read if Array',
            type: node_1.SettingType.NUMBER,
            value: 1,
        };
        this.addInput('input', node_io_1.Type.ANY);
    }
    init() {
        this.setNewOutputs();
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        if (input === undefined || input === null) {
            return;
        }
        if (typeof input === 'number') {
            input = [input];
        }
        const START = this.settings['start'].value;
        const BYTES = this.settings['bytes'].value;
        if (!input || !input.length || input.length < BYTES) {
            return;
        }
        let outputIndex = 0;
        for (let i = 0; i < BYTES; i++) {
            for (let j = 0; j < 8; j++) {
                this.setOutputData(outputIndex++, (input[START + i] >> j) & 0x01);
            }
        }
    }
    onAfterSettingsChange() {
        this.setNewOutputs();
        this.onInputUpdated();
    }
    setNewOutputs() {
        let outputsLen = this.getOutputsCount();
        for (let i = 0; i < outputsLen; i++) {
            this.removeOutput(i);
        }
        outputsLen = this.settings['bytes'].value * 8;
        for (let i = 0; i < outputsLen; i++) {
            this.addOutput(i.toString(), node_io_1.Type.NUMBER);
        }
        this.updateNodeOutput();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('conversion/int-to-bits', IntToBits);
//# sourceMappingURL=bit-split.js.map