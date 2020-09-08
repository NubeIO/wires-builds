"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
var Type;
(function (Type) {
    Type["STRING"] = "string";
    Type["NUMBER"] = "number";
    Type["BOOLEAN"] = "boolean";
    Type["ANY"] = "any";
    Type["JSON"] = "json";
    Type["DROPDOWN"] = "dropdown";
})(Type = exports.Type || (exports.Type = {}));
class NodeOutput {
}
exports.NodeOutput = NodeOutput;
class NodeInput {
}
exports.NodeInput = NodeInput;
exports.convertStringToType = (type) => {
    switch (type) {
        case Type.STRING:
            return Type.STRING;
        case Type.NUMBER:
            return Type.NUMBER;
        case Type.BOOLEAN:
            return Type.BOOLEAN;
        case Type.JSON:
            return Type.JSON;
    }
    return Type.ANY;
};
exports.convertType = (type) => {
    switch (type) {
        case Type.STRING:
            return node_1.SettingType.STRING;
        case Type.NUMBER:
            return node_1.SettingType.NUMBER;
        case Type.BOOLEAN:
            return node_1.SettingType.BOOLEAN;
        case Type.DROPDOWN:
            return node_1.SettingType.DROPDOWN;
    }
    return node_1.SettingType.STRING;
};
//# sourceMappingURL=node-io.js.map