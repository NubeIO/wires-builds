"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class StringIndexOfNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'String Index Of';
        this.description =
            "This node takes String 'input' and 'searchFor'; Numeric 'output' is the index(position) of the first instance of 'searchFor' in 'input'.  Index of 0 is the begginning of the 'input' string. ";
        this.addInputWithSettings('input', node_1.Type.STRING, '', 'Input Value', false);
        this.addInputWithSettings('searchFor', node_1.Type.STRING, '', 'Search For Value', false);
        this.addOutput('startIndex', node_1.Type.NUMBER);
        this.addOutput('endIndex', node_1.Type.NUMBER);
        this.setOutputData(0, null);
        this.setOutputData(1, null);
        this.settings['input'] = {
            description: 'string1 Value',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['searchFor'] = {
            description: 'Search For Value',
            value: '',
            type: node_1.SettingType.STRING,
        };
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const input = this.getInputData(0);
        const searchFor = this.getInputData(1);
        const index = input.indexOf(searchFor);
        const length = searchFor.length;
        if (index < 0) {
            this.setOutputData(0, null, true);
            this.setOutputData(1, null, true);
        }
        else {
            this.setOutputData(0, index, true);
            this.setOutputData(1, index + length, true);
        }
    }
    onAfterSettingsChange() {
        if (this.side !== container_1.Side.server)
            return;
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('string/string-index-of', StringIndexOfNode);
//# sourceMappingURL=string-index-of.js.map