"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const uuid_utils_1 = require("../../utils/uuid-utils");
class UuidNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'UUID';
        this.description =
            'A node function to create a UUID identifier. A universally unique identifier (UUID) is an identifier standard used in software construction. A UUID is simply a 128-bit value. The meaning of each bit is defined by any of several variants. For human-readable display, many systems use a canonical format using hexadecimal text with inserted hyphen characters. For example : de305d54-75b4-431b-adb2-eb6b9e546014';
        this.addInput('in 1');
        this.addOutput('UUID out');
    }
    onInputUpdated() {
        let out = uuid_utils_1.default.createUUID();
        this.setOutputData(0, out);
    }
}
container_1.Container.registerNodeType('custom-function/uuid', UuidNode);
//# sourceMappingURL=uuid.js.map