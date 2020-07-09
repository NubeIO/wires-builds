"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class SystemBeepNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Beep';
        this.description =
            'This node plays a default system sound on the server (not in the browser) when ‘trigger’ transitions from ‘false’ to ‘true’.';
        this.addInput('trigger', node_1.Type.BOOLEAN);
        this.addOutput('error', node_1.Type.STRING);
    }
    onInputUpdated() {
        try {
            if (this.getInputData(0) == true)
                process.stderr.write('\x07');
            this.setOutputData(0, false);
        }
        catch (e) {
            this.setOutputData(0, true);
        }
    }
}
container_1.Container.registerNodeType('system/beep', SystemBeepNode);
//# sourceMappingURL=beep.js.map