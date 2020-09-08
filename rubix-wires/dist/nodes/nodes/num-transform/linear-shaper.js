"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
class LinearShaperNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Linear shaper';
        this.description =
            "Performs a linear interpolation of the 'input' value between configured inflection points.  The number of inflection points can be configured in settings.  The inflection points will be evenly distributed from 0-100.  Values for each inflection point can be wired in, or set from settings.  When the 'input' value is between 0 and 100 the 'output' value will be the linear interpolation of the 'input' value between the surrounding inflection point values. ";
        this.addInput('input', node_io_1.Type.NUMBER);
        this.settings['inputs'] = {
            description: 'Inflection Points Count',
            value: 3,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['in1'] = {
            description: 'output value @ input = 0',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['in2'] = {
            description: 'output value @ input = 50',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['in3'] = {
            description: 'output value @ input = 100',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.addInput('[0]', node_io_1.Type.NUMBER);
        this.addInput('[50]', node_io_1.Type.NUMBER);
        this.addInput('[100]', node_io_1.Type.NUMBER);
        this.addOutput('output', node_io_1.Type.NUMBER);
    }
    onAfterSettingsChange() {
        const inputCountBefore = this.getInputsCount();
        let inputs = this.settings['inputs'].value;
        inputs = utils_1.default.clamp(inputs, 3, 100);
        inputs = inputs + 1;
        if (inputs == inputCountBefore)
            return;
        this.changeInputsCount(inputs, node_io_1.Type.NUMBER);
        if (inputs > 4) {
            for (let i = 4; i < inputs; i++) {
                if (!this.settings['in' + i]) {
                    this.settings['in' + i] = {
                        description: 'in ' + i,
                        value: 0,
                        type: node_1.SettingType.NUMBER,
                    };
                }
            }
        }
        for (let j = inputs; j < inputCountBefore; j++) {
            delete this.settings['in' + j];
        }
        this.renameInputsAndSettings(inputs);
        if (this.side == container_1.Side.editor)
            this.updateInputsLabels();
        this.onInputUpdated();
    }
    renameInputsAndSettings(count) {
        count = count - 1;
        this.inputs[1].name = '[0]';
        for (let i = 1; i < count; i++) {
            let point = (100.0 / (count - 1)) * i;
            let pointFormatted = point.toFixed(2).replace(/[.,]00$/, '');
            this.inputs[i + 1].name = '[' + pointFormatted + ']';
            this.settings['in' + (i + 1)] = {
                description: 'output value @ input = ' + pointFormatted,
                value: 0,
                type: node_1.SettingType.NUMBER,
            };
        }
        this.updateNodeInput();
    }
    onInputUpdated() {
        const input = this.getInputData(0);
        if (input == null) {
            this.setOutputData(0, null, true);
            return;
        }
        const position = utils_1.default.clamp(input, 0, 100);
        const pointsCount = this.getInputsCount() - 1;
        const stepSize = 100.0 / (pointsCount - 1);
        const stepIndex = position / stepSize;
        if (position % stepSize == 0) {
            let valueAtPosition = this.getInputData(stepIndex + 1);
            if (!utils_1.default.hasInput(valueAtPosition)) {
                valueAtPosition = this.settings['in' + (stepIndex + 1)].value;
            }
            valueAtPosition = Number(valueAtPosition);
            this.setOutputData(0, valueAtPosition);
            return;
        }
        const positionInStep = stepIndex - Math.floor(stepIndex);
        const startValueIndex = Math.floor(stepIndex);
        console.log(stepIndex, 'stepIndex');
        console.log(startValueIndex, 'startValueIndex');
        console.log('in' + (startValueIndex + 1), "'in' + (startValueIndex + 1)");
        let startValue = this.getInputData(startValueIndex + 1);
        if (!utils_1.default.hasInput(startValue))
            startValue = this.settings['in' + (startValueIndex + 1)].value;
        let endValue = this.getInputData(startValueIndex + 2);
        if (!utils_1.default.hasInput(endValue))
            endValue = this.settings['in' + (startValueIndex + 2)].value;
        let output = utils_1.default.remap(positionInStep, 0, 1, startValue, endValue);
        this.setOutputData(0, output, true);
    }
}
container_1.Container.registerNodeType('num-transform/linear-shaper', LinearShaperNode);
//# sourceMappingURL=linear-shaper.js.map