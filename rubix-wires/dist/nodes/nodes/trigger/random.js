"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
class RandomNode extends node_1.Node {
    constructor() {
        super();
        this.state = false;
        this.title = 'Random';
        this.description =
            "When 'trigger' transitions from 'false' to 'true', a random number between 'min' and 'max' values is produced at 'output'.  The number of decimal places that 'output' values have can be set from settings.";
        this.settings['digits'] = {
            description: 'Number of decimal places',
            value: 3,
            type: node_1.SettingType.NUMBER,
        };
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addInputWithSettings('max', node_io_1.Type.NUMBER, 1, 'Maximum Value');
        this.addInputWithSettings('min', node_io_1.Type.NUMBER, 0, 'Minimum Value');
        this.addOutput('output', node_io_1.Type.NUMBER);
        this.setOutputData(0, null);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let trigger = this.getInputData(0);
        if (trigger == null) {
            this.lastVal = false;
            this.setOutputData(0, null, true);
            this.state = false;
        }
        else if (trigger == this.lastVal)
            return;
        if (trigger == true) {
            const max = this.getInputData(1);
            const min = this.getInputData(2);
            this.settings['digits'].value;
            let digits = this.settings['digits'].value;
            let result = Math.random() * (max - min) + min;
            result = utils_1.default.toFixedNumber(result, digits);
            this.setOutputData(0, result);
        }
        this.lastVal = trigger;
    }
}
container_1.Container.registerNodeType('trigger/random', RandomNode);
//# sourceMappingURL=random.js.map