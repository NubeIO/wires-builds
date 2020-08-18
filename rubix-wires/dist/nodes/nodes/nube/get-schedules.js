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
const time_utils_1 = require("../../utils/time-utils");
const axios_1 = require("axios");
const system_utils_1 = require("../system/system-utils");
const config_1 = require("../../../config");
const btoa = require('btoa');
class GetSchedulesNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Get-Schedules';
        this.description =
            "This node is used to fetch schedules from the Nube dashboard.  The ‘Get-Schedules’ node will output all schedules from the device; Specific schedule selection is done on the ‘Schedule-Checker’ node.  ‘Interval’ (set from settings) is how often the node will re-check for schedule changes (minimum 10 seconds).  In order for the ‘get-schedules’ node to work, there must be a `system/platform’ node in the main container (default editor pane) and there must be a ‘deviceID’ in the ‘system/platform’ node settings, It is recommended that the API-Schedule node is used in conjunction with a filter/prevent-null node to maintain the last successful schedule read in the case that the API-Login node becomes disconnected. 'interval’ units can be configured from settings.  Maximum ‘interval’ setting is 587 hours.";
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, true, 'Enable');
        this.addOutput('data', node_1.Type.JSON);
        this.addOutput('error', node_1.Type.BOOLEAN);
        this.settings['interval'] = {
            description: 'Update Interval (min 10 seconds)',
            type: node_1.SettingType.NUMBER,
            value: 60,
        };
        this.settings['time'] = {
            description: 'Units',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: time_utils_1.TIME_TYPE.SECONDS, text: 'Seconds' },
                    { value: time_utils_1.TIME_TYPE.MINUTES, text: 'Minutes' },
                    { value: time_utils_1.TIME_TYPE.HOURS, text: 'Hours' },
                ],
            },
            value: time_utils_1.TIME_TYPE.SECONDS,
        };
        this.setSettingsConfig({
            groups: [{ interval: { weight: 2 }, time: {} }],
        });
    }
    onAdded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.properties['scheduleData'])
                this.setOutputData(0, this.properties['scheduleData']);
            yield this.onAfterSettingsChange();
        });
    }
    onAfterSettingsChange() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setExecuteInterval();
            yield this.onInputUpdated();
        });
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getDittoSchedules();
        });
    }
    onExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getDittoSchedules();
        });
    }
    getDittoSchedules() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server || !this.getInputData(0))
                return;
            try {
                const deviceIdFromPlat = yield system_utils_1.default.getDeviceID(this);
                const { username, password } = config_1.default.ditto;
                const dittoUrl = config_1.default.ditto.baseURL;
                const response = yield axios_1.default({
                    method: 'get',
                    url: dittoUrl + deviceIdFromPlat + '/features/schedules/properties',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
                    },
                });
                this.setOutputData(0, response.data);
                this.setOutputData(1, false);
                this.properties['scheduleData'] = response.data;
                this.persistProperties(false, true);
            }
            catch (error) {
                this.setOutputData(0, null);
                this.setOutputData(1, error);
                this.debugErr(error);
                return;
            }
        });
    }
    setExecuteInterval() {
        let interval = this.settings['interval'].value;
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        interval = Math.max(interval, 10000);
        this.EXECUTE_INTERVAL = interval;
    }
}
container_1.Container.registerNodeType('nube/get-schedules', GetSchedulesNode);
//# sourceMappingURL=get-schedules.js.map