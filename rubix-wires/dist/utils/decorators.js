"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
const logger = require('logplease').create('reliability', { color: 1 });
function logError(error, ...args) {
    logger.error(error);
    if (typeof alert !== 'undefined') {
        alert(error.toString());
    }
}
exports.ErrorHandler = (target, propertyKey, descriptor) => {
    const fn = descriptor.value;
    descriptor.value = function DescriptorValue(...args) {
        try {
            return fn.apply(this, args);
        }
        catch (error) {
            logError(error, args);
        }
    };
    return descriptor;
};
exports.ErrorCallbackHandler = (errHandler) => {
    return (target, propertyKey, descriptor) => {
        const fn = descriptor.value;
        descriptor.value = function DescriptorValue(...args) {
            try {
                return fn.apply(this, args);
            }
            catch (error) {
                if (helper_1.isFunction(errHandler)) {
                    errHandler(error, args);
                }
                else {
                    logError(error, args);
                }
            }
        };
        return descriptor;
    };
};
exports.AsyncErrorHandler = {};
//# sourceMappingURL=decorators.js.map