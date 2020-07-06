"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const statistics_1 = require("./statistics");
const node_1 = require("../../node");
class RangeNode extends statistics_1.default {
    constructor() {
        super();
        this.title = 'range';
        this.description =
            'Outputs the Range value (max-min) of all the (non null) Numeric inputs. The number of inputs and their values can be modified from settings.';
        this.addOutput('range', node_1.Type.NUMBER);
    }
    onInputUpdated() {
        const data = this.getDefinedInputsOrSettingsValues();
        const range = utils_1.default.stat.range(data);
        this.setOutputData(0, range);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('statistics/range', RangeNode);
//# sourceMappingURL=range.js.map