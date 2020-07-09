"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class TextCharAtIndexNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Char at Index';
        this.description =
            "'output' is the character at the Numeric 'index' (position) of String 'input'.  The first character of the String 'input' is 'index' 0. If 'index' is negative, characters will be selected from the end of the 'input' string (eg. -1 is the last character; -2 is the second to last character). 'output' will be 'null' on an invalid 'index'.";
        this.addInput('input', node_1.Type.STRING);
        this.addInputWithSettings('index', node_1.Type.NUMBER, 0, 'Index', false);
        this.addOutput('output', node_1.Type.STRING);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const text = this.getInputData(0);
        const index = this.getInputData(1);
        if (text != null && index != null) {
            if (index === -1)
                this.setOutputData(0, text.slice(-1));
            else
                this.setOutputData(0, text.slice(index, index + 1));
        }
        else
            this.setOutputData(0, null);
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('string/char-at-index', TextCharAtIndexNode);
//# sourceMappingURL=char-at-index.js.map