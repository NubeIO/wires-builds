"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_1 = require("../../node");
const modbus_point_byte_order_1 = require("../protocols/modbus/modbus-fc/modbus-point-byte-order");
class ByteArrayToIntNode extends node_1.Node {
    constructor() {
        super();
        this.value = null;
        this.title = 'Byte Array To Int';
        this.description =
            'A node to convert an 4 and 8 (long) byte array to an int with Big-endian And Little-endian format. Example [0,0,0,5,11,88,37,12] = 190326028';
        this.addInput('in 1', node_1.Type.ANY);
        this.addOutput('out', node_1.Type.JSON);
        this.addOutput('out buffer', node_1.Type.JSON);
        this.settings['dataType'] = {
            description: 'Set data type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'na' },
                    { value: 1, text: 'INT-16' },
                    { value: 2, text: `UINT-16` },
                    { value: 3, text: 'INT-32' },
                    { value: 4, text: 'UINT-32' },
                    { value: 5, text: 'FLOAT-32' },
                    { value: 8, text: 'DOUBLE-64' },
                ],
            },
            value: 0,
        };
        this.settings['dataEndian'] = {
            description: 'Set byte order',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'LE-Byte BE-Word' },
                    { value: 1, text: 'LE-Byte LE-Word' },
                    { value: 2, text: 'BE-Byte LE-Word' },
                    { value: 3, text: 'BE-Byte BE-Word' },
                ],
            },
            value: 0,
        };
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const input = this.getInputData(0);
        try {
            const buffer = Buffer.from(input);
            const dataEndian = this.settings['dataEndian'].value;
            const dataType = this.settings['dataType'].value;
            const out = modbus_point_byte_order_1.default.readByteOrder(buffer, 0, dataType, dataEndian);
            this.setOutputData(0, JSON.stringify(out));
            this.setOutputData(1, JSON.stringify(buffer));
        }
        catch (error) { }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('conversion/buffer-array-to-int', ByteArrayToIntNode);
//# sourceMappingURL=byte-array-to-int.js.map