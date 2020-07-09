"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RegexValidation_1 = require("./RegexValidation");
class IpAddressValidation extends RegexValidation_1.default {
    constructor() {
        super(new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/), 'Invalid ip address.');
    }
}
exports.default = IpAddressValidation;
//# sourceMappingURL=IpAddressValidation.js.map