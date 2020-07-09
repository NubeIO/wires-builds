"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../../node");
const container_1 = require("../../../../container");
class ByteArrayToIntNode extends node_1.Node {
    constructor() {
        super();
        this.value = null;
        this.title = 'Byte Array To Int';
        this.description =
            'A node to convert an 4 and 8 (long) byte array to an int with Big-endian And Little-endian format. Example [0,0,0,5,11,88,37,12] = 190326028';
        this.addInput('in 1', node_1.Type.JSON);
        this.addOutput('out little-endian 4 byte', node_1.Type.NUMBER);
        this.addOutput('out big-endian 4 byte', node_1.Type.NUMBER);
        this.addOutput('out 8 byte', node_1.Type.NUMBER);
        this.addOutput('error', node_1.Type.STRING);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        try {
            const buf = Buffer.alloc(4);
            buf.writeInt16LE(input[0], 2);
            buf.writeInt16LE(input[1], 0);
            let outLE = buf.readFloatLE(0);
            this.setOutputData(0, outLE);
        }
        catch (err) {
            this.debugErr(err);
            this.setOutputData(2, JSON.stringify(err));
        }
        try {
            const bufBE = Buffer.alloc(4);
            bufBE.writeInt16BE(input[0], 2);
            bufBE.writeInt16BE(input[1], 0);
            let outBE = bufBE.readFloatBE(0);
            this.setOutputData(1, outBE);
        }
        catch (err) {
            this.debugErr(err);
            this.setOutputData(2, JSON.stringify(err));
        }
        try {
            for (var i = 0; i < input.length; i++) {
                this.value = (this.value << 8) | input[i];
            }
        }
        catch (err) {
            this.debugErr(err);
            this.setOutputData(2, JSON.stringify(err));
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('protocols/modbus/byte-array-to-int', ByteArrayToIntNode);
//# sourceMappingURL=byte-array-to-int.js.map