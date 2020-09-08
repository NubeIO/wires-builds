"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
class StringConstantNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'String Constant';
        this.description =
            'Outputs a String value set from settings. Can also output null by leaving the settings field blank.';
        this.settings['value'] = { description: 'Value', value: '', type: node_1.SettingType.STRING };
        this.addOutput('output', node_io_1.Type.STRING);
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onAfterSettingsChange() {
        const val = this.settings['value'].value;
        this.setOutputData(0, utils_1.default.parseValue(val, node_io_1.Type.STRING));
    }
}
container_1.Container.registerNodeType('point/string-constant', StringConstantNode);
//# sourceMappingURL=string-constant.js.map