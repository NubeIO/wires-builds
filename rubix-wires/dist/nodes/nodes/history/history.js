"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const history_config_1 = require("../../utils/points/history-config");
let moment = require('moment-timezone');
var Influx = require('influx');
class HistoryNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'History';
        this.description =
            'The History node is used to store values to an external database.   History logs (when enabled) are pushed to either the Nube DB or an Influx DB instance.  A ‘Point Name’ should be entered (under ‘History’ settings) to identify the history by name. History logging options are ‘Change Of Value (COV)’, ‘Periodic’, and ‘Trigger Only’.  When set to COV, a log will be saved when the value changes by the ‘COV Threshold’ from the last saved history value.  When set to ‘Periodic’ a log will be saved at every ‘Logging Interval’ period. When set to either ‘COV’ or ‘Periodic’ a log entry can be saved by transitioning the ‘histTrigger’ input from ‘false’ to ‘true’.  If only the ‘histTrigger’ action is required, set the ‘History Logging Mode’ to ‘Trigger Only’.   If the history/history node is unable to send the history logs to the configured database (network connection issues, or incorrect configuration) then they will be stored locally, and ‘storedHistCount’ will increase.  Currently the local storage limit is set to 50 logs. The history/history node has limited memory so the capacity is limited to 50 log entries; beware of using too many history/history nodes as it could affect the operation of Wires.  If ‘Round up in increments of’ setting is used (not zero), then the timestamp will be rounded up to the nearest increment value step.  If the input value is a Number, the ‘Decimal Places’ setting will round the input value to the specified number of decimal places.';
        this.addInput('input', node_1.Type.ANY);
        history_config_1.default.addHistorySettings(this);
        this.setSettingsConfig({ groups: [], conditions: {} });
        history_config_1.default.addHistorySettingsConfig(this);
    }
    onCreated() {
        history_config_1.default.historyOnCreated(this);
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            history_config_1.default.doHistoryFunctions(this);
        });
    }
    onAfterSettingsChange() {
        history_config_1.default.historyFunctionsForAfterSettingsChange(this, this.settings['pointName'].value);
        if (this.side !== container_1.Side.server)
            return;
    }
}
container_1.Container.registerNodeType('history/history', HistoryNode);
//# sourceMappingURL=history.js.map