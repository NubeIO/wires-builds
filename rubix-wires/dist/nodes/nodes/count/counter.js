"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class CounterNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Counter';
        this.description =
            "'count' increases by 1 every time 'countUp' transitions from 'false' to 'true.  'count' decreases by 1 every time 'countDown' transitions from 'false' to 'true.  'count' will be set to 'set value' when 'reset' transitions from 'false' to 'true.";
        this.addInputWithSettings('set value', node_1.Type.NUMBER, 0, 'Set Value');
        this.addInput('count up', node_1.Type.BOOLEAN);
        this.addInput('count down', node_1.Type.BOOLEAN);
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addOutput('count', node_1.Type.NUMBER);
        this.properties['pointVal'] = 0;
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let old = this.outputs[0].data;
        if (this.inputs[1].updated && this.inputs[1].data == true)
            this.properties['pointVal']++;
        if (this.inputs[2].updated && this.inputs[2].data == true)
            this.properties['pointVal']--;
        const setValue = this.getInputData(0);
        if (this.inputs[3].updated && this.inputs[3].data == true)
            this.properties['pointVal'] = setValue;
        if (this.properties['pointVal'] !== old) {
            this.setOutputData(0, this.properties['pointVal']);
            this.properties['pointVal'] = this.properties['pointVal'];
            this.persistProperties(false, true);
        }
    }
}
container_1.Container.registerNodeType('count/counter', CounterNode);
//# sourceMappingURL=counter.js.map