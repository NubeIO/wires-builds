"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class LessThanNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Less than';
        this.description =
            "'out <' is 'true' when 'in 1' is less than 'in 2', otherwise 'out <' is 'false'.  'out <=' is 'true' when 'in 1' is less than or equal to 'in 2', otherwise 'out <=' is 'false'.  Both outputs will be 'false' if either input is undefined.";
        this.addInput('in 1', node_1.Type.NUMBER);
        this.addInputWithSettings('in 2', node_1.Type.NUMBER, 0, 'In 2 Constant', false);
        this.addOutput('out <', node_1.Type.BOOLEAN);
        this.addOutput('out <=', node_1.Type.BOOLEAN);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let a = this.getInputData(0);
        let b = this.getInputData(1);
        if (a != null && b != null) {
            this.setOutputData(0, a < b);
            this.setOutputData(1, a <= b);
            return;
        }
        else {
            this.setOutputData(0, false, true);
            this.setOutputData(1, false, true);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('compare/less-than', LessThanNode);
//# sourceMappingURL=less-than.js.map