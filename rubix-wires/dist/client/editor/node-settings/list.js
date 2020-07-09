"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SettingString_1 = require("./SettingString");
const SettingNumber_1 = require("./SettingNumber");
const SettingBoolean_1 = require("./SettingBoolean");
const SettingDropdown_1 = require("./SettingDropdown");
const PasswordString_1 = require("./PasswordString");
const SettingCodeArea_1 = require("./SettingCodeArea");
const SettingReadOnly_1 = require("./SettingReadOnly");
const SettingTreeSelect_1 = require("./SettingTreeSelect");
const node_1 = require("../../../nodes/node");
exports.default = {
    [node_1.SettingType.STRING]: SettingString_1.default,
    [node_1.SettingType.NUMBER]: SettingNumber_1.default,
    [node_1.SettingType.BOOLEAN]: SettingBoolean_1.default,
    [node_1.SettingType.PASSWORD]: PasswordString_1.default,
    [node_1.SettingType.DROPDOWN]: SettingDropdown_1.default,
    [node_1.SettingType.CODE_AREA]: SettingCodeArea_1.default,
    [node_1.SettingType.READONLY]: SettingReadOnly_1.default,
    [node_1.SettingType.TREE_SELECT]: SettingTreeSelect_1.default,
};
//# sourceMappingURL=list.js.map