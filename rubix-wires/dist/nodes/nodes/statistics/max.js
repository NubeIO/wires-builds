"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const statistics_1 = require("./statistics");
const node_1 = require("../../node");
class MaxNode extends statistics_1.default {
    constructor() {
        super();
        this.title = 'Max';
        this.description =
            'Outputs the Maximum value of all the (non null) Numeric inputs. The number of inputs and their values can be modified from settings.';
        this.addOutput('max', node_1.Type.NUMBER);
    }
    onInputUpdated() {
        const data = this.getDefinedInputsOrSettingsValues();
        const max = utils_1.default.stat.max(data);
        this.setOutputData(0, max);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('statistics/max', MaxNode);
//# sourceMappingURL=max.js.map