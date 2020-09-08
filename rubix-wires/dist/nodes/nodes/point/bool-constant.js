"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class BoolConstantNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Boolean Constant';
        this.description = 'Outputs a Boolean value set from settings.  Can also output null.';
        this.settings['value'] = {
            description: 'Payload',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: false, text: 'false' },
                    { value: true, text: 'true' },
                    { value: null, text: 'null' },
                ],
            },
            value: null,
        };
        this.addOutput('output', node_io_1.Type.BOOLEAN);
    }
    onAdded() {
        if (this.side != container_1.Side.server)
            return;
        let val = this.settings['value'].value;
        this.setOutputData(0, val);
    }
    onAfterSettingsChange() {
        let val = this.settings['value'].value;
        this.setOutputData(0, val);
    }
}
container_1.Container.registerNodeType('point/bool-constant', BoolConstantNode);
//# sourceMappingURL=bool-constant.js.map