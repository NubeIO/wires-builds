"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
class RankNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicOutputsExist = true;
        this.dynamicSettingsExist = false;
        this.dynamicInputsType = node_1.Type.NUMBER;
        super.dynamicOutputsType = node_1.Type.NUMBER;
        this.dynamicDefaultInputs = 5;
        this.dynamicDefaultOutputs = 3;
        this.title = 'Rank (Highest)';
        this.description =
            'Outputs the ranked highest (max to min), or ranked lowest (min to max) of all the (non null) Numeric inputs.  The number of inputs and the number of outputs can be modified from settings.';
        this.settings['rank'] = {
            description: 'Highest or Lowest',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'top', text: 'Rank Highest' },
                    { value: 'bottom', text: 'Rank Lowest' },
                ],
            },
            value: 'top',
        };
    }
    onAdded() {
        this.updateTitle();
        this.onInputUpdated();
    }
    onInputUpdated() {
        let data = this.getDefinedInputValues();
        data = data.sort((a, b) => a - b);
        const outputCount = this.getOutputsCount();
        if (this.settings['rank'].value === 'bottom') {
            for (let i = 0; i < outputCount; i++) {
                this.setOutputData(i, data[i]);
            }
        }
        else {
            for (let i = 0; i < outputCount; i++) {
                this.setOutputData(i, data[data.length - (i + 1)]);
            }
        }
    }
    onAfterSettingsChange() {
        if (Number(this.settings['outputs'].value) > Number(this.settings['inputs'].value)) {
            this.settings['outputs'].value = Number(this.settings['inputs'].value);
        }
        super.onAfterSettingsChange();
        this.onInputUpdated();
        this.updateTitle();
    }
    updateTitle() {
        if (this.settings['rank'].value === 'top')
            this.title = 'Rank (Highest)';
        else if (this.settings['rank'].value === 'bottom')
            this.title = 'Rank (Lowest)';
    }
}
container_1.Container.registerNodeType('statistics/rank', RankNode);
//# sourceMappingURL=rank.js.map