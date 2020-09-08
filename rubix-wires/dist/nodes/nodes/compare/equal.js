"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
class EqualNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Equal';
        this.description =
            "'output equal' is 'true' when 'in 1' and 'in 2' are identical, otherwise 'output equal' is 'false'.  Can be used to compare boolean, numeric, and string values; it can also be used to compare 'null' values. 'output not equal' is always the opposite of 'out equal'.";
        this.addInput('in 1', node_io_1.Type.ANY);
        this.addInputWithSettings('in 2', node_io_1.Type.ANY, null, 'in 2');
        this.addOutput('out equal', node_io_1.Type.BOOLEAN);
        this.addOutput('out not equal', node_io_1.Type.BOOLEAN);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let a = this.getInputData(0);
        if (!utils_1.default.hasInput(a)) {
            this.setOutputData(0, false);
            this.setOutputData(1, true);
            return;
        }
        a = (a || '').toString();
        const b = (this.getInputData(1) || '').toString();
        if (a === b) {
            this.setOutputData(0, true);
            this.setOutputData(1, false);
        }
        else {
            this.setOutputData(0, false);
            this.setOutputData(1, true);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('compare/equal', EqualNode);
//# sourceMappingURL=equal.js.map