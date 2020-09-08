"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class HysteresisNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Hysteresis';
        this.description =
            "Boolean 'output' based on 'input' in relation to 'risingEdge' and 'fallingEdge' setpoints.  There are 2 cases: 'risingEdge' greater than 'fallingEdge', and 'risingEdge' less than 'fallingEdge'. [For 'risingEdge' > 'fallingEdge'] => 'output' is 'true' when 'input' is greater than 'risingEdge'.  'output' is  'false' when 'input' is less than 'fallingEdge'. [For 'fallingEdge' < 'fallingEdge'] => 'output' is 'false' when 'input' is greater than 'risingEdge'.  'output' is 'true' when 'input' is less than 'fallingEdge'.  In both cases, when 'input' is between 'risingEdge' and 'fallingEdge', 'output' will remain in its current state.  ";
        this.addInput('input', node_io_1.Type.NUMBER);
        this.addInputWithSettings('risingEdge', node_io_1.Type.NUMBER, 20, 'Rising Edge', false);
        this.addInputWithSettings('fallingEdge', node_io_1.Type.NUMBER, 10, 'Falling Edge', false);
        this.addOutput('output', node_io_1.Type.BOOLEAN);
        this.addOutput('out not', node_io_1.Type.BOOLEAN);
        this.setOutputData(0, false);
        this.setOutputData(1, true);
    }
    onAdded() {
        this.setOutputData(0, false);
    }
    onInputUpdated() {
        let inMsg = this.getInputData(0);
        let risingEdge = this.getInputData(1);
        let fallingEdge = this.getInputData(2);
        if (risingEdge != null && fallingEdge != null) {
            if (risingEdge > fallingEdge) {
                if (inMsg <= fallingEdge) {
                    this.setOutputData(0, false);
                    this.setOutputData(1, true);
                }
                if (inMsg >= risingEdge) {
                    this.setOutputData(0, true);
                    this.setOutputData(1, false);
                }
            }
            else if (risingEdge < fallingEdge) {
                if (inMsg >= fallingEdge) {
                    this.setOutputData(0, false);
                    this.setOutputData(1, true);
                }
                if (inMsg <= risingEdge) {
                    this.setOutputData(0, true);
                    this.setOutputData(1, false);
                }
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
container_1.Container.registerNodeType('compare/hysteresis', HysteresisNode);
//# sourceMappingURL=hysteresis.js.map