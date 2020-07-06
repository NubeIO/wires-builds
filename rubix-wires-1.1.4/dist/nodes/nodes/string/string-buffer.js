"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class StringBufferNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'String Buffer';
        this.description = '';
        this.addInput('input', node_1.Type.STRING);
        this.addInput('sendBuffer', node_1.Type.BOOLEAN);
        this.addInput('clearBuffer', node_1.Type.BOOLEAN);
        this.addInput('addToBuffer', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.STRING);
        this.addOutput('currentBuffer', node_1.Type.STRING);
        this.settings['useTrigger'] = {
            description: 'Select a Buffer Input Method',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: true, text: 'Add Input to Buffer When Triggered' },
                    { value: false, text: 'Collect all Input Messages (no Trigger)' },
                ],
            },
            value: true,
        };
        this.useTrigger = true;
        this.bufferData = '';
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        if (this.getInputData(1) && this.inputs[1].updated) {
            this.setOutputData(0, this.bufferData);
            this.bufferData = '';
        }
        if (this.getInputData(2) && this.inputs[2].updated)
            this.bufferData = '';
        if ((!this.useTrigger && this.inputs[0].updated) ||
            (this.useTrigger && this.getInputData(3) && this.inputs[3].updated)) {
            const input = this.getInputData(0);
            if (input == null)
                return;
            this.bufferData += String(input);
        }
        this.setOutputData(1, this.bufferData);
    }
    onAfterSettingsChange() {
        const triggerInput = this.settings['useTrigger'].value;
        if (triggerInput !== this.useTrigger) {
            if (triggerInput)
                this.addInput('addToBuffer', node_1.Type.BOOLEAN);
            else
                this.removeInput(3);
        }
        this.useTrigger = triggerInput;
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('string/string-buffer', StringBufferNode);
//# sourceMappingURL=string-buffer.js.map