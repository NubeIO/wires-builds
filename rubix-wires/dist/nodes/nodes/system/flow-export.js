"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class FlowExport extends node_1.Node {
    constructor() {
        super();
        this.title = 'Flow Export';
        this.description =
            'A node to export the wires flow to JSON when trigger values gets changed to true from different state';
        this.addOutput('output', node_1.Type.STRING);
        this.addInput('trigger', node_1.Type.BOOLEAN);
    }
    init() {
        if (!this.properties) {
            this.properties['lastTrigger'] = false;
        }
    }
    onInputUpdated() {
        if (this.side != container_1.Side.server)
            return;
        const input = this.getInputData(0);
        if (this.properties['lastTrigger'] !== input && input) {
            const container = container_1.Container.containers[0];
            container.db.getNodes((err, docs) => {
                if (!err) {
                    this.setOutputData(0, JSON.stringify(docs));
                }
                else {
                    this.debugErr(` Node id [ ${this.cid}/${this.id} ] has error: ${err.message}.`);
                }
            });
        }
        this.properties['lastTrigger'] = input;
        this.persistProperties(false, true);
    }
}
container_1.Container.registerNodeType('system/flow-export', FlowExport);
//# sourceMappingURL=flow-export.js.map