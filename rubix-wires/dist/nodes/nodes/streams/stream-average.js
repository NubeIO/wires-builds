"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class NumbersAverageNode extends node_1.Node {
    constructor() {
        super();
        this.values = [];
        this.title = 'Stream Average';
        this.description =
            `## Description\n ` +
                ` 'output' is the average of all received Numeric 'input' value.  'output' is reset when 'reset' transitions from 'false' to 'true'. \n ` +
                ` ## Reset to null\n ` +
                `***Reset to null*** if set to option true and a true value on the node ***reset*** this will reset the node ***output*** to a value of null, If set to false it will keep the last node ***output*** value \n `;
        this.addInput('value', node_1.Type.NUMBER);
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
        let val = this.getInputData(0);
        const resetToNull = this.settings['null'].value;
        if (reset && !this.lastReset) {
            if (resetToNull) {
                this.setOutputData(0, null);
                this.values = [];
                this.lastReset = reset;
            }
            else {
                this.values = [];
                this.setOutputData(0, this.avg);
                this.lastReset = reset;
            }
            return;
        }
        else if (!reset && this.lastReset) {
            this.lastReset = reset;
            return;
        }
        if (val == null)
            return;
        this.values.push(val);
        let sum = this.values.reduce(function (a, b) {
            return a + b;
        });
        let avg = sum / this.values.length;
        this.avg = avg;
        this.setOutputData(0, this.avg);
    }
}
container_1.Container.registerNodeType('streams/stream-average', NumbersAverageNode);
//# sourceMappingURL=stream-average.js.map