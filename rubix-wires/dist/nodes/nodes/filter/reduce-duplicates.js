"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class FiltersReduceDuplicatesNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Reduce Duplicates';
        this.description =
            'This node reduces the number of duplicated transmitted values. <br/><br/>' +
                'When the value on the input is changed, ' +
                'the node sends it to the output and stops ' +
                'receiving the same value at a specified time interval. <br/>' +
                'The values that come at this time and that are the same are simply ignored, ' +
                'but the last value will be stored if it is enabled in the settings. <br/>' +
                'When the interval passes, the last value is sent to the output. ' +
                'This reduces the number of events, if they are sent too often, but' +
                'ensures that the node will always send the last actual value. <br/><br/>' +
                'You can disable the sending of the last value in the settings of the node. ' +
                'This may be necessary if you do not want to receive messages late, ' +
                'but then it is not guaranteed that the nodes connected to this node ' +
                'will have the last actual value.<br>' +
                'If you activate Reset pin, the node will reset the timer ' +
                'and send the last value, if it is enabled in the settings. ';
        this.addInput('value');
        this.settings['sendlast'] = {
            description: 'Store and send last value',
            value: true,
            type: node_1.SettingType.BOOLEAN,
        };
        this.addInputWithSettings('interval', node_io_1.Type.NUMBER, 1000, 'Interval', false);
        this.addInput('reset', node_io_1.Type.BOOLEAN);
        this.addOutput('value');
        this.lastTime = Date.now();
    }
    onInputUpdated() {
        if (this.inputs[2].updated && this.inputs[2].data) {
            this.lastTime = 0;
        }
        if (this.inputs[0].updated) {
            const interval = this.getInputData(1);
            if (Date.now() - this.lastTime >= interval || this.inputs[0].data != this.lastValue) {
                this.lastValue = this.inputs[0].data;
                this.lastTime = Date.now();
                this.setOutputData(0, this.inputs[0].data);
            }
            else {
                if (this.settings['sendlast'].value == true) {
                    this.waitingToSend = true;
                }
            }
        }
    }
    onExecute() {
        if (!this.waitingToSend)
            return;
        const interval = this.getInputData(1);
        if (Date.now() - this.lastTime < interval)
            return;
        this.lastTime = Date.now();
        this.setOutputData(0, this.lastValue);
        this.waitingToSend = false;
    }
}
container_1.Container.registerNodeType('filter/reduce-duplicates', FiltersReduceDuplicatesNode);
//# sourceMappingURL=reduce-duplicates.js.map