"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class GateNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Message Gate';
        this.description =
            "This node can allow(gate open) or block(gate close) the transfer of the 'input' to 'output'.  When 'open' is 'true', 'input' is passed to 'output'.  When 'open' is 'false', 'output' will maintain its last value.  If 'Send null when closed' setting is ticked, 'output' will be 'null' when 'open' is 'false'. ";
        this.addInput('input', node_1.Type.STRING);
        this.addInput('open', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.STRING);
        this.settings['send-null'] = {
            description: 'Send null when closed',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    onInputUpdated() {
        let key = this.getInputData(1);
        if (key)
            this.setOutputData(0, this.getInputData(0));
        else if (this.settings['send-null'].value && this.outputs[0].data != null)
            this.setOutputData(0, null);
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('streams/gate', GateNode);
//# sourceMappingURL=gate.js.map