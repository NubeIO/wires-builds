"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../node");
exports.isValidForValidation = (type) => {
    return (type === node_1.SettingType.STRING || type === node_1.SettingType.NUMBER || type === node_1.SettingType.PASSWORD);
};
exports.isValidSetting = (validity, visibleInputs) => {
    return Object.keys(validity)
        .filter(key => visibleInputs.indexOf(key) >= 0)
        .map(key => validity[key])
        .reduce((previousValue, currentValue) => previousValue && currentValue, true);
};
exports.getValidityFromSettings = (settings) => {
    return Object.keys(settings)
        .map(key => ({
        [key]: !exports.isValidForValidation(settings[key].type),
    }))
        .reduce((previousValue, currentValue) => (Object.assign(Object.assign({}, previousValue), currentValue)), {});
};
//# sourceMappingURL=Validation.js.map