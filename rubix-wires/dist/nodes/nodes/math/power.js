"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class MathPowNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Power';
        this.description =
            "('output' = 'in 1' ^ 'in 2') 'output' is the result of 'in 1' to the power of 'in 2'. Input values can be set from settings.";
        this.addInputWithSettings('in 1', node_io_1.Type.NUMBER, 0, 'in 1');
        this.addInputWithSettings('in 2', node_io_1.Type.NUMBER, 1, 'in 2');
        this.addOutput('output', node_io_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let x = this.getInputData(0);
        let y = this.getInputData(1);
        if (x != null && y != null)
            this.setOutputData(0, Math.pow(x, y));
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('math/power', MathPowNode);
//# sourceMappingURL=power.js.map