"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class ToggleNode extends node_1.Node {
    constructor() {
        super();
        this.state = false;
        this.count = 0;
        this.title = 'Toggle';
        this.description =
            "When the 'input' transitions from 'false' to 'true', 'output' will switch between 'false'/'true'.   (See Figure A.)";
        this.addInput('input', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.BOOLEAN);
        this.settings['reset-on-disc'] = {
            description: 'Reset on disconnected or input is null',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.setOutputData(0, null);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        if (this.count === 0) {
            this.count = 1;
        }
        else if (this.count === 1) {
            this.count = 0;
        }
        if (input == null || input == undefined) {
            if (this.settings['reset-on-disc'].value) {
                this.lastVal = false;
                this.setOutputData(0, null, true);
                this.state = false;
            }
        }
        else if (input == this.lastVal)
            return;
        if (input == true) {
            this.setOutputData(0, !this.state, true);
            this.state = !this.state;
        }
        this.lastVal = input;
    }
}
container_1.Container.registerNodeType('boolean/toggle', ToggleNode);
//# sourceMappingURL=toggle.js.map