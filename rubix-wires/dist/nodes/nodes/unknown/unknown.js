"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
class UnknownNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Unknown';
        this.description = 'Fallback node, this node need to be replace by another node';
    }
}
exports.UnknownNode = UnknownNode;
//# sourceMappingURL=unknown.js.map