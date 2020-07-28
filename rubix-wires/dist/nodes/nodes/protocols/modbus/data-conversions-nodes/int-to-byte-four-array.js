"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../../../container");
const node_1 = require("../../../../node");
const modbus_point_byte_order_1 = require("../../modbus/modbus-fc/modbus-point-byte-order");
class IntToFourByteArrayNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Int to Buffer';
        this.description =
            'A node to convert an int to a buffer array to an int with Big-endian And Little-endian format. This node is used for testing data types';
        this.addInput('in 1', node_1.Type.ANY);
        this.addOutput('out', node_1.Type.JSON);
        this.addOutput('out data', node_1.Type.JSON);
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
        const dataEndian = this.settings['dataEndian'].value;
        const dataType = this.settings['dataType'].value;
        const out = modbus_point_byte_order_1.default.writeValue(input, dataType, dataEndian);
        this.setOutputData(0, JSON.stringify(out));
        this.setOutputData(1, JSON.parse(JSON.stringify(out)).data);
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('protocols/modbus/int-to-buffer', IntToFourByteArrayNode);
//# sourceMappingURL=int-to-byte-four-array.js.map