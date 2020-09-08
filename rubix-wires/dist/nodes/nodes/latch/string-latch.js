"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
class StringLatchNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'String Latch';
        this.description =
            "The String 'input' value is passed to 'output' when 'latch' transitions from 'false' to 'true'; The 'output' value is maintained until the next 'false' to 'true' transition.";
        this.addInput('input', node_io_1.Type.STRING);
        this.addInput('latch', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.STRING);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let latch = this.getInputData(1);
        if (latch == null) {
            this.setOutputData(0, null, true);
            return;
        }
        if (latch == this.lastLatchValue)
            return;
        this.lastLatchValue = latch;
        if (latch == true) {
            let input = this.getInputData(0);
            if (!utils_1.default.hasInput(input)) {
                this.setOutputData(0, null, true);
                return;
            }
            if (input === '')
                input = null;
            this.setOutputData(0, input, true);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('latch/string-latch', StringLatchNode);
//# sourceMappingURL=string-latch.js.map