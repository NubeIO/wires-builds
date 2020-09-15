"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
const node_io_1 = require("../../node-io");
class NumSeriesGenerator extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicOutputsExist = true;
        this.dynamicInputsExist = false;
        this.dynamicSettingsExist = true;
        super.dynamicOutputsType = node_io_1.Type.NUMBER;
        this.title = 'Numeric Series Generator';
        this.description = "";
        this.addInputWithSettings('startVal', node_io_1.Type.NUMBER, 0, 'Start Value');
        this.addInputWithSettings('addVal', node_io_1.Type.NUMBER, 1, 'Added Value ');
        this.settings['factor'] = {
            description: 'Multiply factor',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        let factor = this.settings['factor'].value;
        if (typeof input === 'undefined')
            return;
        if (typeof input === 'number') {
            const len = this.getOutputsCount();
            let diff = this.getInputData(1);
            if (typeof diff !== 'number')
                diff = 1;
            for (let i = 0; i < len; i++) {
                this.setOutputData(i, i + (input * diff) + (i * factor));
            }
        }
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.onInputUpdated();
    }
}
exports.NumSeriesGenerator = NumSeriesGenerator;
container_1.Container.registerNodeType('miscellaneous/num-series-generator', NumSeriesGenerator);
//# sourceMappingURL=num-series-generator.js.map