"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const node_io_1 = require("../../../node-io");
class LoRaRawTwoWayTest extends node_1.Node {
    constructor() {
        super();
        this.title = `Nube LoRaRAW Two Way Test Node`;
        this.description = 'Acts as the transport layer for testing only';
        this.addInput('input', node_io_1.Type.ANY);
        this.addOutput('output', node_io_1.Type.STRING);
    }
    onInputUpdated() {
        let buffer = this.getInputData(0);
        if (!buffer) {
            return;
        }
        let str = 'FFFFFFFF';
        let len = buffer.length.toString(16).toUpperCase();
        len = len.length == 1 ? '0' + len : len;
        str += len;
        str += buffer.toString('hex').toUpperCase();
        console.log('LoRa Two Way output buffer and input hex string:');
        console.log(buffer);
        console.log(str);
        this.setOutputData(0, str);
    }
}
exports.LoRaRawTwoWayTest = LoRaRawTwoWayTest;
container_1.Container.registerNodeType('protocols/lora-raw/lora-raw-two-way-test', LoRaRawTwoWayTest);
//# sourceMappingURL=lora-two-way-test.js.map