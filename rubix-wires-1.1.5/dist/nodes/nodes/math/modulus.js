"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class MathModulusNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Modulus';
        this.description =
            "('output' = 'in 1' % 'in 2') 'output' is the modulus of the Numeric inputs. Input values can be set from settings.";
        this.addInputWithSettings('in 1', node_1.Type.NUMBER, 0, 'in 1');
        this.addInputWithSettings('in 2', node_1.Type.NUMBER, 1, 'in 2');
        this.addOutput('output', node_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const a = this.getInputData(0);
        const b = this.getInputData(1);
        if (a != null && b != null)
            this.setOutputData(0, a % b);
        else
            this.setOutputData(0, null);
    }
}
container_1.Container.registerNodeType('math/modulus', MathModulusNode);
//# sourceMappingURL=modulus.js.map