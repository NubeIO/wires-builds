"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class BetweenNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Between';
        this.description =
            "'output' is 'true' when 'in 1' is within the numeric range between 'from' value and 'to' value (exclusive), otherwise 'output' is 'false'.  'output' will be 'false' if either input is undefined. 'outp not' is always the opposite of 'output'.";
        this.addInput('input', node_io_1.Type.NUMBER);
        this.addInputWithSettings('from', node_io_1.Type.NUMBER, 0, 'From Value', false);
        this.addInputWithSettings('to', node_io_1.Type.NUMBER, 1, 'To Value', false);
        this.addOutput('output', node_io_1.Type.BOOLEAN);
        this.addOutput('out not', node_io_1.Type.BOOLEAN);
        this.setOutputData(0, false);
        this.setOutputData(1, true);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        let from = this.getInputData(1);
        let to = this.getInputData(2);
        if (val != null && from != null && to != null) {
            if (val >= Math.min(from, to) && val <= Math.max(from, to)) {
                this.setOutputData(0, true, true);
                this.setOutputData(1, false, true);
            }
            else {
                this.setOutputData(0, false, true);
                this.setOutputData(1, true, true);
            }
        }
        else {
            this.setOutputData(0, false, true);
            this.setOutputData(1, true, true);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('compare/between', BetweenNode);
//# sourceMappingURL=between.js.map