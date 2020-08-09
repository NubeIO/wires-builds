"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class NotesNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Comments';
        this.description = 'This node is simply for adding some code comments';
    }
    onAdded() {
        this.nodeColour();
    }
    nodeColour() {
        this.setNodeState(node_1.NodeState.INFO);
    }
}
container_1.Container.registerNodeType('debug/comments', NotesNode);
//# sourceMappingURL=notes.js.map