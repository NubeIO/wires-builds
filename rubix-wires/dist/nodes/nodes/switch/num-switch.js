"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
class NumSwitchNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Numeric Switch';
        this.description =
            "Boolean 'switch' passes corresponding Numeric input to 'output'.  If 'switch' is 'true', Numeric 'inTrue' value will be passed to 'output'  'inTrue' and 'inFalse' values can be set in settings.";
        this.addInput('switch', node_1.Type.BOOLEAN);
        this.addInputWithSettings('inTrue', node_1.Type.NUMBER, null, 'True Value');
        this.addInputWithSettings('inFalse', node_1.Type.NUMBER, null, 'False Value');
        this.addOutput('output', node_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let select = this.getInputData(0);
        if (!utils_1.default.hasInput(select)) {
            this.setOutputData(0, null);
            return;
        }
        const inA = this.getInputData(1);
        const inB = this.getInputData(2);
        if (select)
            this.setOutputData(0, inA);
        else
            this.setOutputData(0, inB);
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('switch/num-switch', NumSwitchNode);
//# sourceMappingURL=num-switch.js.map