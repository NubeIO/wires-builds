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
const container_1 = require("../../container");
const base_edge_1 = require("./base-edge");
const utils_1 = require("../../utils");
const axios_1 = require("axios");
const node_1 = require("../../node");
const time_utils_1 = require("../../utils/time-utils");
class ApiSchedules extends base_edge_1.BaseEdge {
    constructor() {
        super();
        this.suffixApi = '/schedules';
        this.title = 'Api Schedule';
        this.description =
            "This node is used to fetch schedules from Nube devices.  Once the nube/login node is successfully authenticated, the API-Schedule nodes will have their settings updated with values from the connected Nube devices.  API-Schedule node will output all schedules from the device; Specific schedule selection is done on the ‘Schedule-Checker’ node.  ‘interval’ is how often the node will re-check for schedule changes (minimum 30 seconds).  It is recommended that the API-Schedule node is used in conjunction with a filter/prevent-null node to maintain the last successful schedule read in the case that the API-Login node becomes disconnected. 'interval’ units can be configured from settings.  Maximum ‘interval’ setting is 587 hours.";
        this.addInput('trigger', node_1.Type.BOOLEAN);
        this.addInputWithSettings('interval', node_1.Type.NUMBER, 60, 'Interval (minimum 30 seconds)', false);
        this.addOutput('data', node_1.Type.JSON);
        this.addOutput('error', node_1.Type.STRING);
        this.settings['time'] = {
            description: 'Units',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'milliseconds', text: 'Milliseconds' },
                    { value: 'seconds', text: 'Seconds' },
                    { value: 'minutes', text: 'Minutes' },
                    { value: 'hours', text: 'Hours' },
                ],
            },
            value: 'seconds',
        };
        this.setSettingsConfig({
            groups: [{ interval: { weight: 2 }, time: {} }],
        });
    }
    onAdded() {
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
        this.setExecuteInterval();
    }
    onAfterSettingsChange() {
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
        this.setExecuteInterval();
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            this.setExecuteInterval();
            let trigger = this.getInputData(0);
            if (trigger && this.inputs[0].updated) {
                yield this.onExecute();
            }
        });
    }
    onExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.fetchConnection(this.suffixApi);
                const data = yield this.fetchSchedules(user);
                this.setOutputData(0, data);
                this.setOutputData(1, null);
            }
            catch (e) {
                this.setOutputData(0, null);
                this.setOutputData(1, e.message);
            }
        });
    }
    setExecuteInterval() {
        let interval = this.getInputData(1);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        interval = Math.max(interval, 60000);
        this.EXECUTE_INTERVAL = interval;
    }
    fetchSchedules({ jwt, host, port }) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${utils_1.default.buildUrl(host, port)}${this.suffixApi}`;
            const response = yield axios_1.default.get(url, { headers: { Authorization: jwt } });
            return response.data;
        });
    }
}
container_1.Container.registerNodeType('nube/api-schedules', ApiSchedules);
//# sourceMappingURL=api-schedules.js.map