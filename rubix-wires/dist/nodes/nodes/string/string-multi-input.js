"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class StringMultiInputNode extends node_1.Node {
    constructor() {
        super();
        this.jsonOut = {
            input1: null,
            input2: null,
            input3: null,
            input4: null,
        };
        this.title = 'Multiple In to Single Out';
        this.description = 'Takes multiple and send on 1 output';
        this.addInput('trigger', node_1.Type.STRING);
        this.addInput('in 1', node_1.Type.STRING);
        this.addInput('in 2', node_1.Type.STRING);
        this.addInput('in 3', node_1.Type.STRING);
        this.addInput('in 4', node_1.Type.STRING);
        this.addOutput('out', node_1.Type.STRING);
        this.addOutput('json out', node_1.Type.STRING);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const in0 = this.getInputData(1);
        const in1 = this.getInputData(2);
        const in2 = this.getInputData(3);
        const in3 = this.getInputData(4);
        const in0Updated = this.inputs[1].updated;
        const in1Updated = this.inputs[2].updated;
        const in2Updated = this.inputs[3].updated;
        const in3Updated = this.inputs[4].updated;
        if (in0Updated) {
            Object.assign(this.jsonOut, { input1: in0 });
            this.setOutputData(0, in0);
        }
        if (in1Updated) {
            Object.assign(this.jsonOut, { input2: in1 });
            this.setOutputData(0, in1);
        }
        if (in2Updated) {
            Object.assign(this.jsonOut, { input3: in2 });
            this.setOutputData(0, in2);
        }
        if (in3Updated) {
            Object.assign(this.jsonOut, { input4: in3 });
            this.setOutputData(0, in3);
        }
        this.setOutputData(1, this.jsonOut);
    }
}
container_1.Container.registerNodeType('string/string-multi-input', StringMultiInputNode);
//# sourceMappingURL=string-multi-input.js.map