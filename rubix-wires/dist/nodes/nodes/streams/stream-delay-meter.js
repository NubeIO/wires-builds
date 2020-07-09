"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class DelayMeterNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Stream Delay meter';
        this.description =
            "This node measures the delay between the incoming events.  Any value sent to 'input' (excluding null) will be accepted.  'ms' output is the time between the lastest 'input', and the previous 'input'.   'ms' is reset when 'reset' transitions from 'false' to 'true'.  'ms' output is in millis.";
        this.addInput('input');
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addOutput('ms', node_1.Type.NUMBER);
        this.lastReset = false;
    }
    onInputUpdated() {
        const reset = this.getInputData(1);
        if (reset && !this.lastReset) {
            this.lastTime = null;
            this.setOutputData(0, null);
            this.lastReset = reset;
            return;
        }
        else if (!reset && this.lastReset) {
            this.lastReset = reset;
            return;
        }
        if (this.inputs[0].updated && this.inputs[0].data != null) {
            if (this.lastTime != null) {
                let delay = Date.now() - this.lastTime;
                this.setOutputData(0, delay);
            }
            this.lastTime = Date.now();
        }
    }
}
container_1.Container.registerNodeType('streams/stream-delay-meter', DelayMeterNode);
//# sourceMappingURL=stream-delay-meter.js.map