"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('@hapi/joi');
class SettingsValidator {
    static Validator() {
        return Joi.object().keys({
            name: Joi.string()
                .allow('')
                .optional(),
            settings: Joi.object()
                .keys({
                '': Joi.object().optional(),
            })
                .pattern(/^/, Joi.object().keys({
                type: Joi.string().required(),
                description: Joi.string()
                    .allow('')
                    .required(),
                value: Joi.alternatives(Joi.string().allow(''), Joi.object(), Joi.boolean(), Joi.number())
                    .allow(null)
                    .required(),
            }))
                .required(),
        });
    }
}
exports.default = SettingsValidator;
//# sourceMappingURL=settings-validator.js.map