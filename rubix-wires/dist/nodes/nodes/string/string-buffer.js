"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class StringBufferNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'String Buffer';
        this.description = '';
        this.addInput('input', node_io_1.Type.STRING);
        this.addInput('sendBuffer', node_io_1.Type.BOOLEAN);
        this.addInput('clearBuffer', node_io_1.Type.BOOLEAN);
        this.addInput('addToBuffer', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.STRING);
        this.addOutput('currentBuffer', node_io_1.Type.STRING);
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
    onCreated() {
        this.lastSend = false;
        this.lastClear = false;
        this.lastAdd = false;
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const send = this.getInputData(1) || false;
        const clear = this.getInputData(2) || false;
        let addTrigger = false;
        if (this.useTrigger)
            addTrigger = this.getInputData(3) || false;
        if (this.inputs[1].updated && send && !this.lastSend) {
            this.setOutputData(0, this.bufferData);
            this.bufferData = '';
        }
        this.lastSend = send;
        if (this.inputs[2].updated && clear && !this.lastClear)
            this.bufferData = '';
        this.lastClear = clear;
        if ((!this.useTrigger && this.inputs[0].updated) ||
            (this.useTrigger && this.inputs[3].updated && addTrigger && !this.lastAdd)) {
            const input = this.getInputData(0);
            if (input == null)
                return;
            this.bufferData += String(input);
        }
        this.lastAdd = addTrigger;
        this.setOutputData(1, this.bufferData);
    }
    onAfterSettingsChange() {
        const triggerInput = this.settings['useTrigger'].value;
        if (triggerInput !== this.useTrigger) {
            if (triggerInput)
                this.addInput('addToBuffer', node_io_1.Type.BOOLEAN);
            else
                this.removeInput(3);
        }
        this.useTrigger = triggerInput;
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('string/string-buffer', StringBufferNode);
//# sourceMappingURL=string-buffer.js.map