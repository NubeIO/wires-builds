"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
const node_io_1 = require("../../node-io");
class ScheduleMergeNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicSettingsExist = false;
        this.dynamicInputsType = node_io_1.Type.STRING;
        this.title = 'Weekly Schedule';
        this.description = 'Weekly Schedule';
        this.addOutput('output', node_io_1.Type.BOOLEAN);
        this.addOutput('error', node_io_1.Type.STRING);
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        var weeklyOutput = {};
        var eventOutput = {};
        var inputString;
        var inputObject;
        for (var i = 0; i < this.getInputsCount(); i++) {
            inputString = this.getInputData(i);
            if (!inputString)
                continue;
            try {
                inputObject = JSON.parse(inputString);
                for (var weeklySched in inputObject.weekly) {
                    weeklyOutput[weeklySched] = inputObject.weekly[weeklySched];
                }
                for (var eventSched in inputObject.events) {
                    weeklyOutput[eventSched] = inputObject.events[eventSched];
                }
                this.setOutputData(0, { weekly: weeklyOutput, events: eventOutput });
            }
            catch (e) {
                this.setOutputData(1, e);
            }
        }
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('schedule/schedule-merge', ScheduleMergeNode);
//# sourceMappingURL=schedule-merge.js.map