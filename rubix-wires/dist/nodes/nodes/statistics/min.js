"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
const statistics_1 = require("./statistics");
class MinNode extends statistics_1.default {
    constructor() {
        super();
        this.title = 'Min';
        this.description =
            'Outputs the Minimum value of all the (non null) Numeric inputs. The number of inputs and their values can be modified from settings.';
        this.addOutput('min', node_io_1.Type.NUMBER);
    }
    onInputUpdated() {
        const data = this.getDefinedInputsOrSettingsValues();
        const min = utils_1.default.stat.min(data);
        this.setOutputData(0, min);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('statistics/min', MinNode);
//# sourceMappingURL=min.js.map