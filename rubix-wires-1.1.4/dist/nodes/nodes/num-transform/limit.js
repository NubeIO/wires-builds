"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class LimitNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Limit';
        this.description =
            "'output' follows the 'input' value when it is between the 'min' and 'max' values.  If 'input' is greater than the 'max' value, 'output' will be the 'max' value.  If 'input' is less than the 'min' value, 'output' will be the 'min' value.  'max' and 'min' values can be configured from settings.";
        this.addInput('input', node_1.Type.NUMBER);
        this.addInputWithSettings('min', node_1.Type.NUMBER, 0, 'min', false);
        this.addInputWithSettings('max', node_1.Type.NUMBER, 5, 'max', false);
        this.addOutput('output', node_1.Type.NUMBER);
    }
    onCreated() {
        this.setOutputData(0, this.settings['min'].value);
    }
    onInputUpdated() {
        const val = this.getInputData(0);
        const min = this.getInputData(1);
        const max = this.getInputData(2);
        if (val >= max) {
            this.setOutputData(0, max);
        }
        else if (val <= min) {
            this.setOutputData(0, min);
        }
        else {
            this.setOutputData(0, val);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('num-transform/limit', LimitNode);
//# sourceMappingURL=limit.js.map