"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const HistoryBase_1 = require("./HistoryBase");
class HistoryNode extends HistoryBase_1.default {
    constructor() {
        super();
        this.title = 'History';
        this.description =
            'The History node is used to store values to an external database.   History logs (when enabled) are pushed to either the Nube DB or an Influx DB instance.  A ‘Point Name’ should be entered (under ‘History’ settings) to identify the history by name. History logging options are ‘Change Of Value (COV)’, ‘Periodic’, and ‘Trigger Only’.  When set to COV, a log will be saved when the value changes by the ‘COV Threshold’ from the last saved history value.  When set to ‘Periodic’ a log will be saved at every ‘Logging Interval’ period. When set to either ‘COV’ or ‘Periodic’ a log entry can be saved by transitioning the ‘histTrigger’ input from ‘false’ to ‘true’.  If only the ‘histTrigger’ action is required, set the ‘History Logging Mode’ to ‘Trigger Only’.   If the history/history node is unable to send the history logs to the configured database (network connection issues, or incorrect configuration) then they will be stored locally, and ‘storedHistCount’ will increase.  Currently the local storage limit is set to 50 logs. The history/history node has limited memory so the capacity is limited to 50 log entries; beware of using too many history/history nodes as it could affect the operation of Wires.  If ‘Round up in increments of’ setting is used (not zero), then the timestamp will be rounded up to the nearest increment value step.  If the input value is a Number, the ‘Decimal Places’ setting will round the input value to the specified number of decimal places.';
        this.addInput('input', node_1.Type.ANY);
        this.addHistorySettingsConfig();
    }
}
container_1.Container.registerNodeType('history/history', HistoryNode);
//# sourceMappingURL=history.js.map