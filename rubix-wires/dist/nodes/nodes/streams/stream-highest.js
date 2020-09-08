"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class NumbersHighestNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Stream Highest';
        this.description =
            `## Description\n ` +
                ` 'output' is the highest received Numeric 'input' value.  'output' is reset when 'reset' transitions from 'false' to 'true'. \n ` +
                ` ## Reset to null\n ` +
                `***Reset to null*** if set to option true and a true value on the node ***reset*** this will reset the node ***output*** to a value of null, If set to false it will keep the last node ***output*** value \n `;
        this.addInput('input', node_io_1.Type.NUMBER);
        this.addInput('reset', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.NUMBER);
        this.settings['null'] = {
            description: 'Reset to null',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.lastReset = false;
        this.val = null;
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
                this.val = null;
                this.lastReset = reset;
            }
            return;
        }
        else if (!reset && this.lastReset) {
            this.lastReset = reset;
            return;
        }
        let inputVal = this.getInputData(0);
        if (inputVal == null)
            return;
        if (this.val == null || this.val < inputVal) {
            this.val = inputVal;
            this.setOutputData(0, this.val);
        }
    }
}
container_1.Container.registerNodeType('streams/stream-highest', NumbersHighestNode);
//# sourceMappingURL=stream-highest.js.map