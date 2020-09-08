"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
class AnyLatchNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Any data type Latch';
        this.description =
            "The 'input' value (Input value can be any data type) is passed to 'output' when 'latch' transitions from 'false' to 'true'; The 'output' value is maintained until the next 'false' to 'true' transition.";
        this.addInput('input', node_io_1.Type.ANY);
        this.addInput('latch', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.ANY);
        this.settings['passOnly'] = {
            description: 'Only if input value is updated',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const passOnly = this.settings['passOnly'].value;
        let latch = this.getInputData(1);
        if (latch == null) {
            if (passOnly) {
                this.setOutputData(0, null, true);
            }
            else
                this.setOutputData(0, null);
            return;
        }
        if (latch == this.lastLatchValue)
            return;
        this.lastLatchValue = latch;
        if (latch == true) {
            let input = this.getInputData(0);
            if (!utils_1.default.hasInput(input)) {
                if (passOnly) {
                    this.setOutputData(0, null, true);
                }
                else
                    this.setOutputData(0, null);
                return;
            }
            if (input === '')
                input = null;
            if (passOnly) {
                this.setOutputData(0, input, true);
            }
            else
                this.setOutputData(0, input);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('latch/any-latch', AnyLatchNode);
//# sourceMappingURL=any-latch.js.map