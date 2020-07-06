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
const moment = require("moment-timezone");
const node_1 = require("../../node");
const container_1 = require("../../container");
const schedule_utils_1 = require("./schedule-utils");
const time_utils_1 = require("../../utils/time-utils");
class ScheduleChecker extends node_1.Node {
    constructor() {
        super();
        this.title = 'Schedule Checker (unconfigured)';
        this.description =
            'This node checks the API-Schedule output string for active schedules that match the selected ‘Schedule Name’ setting.  ‘output’ will be ‘true’ when the matching schedule is active and ‘enable’ is ‘true’; otherwise ‘output’ will be ‘false’.  ‘nextStart’ is the timestamp output of the next scheduled start time.  ‘nextStop’ is the timestamp output of the next scheduled stop time.  ‘lastCheck’ is the timestamp output of the last time a schedule check was run.  ‘error’ output will be ‘true’ if there is an error while checking the schedule input string; otherwise ‘error’ will be false.  The frequency that schedules are checked can be modified with the ‘Schedule Check Interval’ setting (set in millis).  The ‘Timestamp Output Format’ setting can be adjusted to output timestamps as strings or as Epoch Timestamps.  String timestamps will be displayed in the timezone specified by the ‘Timezone’ setting.';
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, true, 'Enable', false);
        this.addInput('schedules', node_1.Type.JSON);
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.addOutput('payload', node_1.Type.BOOLEAN);
        this.addOutput('nextStart', node_1.Type.STRING);
        this.addOutput('nextStop', node_1.Type.STRING);
        this.addOutput('lastCheck', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
        this.settings['stringScheduleName'] = {
            description: 'Schedule Name',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['timezone'] = {
            description: 'TIMEZONE: Enter the timezone',
            value: moment.tz.guess(),
            type: node_1.SettingType.STRING,
        };
        this.settings['interval'] = {
            description: 'Schedule Check Interval (minimum 10 seconds)',
            value: 30,
            type: node_1.SettingType.NUMBER,
        };
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
        this.settings['numericTimeFormat'] = {
            description: 'Timestamp Output Format',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: false, text: 'Timestamps as Strings' },
                    { value: true, text: 'Timestamps as Epoch Numerics' },
                ],
            },
            value: false,
        };
        this.nextStart = null;
        this.nextStop = null;
        this.schedulePayload = null;
        this.EXECUTE_INTERVAL = 10000;
    }
    onAdded() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateTitle();
            yield this.onInputUpdated();
        });
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            let input = this.getInputData(1) || { weekly: {}, events: {} };
            yield this.setOutput(input);
        });
    }
    onExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setOutput();
        });
    }
    updateTitle() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.settings['stringScheduleName'].value != null &&
                this.settings['stringScheduleName'].value != '') {
                this.title = `Schedule Checker (${this.settings['stringScheduleName'].value})`;
            }
            else
                this.title = 'Schedule Checker (unconfigured)';
            this.broadcastTitleToClients();
        });
    }
    onAfterSettingsChange() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateTitle();
            let interval = this.settings['interval'].value;
            interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
            this.EXECUTE_INTERVAL = Math.max(interval, 10000);
            yield this.onInputUpdated();
        });
    }
    setOutput(input = null) {
        return __awaiter(this, void 0, void 0, function* () {
            this.nextStart = null;
            this.nextStop = null;
            this.schedulePayload = null;
            if (!input)
                input = this.getInputData(1) || { weekly: {}, events: {} };
            const key = this.settings['stringScheduleName'].value;
            if (key == null || key === '') {
                this.setOutputData(0, false, true);
                this.setOutputData(1, null, true);
                this.setOutputData(2, null, true);
                this.setOutputData(3, null, true);
                this.setOutputData(4, moment(this.executeLastTime).format('YYYY-MM-DDTHH:MM:ss'), true);
                this.setOutputData(5, 'Schedule Checker Error: invalid schedule selected', true);
                return;
            }
            let timeZone = this.settings['timezone'].value;
            if (!moment.tz.zone(timeZone)) {
                timeZone = moment.tz.guess();
            }
            const now = moment.tz(timeZone);
            const isEnabled = this.getInputData(0);
            if (input && key && isEnabled) {
                let weeklyOutput = false;
                let weeklyScheduleOutput = null;
                for (var sched in input['weekly']) {
                    if (input['weekly'][sched]['name'] === key) {
                        weeklyScheduleOutput = schedule_utils_1.ScheduleUtils.checkWeeklySchedule(input['weekly'][sched], now);
                        weeklyOutput = weeklyScheduleOutput.scheduleStatus || weeklyOutput;
                        this.schedulePayload = weeklyScheduleOutput.value || this.schedulePayload;
                        if (this.nextStop == null || weeklyScheduleOutput.nextStop.isBefore(this.nextStop)) {
                            this.nextStop = weeklyScheduleOutput.nextStop;
                        }
                        if (this.nextStart == null || weeklyScheduleOutput.nextStart.isBefore(this.nextStart)) {
                            this.nextStart = weeklyScheduleOutput.nextStart;
                        }
                    }
                }
                let eventsOutput = false;
                let eventScheduleOutput = null;
                for (var sched in input['events']) {
                    if (input['events'][sched]['name'] === key) {
                        eventScheduleOutput = schedule_utils_1.ScheduleUtils.checkEventsSchedule(input['events'][sched], now);
                        eventsOutput = eventScheduleOutput.scheduleStatus || eventsOutput;
                        this.schedulePayload = eventScheduleOutput.value || this.schedulePayload;
                        if (eventScheduleOutput.nextStop != null) {
                            if (eventScheduleOutput.nextStop.isBefore(this.nextStop) || this.nextStop == null)
                                this.nextStop = eventScheduleOutput.nextStop;
                        }
                        if (eventScheduleOutput.nextStart != null) {
                            if (eventScheduleOutput.nextStart.isBefore(this.nextStart) || this.nextStart == null)
                                this.nextStart = eventScheduleOutput.nextStart;
                        }
                    }
                }
                const output = weeklyOutput || eventsOutput;
                this.setOutputData(0, output, true);
                this.setOutputData(1, this.schedulePayload, true);
                if (this.nextStart != null) {
                    if (!this.settings['numericTimeFormat'].value)
                        this.setOutputData(2, this.nextStart.tz(timeZone).format(), true);
                    else
                        this.setOutputData(2, this.nextStart.valueOf(), true);
                }
                else
                    this.setOutputData(2, null, true);
                if (this.nextStop != null) {
                    if (!this.settings['numericTimeFormat'].value)
                        this.setOutputData(3, this.nextStop.tz(timeZone).format(), true);
                    else
                        this.setOutputData(3, this.nextStop.valueOf(), true);
                }
                else
                    this.setOutputData(3, null, true);
            }
            else {
                this.setOutputData(0, false, true);
                this.setOutputData(1, null, true);
                this.setOutputData(2, null, true);
                this.setOutputData(3, null, true);
            }
            if (!this.settings['numericTimeFormat'].value) {
                this.setOutputData(4, moment(this.executeLastTime)
                    .tz(timeZone)
                    .format(), true);
            }
            else
                this.setOutputData(4, moment(this.executeLastTime).valueOf(), true);
            this.setOutputData(5, false, true);
        });
    }
}
exports.ScheduleChecker = ScheduleChecker;
container_1.Container.registerNodeType('schedule/schedule-checker', ScheduleChecker);
//# sourceMappingURL=schedule-checker.js.map