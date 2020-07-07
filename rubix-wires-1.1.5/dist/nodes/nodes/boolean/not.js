"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_icons_1 = require("../../node-icons");
let logicMainColour = node_icons_1.default.logicMainColour;
let logicNotIcon = node_icons_1.default.logicNotIcon;
class NotNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'NOT';
        this.description =
            "Performs a logical 'NOT' operation (output will be the inverse of the input).";
        this.addInput('input', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.BOOLEAN);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        this.emitTransformedInput(x => !x);
    }
}
container_1.Container.registerNodeType('boolean/not', NotNode);
//# sourceMappingURL=not.js.map