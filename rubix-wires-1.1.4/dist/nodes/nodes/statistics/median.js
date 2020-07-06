"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const statistics_1 = require("./statistics");
const node_1 = require("../../node");
class MedianNode extends statistics_1.default {
    constructor() {
        super();
        this.title = 'Median';
        this.description =
            'Outputs the Median value of all the (non null) Numeric inputs. The number of inputs and their values can be modified from settings.';
        this.addOutput('median', node_1.Type.NUMBER);
    }
    onInputUpdated() {
        const data = this.getDefinedInputsOrSettingsValues();
        const median = utils_1.default.stat.median(data);
        this.setOutputData(0, median);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('statistics/median', MedianNode);
//# sourceMappingURL=median.js.map