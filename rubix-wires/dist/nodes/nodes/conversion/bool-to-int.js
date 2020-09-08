"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_1 = require("../../node");
const node_io_1 = require("../../node-io");
class BoolToIntNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Bool-to-Int Conversion';
        this.description = 'This node converts a Boolean to a Number.';
        this.addInput('input', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.NUMBER);
    }
    onInputUpdated() {
        this.setOutputData(0, this.inputs[0].data ? 1 : 0);
    }
}
container_1.Container.registerNodeType('conversion/bool-to-int', BoolToIntNode);
class IntToBoolNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Int-to-Bool Conversion';
        this.description = 'This node converts a Number to a Boolean.';
        this.addInput('input', node_io_1.Type.NUMBER);
        this.addOutput('output', node_io_1.Type.BOOLEAN);
    }
    onInputUpdated() {
        this.setOutputData(0, !!this.inputs[0].data);
    }
}
container_1.Container.registerNodeType('conversion/int-to-bool', IntToBoolNode);
class StringToBool extends node_1.Node {
    constructor() {
        super();
        this.title = 'String-to-Bool Conversion';
        this.description = 'This node converts a Number to a Boolean.';
        this.addInput('input', node_io_1.Type.STRING);
        this.addOutput('output', node_io_1.Type.BOOLEAN);
    }
    onInputUpdated() {
        const val = this.getInputData(0);
        if (val === "0" || val === 'false') {
            this.setOutputData(0, false, true);
        }
        else if (val === "1" || val === 'true') {
            this.setOutputData(0, true, true);
        }
    }
}
container_1.Container.registerNodeType('conversion/string-to-bool', StringToBool);
//# sourceMappingURL=bool-to-int.js.map