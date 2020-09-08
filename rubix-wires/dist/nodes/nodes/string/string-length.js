"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class TextStringLengthNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'String Length';
        this.description = "'output' is the number of characters in the given String 'input' value.";
        this.addInput('input', node_io_1.Type.STRING);
        this.addOutput('output', node_io_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, val.length);
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('string/string-length', TextStringLengthNode);
//# sourceMappingURL=string-length.js.map