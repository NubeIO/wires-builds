"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class CounterNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Counter';
        this.description =
            "'count' increases by 1 every time 'countUp' transitions from 'false' to 'true.  'count' decreases by 1 every time 'countDown' transitions from 'false' to 'true.  'count' will be set to 'set value' when 'reset' transitions from 'false' to 'true.";
        this.addInputWithSettings('set value', node_io_1.Type.NUMBER, 0, 'Set Value');
        this.addInput('count up', node_io_1.Type.BOOLEAN);
        this.addInput('count down', node_io_1.Type.BOOLEAN);
        this.addInput('reset', node_io_1.Type.BOOLEAN);
        this.addOutput('count', node_io_1.Type.NUMBER);
        this.properties['pointVal'] = 0;
    }
    onCreated() {
        this.setOutputData(1, false);
        this.setOutputData(2, false);
        this.lastUp = false;
        this.lastDown = false;
        this.lastReset = false;
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const old = this.outputs[0].data;
        const up = this.getInputData(1) || false;
        const down = this.getInputData(2) || false;
        const reset = this.getInputData(3) || false;
        if (this.inputs[1].updated && up && !this.lastUp)
            this.properties['pointVal']++;
        this.lastUp = up;
        if (this.inputs[2].updated && down && !this.lastDown)
            this.properties['pointVal']--;
        this.lastDown = down;
        const setValue = this.getInputData(0);
        if (this.inputs[3].updated && reset && !this.lastReset)
            this.properties['pointVal'] = setValue;
        this.lastReset = reset;
        if (this.properties['pointVal'] !== old) {
            this.setOutputData(0, this.properties['pointVal']);
            this.properties['pointVal'] = this.properties['pointVal'];
            this.persistProperties(false, true);
        }
    }
}
container_1.Container.registerNodeType('count/counter', CounterNode);
//# sourceMappingURL=counter.js.map