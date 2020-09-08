"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class TextSplitStringsNode extends node_1.Node {
    constructor() {
        super();
        this.currentIndex = 0;
        this.title = 'String Split';
        this.description =
            "Portions of the String 'input' are sent to the String 'output' sequentially when 'next' trasitions from 'false' to 'true'; these 'output' strings are portions of the 'input' string split by the String 'separator' value.  The Numeric 'left' outputs the number of 'output' strings remaining to be sent.  When 'start' transitions from 'false' to 'true', the 'output' string will go back to the first portion of the 'input' string. ";
        this.addInput('input', node_io_1.Type.STRING);
        this.addInputWithSettings('separator', node_io_1.Type.STRING, '', 'Separator Value', false);
        this.addInput('start', node_io_1.Type.BOOLEAN);
        this.addInput('next', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.STRING);
        this.addOutput('left', node_io_1.Type.NUMBER);
        this.setOutputData(0, null);
        this.setOutputData(1, 0);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        if (this.inputs[2].updated && this.inputs[2].data) {
            this.currentIndex = 0;
            this.splitNext();
        }
        if (this.inputs[3].updated && this.inputs[3].data)
            this.splitNext();
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
    splitNext() {
        const text = this.getInputData(0);
        const separator = this.getInputData(1);
        if (text == null || separator == null)
            return;
        const splittedText = text.split(separator);
        if (this.currentIndex >= splittedText.length)
            return;
        this.setOutputData(0, splittedText[this.currentIndex]);
        this.setOutputData(1, splittedText.length - this.currentIndex - 1);
        this.currentIndex++;
    }
}
container_1.Container.registerNodeType('string/string-split', TextSplitStringsNode);
//# sourceMappingURL=string-split.js.map