"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_icons_1 = require("../../node-icons");
const node_io_1 = require("../../node-io");
let uiMainIcon = node_icons_1.default.uiMainIcon;
let uiMainColour = node_icons_1.default.uiMainColour;
class MathAbsNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Absolute';
        this.description =
            "('output' = |'in 1'|) 'output' is the absolute value (positive) of the Numeric input.";
        this.addInput('input', node_io_1.Type.NUMBER);
        this.addOutput('output', node_io_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null)
            this.setOutputData(0, Math.abs(val));
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('math/absolute', MathAbsNode);
//# sourceMappingURL=absolute.js.map