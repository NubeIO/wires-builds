"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class LoraRawFilter extends node_1.Node {
    constructor() {
        super();
        this.title = `Nube LoRaRAW Filter`;
        this.description = 'This node filters differe nube lora protocols';
        this.addInput('rawInput', node_1.Type.STRING);
        this.addOutput('sensor', node_1.Type.STRING);
        this.addOutput('two-way', node_1.Type.STRING);
        this.addOutput('other', node_1.Type.STRING);
    }
    onInputUpdated() {
        let data = this.getInputData(0) || '';
        if (!data || data === '!\r\n')
            return;
        if (data.substring(data.length - 2, data.length) === '\r\n') {
            data = data.substring(0, data.length - 2);
        }
        else if (data.length % 2 === 1 && data[data.length - 1] === '\n') {
            data = data.substring(0, data.length - 1);
        }
        const sensorType = data.substring(2, 4);
        if (data.substring(0, 8) === 'FFFFFFFF' && data.length > 6 * 2) {
            this.setOutputData(1, data);
        }
        else if ((data.length === 36 || data.length === 44) &&
            (sensorType === 'AA' || sensorType === 'B0' || sensorType === 'B1' || sensorType === 'B2')) {
            this.setOutputData(0, data);
        }
        else {
            this.setOutputData(2, data);
        }
    }
}
exports.LoraRawFilter = LoraRawFilter;
container_1.Container.registerNodeType('nube/lora-raw-filter', LoraRawFilter);
//# sourceMappingURL=lora-filter.js.map