"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
const statistics_1 = require("./statistics");
class SumNode extends statistics_1.default {
    constructor() {
        super();
        this.title = 'Sum';
        this.description =
            'Outputs the Sum of all the (non null) Numeric inputs. The number of inputs and their values can be modified from settings.';
        this.addOutput('sum', node_io_1.Type.NUMBER);
    }
    onInputUpdated() {
        const data = this.getDefinedInputsOrSettingsValues();
        const sum = utils_1.default.stat.sum(data);
        this.setOutputData(0, sum);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('statistics/sum', SumNode);
//# sourceMappingURL=sum.js.map