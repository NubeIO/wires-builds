"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const base_schedule_1 = require("./base-schedule");
const schedule_1 = require("../../../database/models/schedule");
const Joi = require('@hapi/joi');
class EventScheduleNode extends base_schedule_1.default {
    constructor() {
        super();
        this.title = 'Event Schedule Node';
        this.description = 'Event Schedule Node';
    }
    validator() {
        return Joi.object({
            name: Joi.alternatives()
                .try(Joi.string(), Joi.number())
                .required(),
            value: Joi.any().required(),
            color: Joi.string().allow(''),
            dates: Joi.array().items(Joi.object().keys({
                start: Joi.string().required(),
                end: Joi.string().required(),
            })),
            id: Joi.string(),
        });
    }
    scheduleType() {
        return schedule_1.ScheduleType.Event;
    }
}
container_1.Container.registerNodeType('schedule/event-schedule', EventScheduleNode);
//# sourceMappingURL=event-schedule.js.map