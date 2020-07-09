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
const time_utils_1 = require("../../utils/time-utils");
const node_utils_1 = require("../../utils/node-utils");
const axios_1 = require("axios");
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
    onCreated() {
        this.EXECUTE_INTERVAL = 60000;
        this.enable = true;
    }
    onAdded() {
        if (this.properties['scheduleData'])
            this.setOutputData(0, this.properties['scheduleData']);
        this.onAfterSettingsChange();
    }
    onAfterSettingsChange() {
        if (this.side == container_1.Side.server) {
            this.setExecuteInterval();
            this.onInputUpdated();
        }
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            if (!this.getInputData(0))
                this.enable = false;
            else {
                this.enable = true;
                yield this.getDittoSchedules(this);
            }
        });
    }
    onExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server || !this.enable)
                return;
            yield this.getDittoSchedules(this);
        });
    }
    getDittoSchedules(self) {
        return __awaiter(this, void 0, void 0, function* () {
            var errorFlag = false;
            const deviceIDfromPlat = yield self.getDeviceID();
            let foundDeviceID = false;
            typeof deviceIDfromPlat == 'string' ? (foundDeviceID = true) : null;
            axios_1.default({
                method: 'get',
                url: 'https://ditto1.nube-iot.com/api/2/things/com.nubeio:' + deviceIDfromPlat + '/features/schedules/properties',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic bnViZS1kaXR0bzpVeVJadjh6UG9P',
                },
            })
                .then(function (response) {
                self.setOutputData(0, response.data);
                self.setOutputData(1, false);
                self.properties['scheduleData'] = response.data;
                node_utils_1.default.persistProperties(this, true, true);
            })
                .catch(function (error) {
                self.setOutputData(1, String(error));
                errorFlag = true;
            });
            if (!errorFlag) {
            }
        });
    }
    getDeviceID() {
        return new Promise((resolve, reject) => {
            try {
                history_config_1.default.findMainContainer(this).db.getNodeType('system/platform', (err, docs) => {
                    if (!err) {
                        let output = [];
                        output.push(docs);
                        if (output[0] && output[0][0] && output[0][0].properties) {
                            resolve(output[0][0].properties['deviceID'].trim());
                            return output[0][0].properties['deviceID'].trim();
                        }
                        else {
                        }
                        resolve(output);
                        return output;
                    }
                    else {
                        console.log(err);
                        reject(err);
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findMainContainer() {
        if (this.hasOwnProperty('container'))
            return history_config_1.default.findMainContainer(this.container);
        else
            return this;
    }
    setExecuteInterval() {
        let interval = this.settings['interval'].value;
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        interval = Math.min(interval, 10000);
        this.EXECUTE_INTERVAL = interval;
    }
}
container_1.Container.registerNodeType('nube/get-schedules', GetSchedulesNode);
//# sourceMappingURL=get-schedules.js.map