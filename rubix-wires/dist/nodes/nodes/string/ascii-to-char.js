"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class TextASCIICharNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'ASCII Code to Char';
        this.description = "'output' is the character of the given Numeric ASCII code 'input' value.";
        this.addInput('input', node_io_1.Type.NUMBER);
        this.addOutput('output', node_io_1.Type.STRING);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, String.fromCharCode(val));
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('string/ascii-to-char', TextASCIICharNode);
//# sourceMappingURL=ascii-to-char.js.map