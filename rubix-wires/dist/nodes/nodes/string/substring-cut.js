"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class TextCutSubstringNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Substring Cut';
        this.description =
            "This node outputs a portion of a String 'input' defined by the Numeric 'start' and 'length' parameters.  String 'output' is the portion of 'input' starting at index (position) 'start' and continating the next 'length' value of characters.  'start' value of 0 is the beggining of the string.  If a negative 'start' value is given, the substring will be selected from the end of the 'input' string (eg. -1 is the end of the 'input'; -2 is the second to last character of the 'input', ...).";
        this.addInput('input', node_io_1.Type.STRING);
        this.addInputWithSettings('start', node_io_1.Type.NUMBER, 0, 'Start', false);
        this.addInputWithSettings('length', node_io_1.Type.NUMBER, 1, 'Length', false);
        this.addOutput('output', node_io_1.Type.STRING);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const text = this.getInputData(0);
        const start = this.getInputData(1);
        const length = this.getInputData(2);
        if (text != null && start != null && length != null) {
            this.setOutputData(0, text.substr(start, length));
        }
        else
            this.setOutputData(0, null);
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('string/cut-substring', TextCutSubstringNode);
//# sourceMappingURL=substring-cut.js.map