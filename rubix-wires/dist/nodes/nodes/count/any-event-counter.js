"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_utils_1 = require("../../utils/node-utils");
class EventCounterNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Any Event Counter';
        this.description =
            "‘count' increases by 1 every time an event occurs at 'input'. Any incoming value, including null, will be taken. 'count' will be reset to 0 when 'reset' transitions from 'false' to 'true.  ‘toggle’ will alternate between ‘true’ and ‘false’, changing each time count increases. ";
        this.addInput('input');
        this.addInput('reset', node_1.Type.BOOLEAN);
        this.addOutput('count', node_1.Type.NUMBER);
        this.addOutput('toggle', node_1.Type.NUMBER);
        this.setOutputData(0, 0);
        this.setOutputData(1, false);
        this.properties['pointVal'] = 0;
    }
    onInputUpdated() {
        if (this.inputs[1].updated && this.inputs[1].data == true)
            this.properties['pointVal'] = 0;
        else if (this.inputs[0].updated) {
            this.properties['pointVal']++;
            this.setOutputData(1, !this.outputs[1].data);
        }
        if (this.properties['pointVal'] !== this.outputs[0].data) {
            this.setOutputData(0, this.properties['pointVal']);
            node_utils_1.default.persistProperties(this, false, true);
        }
    }
}
container_1.Container.registerNodeType('count/any-event-counter', EventCounterNode);
//# sourceMappingURL=any-event-counter.js.map