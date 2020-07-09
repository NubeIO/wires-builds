"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const statistics_1 = require("./statistics");
const node_1 = require("../../node");
class AvgNode extends statistics_1.default {
    constructor() {
        super();
        this.title = 'Average';
        this.description =
            'Outputs the Average, Count, and Sum values of all the (non null) Numeric inputs. The number of inputs and their values can be modified from settings.';
        this.addOutput('Avg', node_1.Type.NUMBER);
        this.addOutput('Count', node_1.Type.STRING);
        this.addOutput('Sum', node_1.Type.STRING);
    }
    onInputUpdated() {
        const data = this.getDefinedInputsOrSettingsValues();
        const count = data.length;
        const sum = utils_1.default.sum(data);
        let avg = 0;
        if (count !== 0) {
            avg = sum / count;
        }
        this.setOutputData(0, avg);
        this.setOutputData(1, count);
        this.setOutputData(2, sum);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('statistics/avg', AvgNode);
//# sourceMappingURL=avg.js.map