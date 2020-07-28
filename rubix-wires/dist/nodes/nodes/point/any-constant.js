"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
class AnyConstantNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Any Constant';
        this.description = 'Any Constant value';
        this.settings['value'] = { description: 'Value', value: '', type: node_1.SettingType.STRING };
        this.settings['output-type'] = {
            description: 'Output type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: node_1.Type.STRING, text: node_1.Type.STRING },
                    { value: node_1.Type.NUMBER, text: node_1.Type.NUMBER },
                    { value: node_1.Type.BOOLEAN, text: node_1.Type.BOOLEAN },
                ],
            },
            value: node_1.Type.STRING,
        };
        this.addOutput('out', node_1.Type.ANY);
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onAfterSettingsChange() {
        const val = this.settings['value'].value;
        let outType = this.settings['output-type'].value;
        const out = utils_1.default.parseValue(val, outType);
        this.settings['value'].value = out;
        this.setOutputData(0, out);
        this.updateTitle();
    }
    updateTitle() {
        this.title = `Any Constant (${this.settings['output-type'].value})`;
        this.size = this.computeSize();
    }
}
container_1.Container.registerNodeType('point/any-constant', AnyConstantNode);
//# sourceMappingURL=any-constant.js.map