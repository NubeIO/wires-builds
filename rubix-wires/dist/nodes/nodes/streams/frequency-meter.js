"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class TimeFrequencyMeterNode extends node_1.Node {
    constructor() {
        super();
        this.count = 0;
        this.countWas = 0;
        this.title = 'Frequency meter';
        this.description =
            "This node measures the frequency of the incoming 'input' events.  Any value sent to 'input' (excluding null) will be accepted.  'events/sec' output is the average rate received 'input' values.  'events/sec' is reset when 'reset' transitions from 'false' to 'true'.";
        this.addInput('input');
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addOutput('events/sec', node_1.Type.NUMBER, undefined, { data: 0 });
        this.lastReset = false;
        setInterval(() => {
            if (this.count != this.countWas) {
                this.setOutputData(0, this.count);
            }
            this.countWas = this.count;
            this.count = 0;
        }, 1000);
    }
    onInputUpdated() {
        const reset = this.getInputData(1);
        if (reset && !this.lastReset) {
            this.count = 0;
            this.countWas = 0;
            this.setOutputData(0, null);
            this.lastReset = reset;
            return;
        }
        else if (!reset && this.lastReset) {
            this.lastReset = reset;
            return;
        }
        this.count++;
    }
}
container_1.Container.registerNodeType('streams/frequency-meter', TimeFrequencyMeterNode);
//# sourceMappingURL=frequency-meter.js.map