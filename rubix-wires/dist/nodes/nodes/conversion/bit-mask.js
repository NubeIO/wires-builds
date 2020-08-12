"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_1 = require("../../node");
const utils_1 = require("../../utils");
class BitMaskSingle extends node_1.Node {
    constructor() {
        super();
        this.title = 'Bit Mask Single';
        this.description = 'A node to mask a single bit of a byte';
        this.settings['bit'] = {
            description: 'bit index (0-7)',
            type: node_1.SettingType.NUMBER,
            value: 0,
        };
        this.settings['byte'] = {
            description: 'Byte to read if Array',
            type: node_1.SettingType.NUMBER,
            value: 0,
        };
        this.addInput('input', node_1.Type.ANY);
        this.addOutput('output', node_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        if (input === undefined || input === null) {
            return;
        }
        const BIT = this.settings['bit'].value;
        const BYTE = this.settings['byte'].value;
        if (typeof input === 'object') {
            if (!input || !input.length || input.length < BYTE + 1) {
                return;
            }
            input = input[BYTE];
        }
        this.setOutputData(0, (input >> BIT) & 0x01);
    }
    onAfterSettingsChange() {
        this.settings['bit'].value = utils_1.default.clamp(this.settings['bit'].value, 0, 7);
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('conversion/bit-mask-single', BitMaskSingle);
class BitMaskMultiple extends node_1.Node {
    constructor() {
        super();
        this.mask = 0;
        this.title = 'Bit Mask Multiple';
        this.description = 'A node to mask certain bits of a byte';
        this.settings['bitStart'] = {
            description: 'Lowest bit to start (0-7)',
            type: node_1.SettingType.NUMBER,
            value: 0,
        };
        this.settings['maskLen'] = {
            description: 'Mask length (1-8)',
            type: node_1.SettingType.NUMBER,
            value: 1,
        };
        this.settings['byte'] = {
            description: 'Byte to read if Array',
            type: node_1.SettingType.NUMBER,
            value: 0,
        };
        this.addInput('input', node_1.Type.ANY);
        this.addOutput('output', node_1.Type.NUMBER);
        this.addOutput('error', node_1.Type.STRING);
    }
    init() {
        this.updateMask();
    }
    onAdded() {
        this.updateMask();
        this.onInputUpdated();
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        if (input === undefined || input === null) {
            return;
        }
        const BIT_START = this.settings['bitStart'].value;
        const BYTE = this.settings['byte'].value;
        if (typeof input === 'object') {
            if (!input || !input.length || input.length < BYTE + 1) {
                return;
            }
            input = input[BYTE];
        }
        this.setOutputData(0, (input & this.mask) >> BIT_START);
    }
    onAfterSettingsChange() {
        this.settings['bitStart'].value = utils_1.default.clamp(this.settings['bitStart'].value, 0, 7);
        this.settings['maskLen'].value = utils_1.default.clamp(this.settings['maskLen'].value, 1, 8 - this.settings['bitStart'].value);
        this.updateMask();
        this.onInputUpdated();
    }
    updateMask() {
        this.mask = 0;
        for (let i = 0; i < this.settings['maskLen'].value; i++) {
            this.mask |= 1 << i;
        }
        this.mask <<= this.settings['bitStart'].value;
    }
}
container_1.Container.registerNodeType('conversion/bit-mask-multiple', BitMaskMultiple);
//# sourceMappingURL=bit-mask.js.map