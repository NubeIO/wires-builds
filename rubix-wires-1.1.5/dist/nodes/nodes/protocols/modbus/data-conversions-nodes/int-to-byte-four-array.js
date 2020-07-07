"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../../node");
const container_1 = require("../../../../container");
class IntToFourByteArrayNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Int to 4 Byte Array';
        this.description =
            'A node to convert an int to a 4 byte array to an int with Big-endian And Little-endian format';
        this.addInput('in 1', node_1.Type.ANY);
        this.addOutput('out buffer big-endian', node_1.Type.JSON);
        this.addOutput('out buffer little-endian ', node_1.Type.JSON);
        this.addOutput('out array big-endian ', node_1.Type.JSON);
        this.addOutput('out array little-endian ', node_1.Type.JSON);
        this.addOutput('error', node_1.Type.STRING);
    }
    onAdded() {
        this.onInputUpdated();
    }
    bufferOut(int) {
        return new Promise((resolve, reject) => {
            try {
                var output = [];
                var bufBE = Buffer.alloc(4);
                bufBE.writeFloatBE(int, 0);
                output.push(bufBE[1]);
                output.push(bufBE[0]);
                output.push(bufBE[3]);
                output.push(bufBE[2]);
                const i = bufBE.readInt16BE(0);
                const j = bufBE.readInt16BE(2);
                let arr = [i, j];
                let arrLE = [j, i];
                resolve([
                    {
                        bufBE: output,
                        arrBE: arr,
                        arrLE: arrLE,
                    },
                ]);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        this.bufferOut(input)
            .then(value => {
            let output = value[0].bufBE;
            let arrBE = value[0].arrBE;
            let arrLE = value[0].arrLE;
            var buffer = Buffer.from(output).swap16();
            let bufLeToJson = buffer.toJSON();
            this.setOutputData(0, output);
            this.setOutputData(1, bufLeToJson.data);
            this.setOutputData(2, arrBE);
            this.setOutputData(3, arrLE);
        })
            .catch(err => {
            this.debugErr(err);
            this.setOutputData(4, JSON.stringify(err));
        });
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('protocols/modbus/int-to-byte-four-array', IntToFourByteArrayNode);
//# sourceMappingURL=int-to-byte-four-array.js.map