"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('@hapi/joi');
class NodeValidator {
    static NodeArrayValidator() {
        return Joi.array().items(Joi.object().keys({
            type: Joi.string().required(),
        }));
    }
}
exports.default = NodeValidator;
//# sourceMappingURL=node-validator.js.map