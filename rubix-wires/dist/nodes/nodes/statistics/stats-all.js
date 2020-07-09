"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const statistics_1 = require("./statistics");
const node_1 = require("../../node");
class AnyStatAllNode extends statistics_1.default {
    constructor() {
        super();
        this.title = 'all stats';
        this.description =
            'Outputs the Maximum, Minimum, Range, Sum, Mean, Median, Modes, Variance, Standard Deviation, Mean Absolute Deviation, and Z Score values of all the (non null) Numeric inputs. The number of inputs and their values can be modified from settings.';
        this.addOutput('max', node_1.Type.NUMBER);
        this.addOutput('min', node_1.Type.NUMBER);
        this.addOutput('range', node_1.Type.NUMBER);
        this.addOutput('sum', node_1.Type.NUMBER);
        this.addOutput('mean', node_1.Type.NUMBER);
        this.addOutput('median', node_1.Type.NUMBER);
        this.addOutput('modes', node_1.Type.NUMBER);
        this.addOutput('variance', node_1.Type.NUMBER);
        this.addOutput('standardDeviation', node_1.Type.NUMBER);
        this.addOutput('meanAbsoluteDeviation', node_1.Type.NUMBER);
        this.addOutput('zScores', node_1.Type.NUMBER);
    }
    onInputUpdated() {
        const a = this.getDefinedInputsOrSettingsValues();
        this.setOutputData(0, utils_1.default.stat.max(a));
        this.setOutputData(1, utils_1.default.stat.min(a));
        this.setOutputData(2, utils_1.default.stat.range(a));
        this.setOutputData(3, utils_1.default.stat.sum(a));
        this.setOutputData(4, utils_1.default.stat.mean(a));
        this.setOutputData(5, utils_1.default.stat.median(a));
        this.setOutputData(6, utils_1.default.stat.modes(a));
        this.setOutputData(7, utils_1.default.stat.variance(a));
        this.setOutputData(8, utils_1.default.stat.standardDeviation(a));
        this.setOutputData(9, utils_1.default.stat.meanAbsoluteDeviation(a));
        this.setOutputData(10, utils_1.default.stat.zScores(a));
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('statistics/stats-all', AnyStatAllNode);
//# sourceMappingURL=stats-all.js.map