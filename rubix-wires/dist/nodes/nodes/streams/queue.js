"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class QueueNode extends node_1.Node {
    constructor() {
        super();
        this.data = [];
        this.title = 'Queue';
        this.description =
            "'input' values are stored in a list.  Stored 'input' values are passed to 'output' one by one each time 'trigger' transitions from 'false' to 'true'.  'input' values are passed to 'output' in a first-in, first-out order.  Stored 'input' values are deleted when 'clear' transitions from 'false' to 'true'. 'count' is the number of stored 'input' values.";
        this.addInput('input');
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addInput('clear', node_io_1.Type.BOOLEAN);
        this.addOutput('output');
        this.addOutput('count', node_io_1.Type.NUMBER);
        this.lastReset = false;
    }
    onInputUpdated() {
        const reset = this.getInputData(2);
        if (reset && !this.lastReset) {
            this.data = [];
            this.setOutputData(0, null);
            this.setOutputData(1, 0);
            this.lastReset = reset;
            return;
        }
        else if (!reset && this.lastReset) {
            this.lastReset = reset;
            return;
        }
        if (this.inputs[0].updated && this.inputs[0].data != null) {
            this.data.unshift(this.inputs[0].data);
            this.setOutputData(1, this.data.length);
        }
        if (this.inputs[1].updated && this.inputs[1].data == true) {
            let val = this.data.length > 0 ? this.data.pop() : null;
            this.setOutputData(0, val);
            this.setOutputData(1, this.data.length);
        }
    }
}
container_1.Container.registerNodeType('streams/queue', QueueNode);
//# sourceMappingURL=queue.js.map