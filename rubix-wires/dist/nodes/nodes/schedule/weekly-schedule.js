"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const uuid_utils_1 = require("../../utils/uuid-utils");
const moment = require("moment-timezone");
class WeeklyScheduleNode extends node_1.Node {
    constructor() {
        super();
        this.daysArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        this.title = 'Weekly Schedule';
        this.description = 'Weekly Schedule';
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.settings['enable'] = {
            description: 'Schedule Enable',
            value: true,
            type: node_1.SettingType.BOOLEAN,
        };
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
        this.settings['startHour'] = {
            description: 'Start Time',
            value: 7,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: this.makeHoursDropdown(),
            },
        };
        this.settings['startMin'] = {
            description: '',
            value: 0,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: this.makeMinsDropdown(),
            },
        };
        this.settings['endHour'] = {
            description: 'End Time',
            value: 19,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: this.makeHoursDropdown(),
            },
        };
        this.settings['endMin'] = {
            description: '',
            value: 0,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: this.makeMinsDropdown(),
            },
        };
        this.settings['sunday'] = {
            description: 'sunday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['monday'] = {
            description: 'monday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['tuesday'] = {
            description: 'tuesday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['wednesday'] = {
            description: 'wednesday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['thursday'] = {
            description: 'thursday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['friday'] = {
            description: 'friday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['saturday'] = {
            description: 'saturday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['payload'] = {
            description: 'Schedule Payload',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.setSettingsConfig({
            groups: [
                { startHour: {}, startMin: {} },
                { endHour: {}, endMin: {} },
            ],
        });
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onAfterSettingsChange() {
        var scheduleOutput = { weekly: {}, events: {} };
        if (!this.settings['enable'].value)
            return scheduleOutput;
        const schedID = uuid_utils_1.default.createUUID();
        const tzOffset = moment.tz(this.settings['timezone'].value).utcOffset();
        const offsetHours = Math.floor(tzOffset / 60);
        const offsetMins = tzOffset % 60;
        var rolloverFlag = 0;
        var startHourUTC = this.settings['startHour'].value - offsetHours;
        if (startHourUTC < 0) {
            rolloverFlag = -1;
            startHourUTC = startHourUTC + 24;
        }
        else if (startHourUTC > 24) {
            rolloverFlag = 1;
            startHourUTC = startHourUTC - 24;
        }
        var startMinsUTC = this.settings['startMin'].value - offsetMins;
        if (startMinsUTC < 0)
            startMinsUTC = startMinsUTC + 60;
        else if (startMinsUTC >= 60)
            startMinsUTC = startMinsUTC - 60;
        var endHourUTC = this.settings['endHour'].value - offsetHours;
        if (endHourUTC < 0) {
            endHourUTC = endHourUTC + 24;
        }
        else if (endHourUTC > 24) {
            endHourUTC = endHourUTC - 24;
        }
        var endMinsUTC = this.settings['endMin'].value - offsetMins;
        if (endMinsUTC < 0)
            endMinsUTC = endMinsUTC + 60;
        else if (endMinsUTC >= 60)
            endMinsUTC = endMinsUTC - 60;
        const sundayIndex = this.settings['sunday'].value && rolloverFlag == -1 ? 7 : 0;
        const saturdayIndex = this.settings['saturday'].value && rolloverFlag == 1 ? -1 : 6;
        var daysOutput = [];
        this.settings['sunday'].value ? daysOutput.push(this.daysArray[sundayIndex + rolloverFlag]) : null;
        this.settings['monday'].value ? daysOutput.push(this.daysArray[1 + rolloverFlag]) : null;
        this.settings['tuesday'].value ? daysOutput.push(this.daysArray[2 + rolloverFlag]) : null;
        this.settings['wednesday'].value ? daysOutput.push(this.daysArray[3 + rolloverFlag]) : null;
        this.settings['thursday'].value ? daysOutput.push(this.daysArray[4 + rolloverFlag]) : null;
        this.settings['friday'].value ? daysOutput.push(this.daysArray[5 + rolloverFlag]) : null;
        this.settings['saturday'].value ? daysOutput.push(this.daysArray[saturdayIndex + rolloverFlag]) : null;
        scheduleOutput.weekly = {
            [schedID]: {
                colour: '#FFFFFF',
                name: this.settings['stringScheduleName'].value || 'unknownSchedule',
                start: `${String(startHourUTC).padStart(2, '0')}:${String(startMinsUTC).padStart(2, '0')}`,
                end: `${String(endHourUTC).padStart(2, '0')}:${String(endMinsUTC).padStart(2, '0')}`,
                days: daysOutput,
                value: this.settings['payload'].value,
                id: schedID,
            },
        };
        this.setOutputData(0, scheduleOutput);
    }
    makeHoursDropdown() {
        var hoursArray = [];
        for (var h = 0; h < 24; h++) {
            hoursArray.push({ value: h, text: String(h).padStart(2, '0') });
        }
        return hoursArray;
    }
    makeMinsDropdown() {
        var minsArray = [];
        for (var m = 0; m < 60; m++) {
            minsArray.push({ value: m, text: String(m).padStart(2, '0') });
        }
        return minsArray;
    }
}
container_1.Container.registerNodeType('schedule/weekly-schedule', WeeklyScheduleNode);
//# sourceMappingURL=weekly-schedule.js.map