"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const statistics_1 = require("./statistics");
const node_1 = require("../../node");
class MinMaxAvgNode extends statistics_1.default {
    constructor() {
        super();
        this.title = 'Min-Max-Avg';
        this.description =
            'Outputs the Minimum, Maximum, and Average values of all the (non null) Numeric inputs.  The number of inputs and their values can be modified from settings.';
        this.addOutput('Min', node_1.Type.NUMBER);
        this.addOutput('Max', node_1.Type.NUMBER);
        this.addOutput('Avg', node_1.Type.NUMBER);
    }
    onInputUpdated() {
        const data = this.getDefinedInputsOrSettingsValues();
        const min = Math.min.apply(Math, data);
        const max = Math.max.apply(Math, data);
        const count = data.length;
        const sum = utils_1.default.sum(data);
        const avg = sum / count;
        this.setOutputData(0, min);
        this.setOutputData(1, max);
        this.setOutputData(2, avg);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('statistics/min-max-avg', MinMaxAvgNode);
//# sourceMappingURL=min-max-avg.js.map