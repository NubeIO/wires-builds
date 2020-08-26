"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class NumbersSumNode extends node_1.Node {
    constructor() {
        super();
        this.val = 0;
        this.title = 'Stream Sum';
        this.description =
            `## Description\n ` +
                ` output' is the sum of all received Numeric 'input' value.  'output' is reset to 0 when 'reset' transitions from 'false' to 'true'. \n ` +
                ` ## Reset to null\n ` +
                `***Reset to null*** if set to option true and a true value on the node ***reset*** this will reset the node ***output*** to a value of null, If set to false it will keep the last node ***output*** value \n `;
        this.addInput('input', node_1.Type.NUMBER);
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.NUMBER);
        this.settings['null'] = {
            description: 'Reset to null',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.lastReset = false;
    }
    onInputUpdated() {
        const reset = this.getInputData(1);
        const resetToNull = this.settings['null'].value;
        if (reset && !this.lastReset) {
            if (resetToNull) {
                this.setOutputData(0, null);
                this.val = null;
                this.lastReset = reset;
            }
            else {
                this.setOutputData(0, this.val);
                this.val = 0;
                this.lastReset = reset;
            }
            return;
        }
        else if (!reset && this.lastReset) {
            this.lastReset = reset;
            return;
        }
        if (this.inputs[0].updated && this.inputs[0].data != null)
            this.val += this.inputs[0].data;
        this.setOutputData(0, this.val, true);
    }
}
container_1.Container.registerNodeType('streams/stream-sum', NumbersSumNode);
//# sourceMappingURL=stream-sum.js.map