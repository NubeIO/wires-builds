"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require('logplease').create('reliability', { color: 1 });
exports.ErrorHandler = (target, propertyKey, descriptor) => {
    const fn = descriptor.value;
    descriptor.value = function DescriptorValue(...args) {
        try {
            return fn.apply(this, args);
        }
        catch (error) {
            logger.error(error);
            if (typeof alert !== "undefined") {
                alert(error.toString());
            }
        }
    };
    return descriptor;
};
//# sourceMappingURL=decorators.js.map