"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_icons_1 = require("../../node-icons");
const node_io_1 = require("../../node-io");
let logicMainColour = node_icons_1.default.logicMainColour;
let logicAndIcon = node_icons_1.default.logicAndIcon;
let logicOrIcon = node_icons_1.default.logicOrIcon;
class XorNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'XOR';
        this.description =
            "Performs a logical 'XOR' operation (output 'true' when EITHER input is 'true', but not both). Limited to only 2 inputs.";
        this.addInput('in 1', node_io_1.Type.BOOLEAN);
        this.addInput('in 2', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.BOOLEAN);
        this.addOutput('out not', node_io_1.Type.BOOLEAN);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const in1 = this.getInputData(0);
        const in2 = this.getInputData(1);
        if ((in1 && !in2) || (!in1 && in2)) {
            this.setOutputData(0, true, true);
            this.setOutputData(1, false, true);
        }
        else {
            this.setOutputData(0, false, true);
            this.setOutputData(1, true, true);
        }
    }
}
container_1.Container.registerNodeType('boolean/xor', XorNode);
//# sourceMappingURL=xor.js.map