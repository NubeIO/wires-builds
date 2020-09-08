"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_1 = require("../../node");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
class AddressHelperString extends node_1.Node {
    constructor() {
        super();
        this.outputsCount = 0;
        this.title = 'Append To Strings';
        this.description =
            "";
        this.addInputWithSettings('prepend', node_io_1.Type.STRING, '', 'Prepend Value');
        this.addInputWithSettings('append', node_io_1.Type.STRING, '', 'Append Value');
        this.settings['outputs_count'] = {
            description: 'Number of Outputs',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.setSettingsConfig({
            groups: [{ outputs_count: {} }],
        });
    }
    init() {
        this.changeOutputsAndSettings();
    }
    onCreated() {
        this.renameInputsOutputs();
    }
    onAdded() {
        this.outputsCount = this.settings['outputs_count'].value;
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        this.renameInputsOutputs();
    }
    onAfterSettingsChange() {
        this.changeOutputsAndSettings();
        this.renameInputsOutputs();
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { outputs: this.outputs, settings: this.settings },
            });
    }
    changeOutputsAndSettings() {
        let outputs = this.settings['outputs_count'].value;
        outputs = utils_1.default.clamp(outputs, 1, 100);
        this.settings['outputs_count'].value = outputs;
        if (this.outputsCount != outputs)
            this.changeMyOutputsCount(outputs);
    }
    changeMyOutputsCount(target_count) {
        const diff = target_count - this.outputsCount;
        if (diff == 0)
            return;
        this.changeOutputsCount(target_count + 1, node_io_1.Type.STRING);
        if (diff > 0) {
            for (let i = this.outputsCount + 1; i <= target_count; i++) {
                this.settings['output' + i] = {
                    description: 'Output ' + i,
                    value: '',
                    type: node_1.SettingType.STRING,
                };
                for (let i = this.outputsCount + 1; i <= target_count; i++) {
                    this.settingConfigs.groups.push({
                        [`output${i}`]: { weight: 5 },
                    });
                }
            }
        }
        else if (diff < 0) {
            for (let i = this.outputsCount; i > target_count; i--) {
                delete this.settings['output' + i];
                this.settingConfigs.groups.pop();
            }
        }
        this.outputsCount = target_count;
    }
    renameInputsOutputs() {
        const prepend = this.getInputData(0);
        const append = this.getInputData(1);
        for (let i = 1; i <= this.outputsCount; i++) {
            const output = this.settings['output' + i].value || '';
            this.outputs[i].name = '' + i + ' | ' + output;
            this.setOutputData(i, '' + prepend + output + append);
        }
    }
}
container_1.Container.registerNodeType('miscellaneous/append-to-strings', AddressHelperString);
//# sourceMappingURL=append-to-strings.js.map