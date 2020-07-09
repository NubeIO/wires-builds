"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const schedule_utils_1 = require("./schedule-utils");
describe('Schedule', () => {
    const schedule = {
        weekly: {
            '5351f4eb-9947-4963-add2-2196cf469629': {
                color: '',
                start: '19:00',
                name: 'Training',
                days: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                end: '10:00',
                value: 11,
            },
            '6351f4eb-9947-4963-add2-2196cf469629': {
                color: '',
                start: '15:00',
                name: 'Training',
                days: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                end: '16:00',
                value: 11,
            },
        },
        events: {
            'b6ad7b78-8258-41ed-bd31-94e873508222': {
                color: '',
                name: 'Training',
                dates: [{ start: '2020-01-20T15:00:00.000Z', end: '2020-01-21T07:00:00.000Z' }],
                value: 11,
            },
            'c6ad7b78-8258-41ed-0000-94e873508222': {
                color: '',
                name: 'Training2',
                dates: [
                    { start: '2020-01-25T15:00:00.000Z', end: '2020-01-26T07:00:00.000Z' },
                    { start: '2020-01-20T15:00:00.000Z', end: '2020-01-21T07:00:00.000Z' },
                ],
                value: 11,
            },
        },
    };
    describe('Event Schedule', () => {
        it('test case with date inside', () => {
            const output = schedule_utils_1.ScheduleUtils.checkEventsSchedule(schedule.events['b6ad7b78-8258-41ed-bd31-94e873508222'], moment('2020-01-20T16:00:00.000Z'));
            expect(output.scheduleStatus).toBe(true);
        });
        it('test case with date outside', () => {
            const output = schedule_utils_1.ScheduleUtils.checkEventsSchedule(schedule.events['b6ad7b78-8258-41ed-bd31-94e873508222'], moment('2020-01-21T07:00:00.000Z'));
            expect(output.scheduleStatus).toBe(false);
        });
        it('test case with multiple dates and date inside', () => {
            const output = schedule_utils_1.ScheduleUtils.checkEventsSchedule(schedule.events['c6ad7b78-8258-41ed-0000-94e873508222'], moment('2020-01-20T15:00:00.001Z'));
            expect(output.scheduleStatus).toBe(true);
        });
        it('test case with null event', () => {
            const output = schedule_utils_1.ScheduleUtils.checkEventsSchedule(null, moment('2020-01-21T07:00:00.000Z'));
            expect(output.scheduleStatus).toBe(false);
        });
    });
    describe('Weekly Schedule', () => {
        it('test case with date inside', () => {
            const output = schedule_utils_1.ScheduleUtils.checkWeeklySchedule(schedule.weekly['5351f4eb-9947-4963-add2-2196cf469629'], moment('2020-01-25T09:00:00.000Z'));
            expect(output.scheduleStatus).toBe(true);
        });
        it('test case with date outside', () => {
            const output = schedule_utils_1.ScheduleUtils.checkWeeklySchedule(schedule.weekly['5351f4eb-9947-4963-add2-2196cf469629'], moment('2020-01-21T19:00:00.000Z'));
            expect(output.scheduleStatus).toBe(false);
        });
        it('test case with null event', () => {
            const output = schedule_utils_1.ScheduleUtils.checkWeeklySchedule(null, moment('2020-01-21T07:00:00.000Z'));
            expect(output.scheduleStatus).toBe(false);
        });
    });
    describe('Weekly Schedule2', () => {
        it('test case with date inside', () => {
            const output = schedule_utils_1.ScheduleUtils.checkWeeklySchedule(schedule.weekly['6351f4eb-9947-4963-add2-2196cf469629'], moment('2020-01-25T15:10:00.000Z'));
            expect(output.scheduleStatus).toBe(true);
        });
        it('test case with date outside', () => {
            const output = schedule_utils_1.ScheduleUtils.checkWeeklySchedule(schedule.weekly['6351f4eb-9947-4963-add2-2196cf469629'], moment('2020-01-21T16:00:00.000Z'));
            expect(output.scheduleStatus).toBe(false);
        });
    });
});
//# sourceMappingURL=schedule-utils.test.js.map