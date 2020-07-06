"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const base_schedule_1 = require("./base-schedule");
const schedule_1 = require("../../../database/models/schedule");
const Joi = require('@hapi/joi');
class WeeklyScheduleNode extends base_schedule_1.default {
    constructor() {
        super();
        this.title = 'Weekly Schedule Node';
        this.description = 'Weekly Schedule Node';
    }
    validator() {
        return Joi.object({
            name: Joi.alternatives()
                .try(Joi.string(), Joi.number())
                .required(),
            value: Joi.any().required(),
            color: Joi.string().allow(''),
            days: Joi.array()
                .items(Joi.valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'))
                .required(),
            start: Joi.string().required(),
            end: Joi.string().required(),
            id: Joi.string(),
        });
    }
    scheduleType() {
        return schedule_1.ScheduleType.Weekly;
    }
}
container_1.Container.registerNodeType('schedule/weekly-schedule', WeeklyScheduleNode);
//# sourceMappingURL=weekly-schedule.js.map