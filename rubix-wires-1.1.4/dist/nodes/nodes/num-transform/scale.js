"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
class ScaleNode extends node_1.Node {
    constructor() {
        super();
        this.interval = 250;
        this.title = 'Scale';
        this.description =
            "Performs a linear interpolation of the 'input' value based configured settings.  When 'input' value is between 'in-min' and 'in-max' it is linearly interpolated between 'out-min' and 'out-max'.  If 'input' is greater than the 'in-max' value, 'output' will be the 'out-max' value.  If 'input' is less than the 'in-min' value, 'output' will be the 'out-min' value.  'in-max', 'in-min', 'out-max', and 'out-min' values can be configured from settings.";
        this.addInput('input', node_1.Type.NUMBER);
        this.addInputWithSettings('in-min', node_1.Type.NUMBER, 0, 'Minimum Input', false);
        this.addInputWithSettings('in-max', node_1.Type.NUMBER, 100, 'Maximum Input', false);
        this.addInputWithSettings('out-min', node_1.Type.NUMBER, 0, 'Minimum Output', false);
        this.addInputWithSettings('out-max', node_1.Type.NUMBER, 10, 'Maximum Output', false);
        this.addOutput('output', node_1.Type.NUMBER);
        this.lastTime = Date.now();
    }
    onInputUpdated() {
        let now = Date.now();
        if (now - this.lastTime >= this.interval) {
            this.lastTime = now;
            let val = this.getInputData(0);
            const inMin = this.getInputData(1);
            const inMax = this.getInputData(2);
            const outMin = this.getInputData(3);
            const outMax = this.getInputData(4);
            if (val == null) {
                this.setOutputData(0, 0, true);
            }
            else {
                val = utils_1.default.remap(val, inMin, inMax, outMin, outMax);
                this.setOutputData(0, val.toFixed(1), true);
            }
        }
    }
}
container_1.Container.registerNodeType('num-transform/scale', ScaleNode);
//# sourceMappingURL=scale.js.map