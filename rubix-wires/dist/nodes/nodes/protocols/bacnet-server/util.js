const bacnet = require('node-bacnet');
class Util {
    static getEnumName(group, value) {
        return Object.keys(group).find(key => group[key] === value) + '(' + value + ')';
    }
    static getPropName(propertyId) {
        return Util.getEnumName(bacnet.enum.PropertyIdentifier, propertyId);
    }
}
module.exports = Util;
//# sourceMappingURL=util.js.map