"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const helper_1 = require("../../../utils/helper");
const node_io_1 = require("../../node-io");
class EventCounterNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Any Event Counter';
        this.description =
            "‘count' increases by 1 every time an event occurs at 'input'. Any incoming value, including null, will be taken. 'count' will be reset to 0 when 'reset' transitions from 'false' to 'true.  ‘toggle’ will alternate between ‘true’ and ‘false’, changing each time count increases. ";
        this.addInput('input');
        this.addInput('reset', node_io_1.Type.BOOLEAN);
        this.addOutput('count', node_io_1.Type.NUMBER);
        this.addOutput('toggle', node_io_1.Type.NUMBER);
        this.setOutputData(0, 0);
        this.setOutputData(1, false);
        this.settings['null'] = {
            description: 'Stop count if input is null',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.properties['count'] = 0;
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const inputUpdated = this.inputs[0].updated;
        const inputData = this.inputs[0].data;
        const reset = this.inputs[1].data;
        if (reset && reset == true)
            this.properties['count'] = 0;
        if (this.settings['null'].value && this.isNull(inputData))
            return;
        if (inputUpdated) {
            this.properties['count']++;
            this.setOutputData(1, !this.outputs[1].data);
        }
        if (this.properties['count'] !== inputData) {
            this.setOutputData(0, this.properties['count']);
            this.persistProperties(false, true);
        }
    }
    isNull(message) {
        return helper_1.isNull(message);
    }
}
container_1.Container.registerNodeType('count/any-event-counter', EventCounterNode);
//# sourceMappingURL=any-event-counter.js.map