"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
const utils_1 = require("./utils");
class FlexibleNode extends node_1.Node {
    constructor() {
        super();
        this.nullableInputs = true;
        this.dynamicInputsExist = true;
        this.dynamicOutputsExist = false;
        this.dynamicSettingsExist = true;
        this.dynamicInputsField = 'inputs';
        this.dynamicOutputsField = 'outputs';
        this.dynamicInputStartPosition = 0;
        this.dynamicInputsStartName = 'in';
        this.dynamicOutputsStartName = 'out';
        this.dynamicInputsType = node_1.Type.ANY;
        this.dynamicOutputsType = node_1.Type.ANY;
        this.dynamicMinInputs = 2;
        this.dynamicMaxInputs = 100;
        this.dynamicMinOutputs = 2;
        this.dynamicMaxOutputs = 100;
        this.dynamicDefaultInputs = 2;
        this.dynamicDefaultOutputs = 2;
        this.addDynamicInputsOnRange = (save = true) => {
            const count = this.dynamicInputsCount();
            const targetCount = utils_1.default.clamp(count, this.dynamicMinInputs, this.dynamicMaxInputs);
            const currentCount = this.getInputsCount() - this.dynamicInputStartPosition;
            const addedInputsCount = targetCount - currentCount;
            if (addedInputsCount > 0) {
                for (let i = 0; i < addedInputsCount; i++)
                    this.addInputWithName();
            }
            else if (addedInputsCount < 0) {
                const inputCount = this.getInputsCount();
                for (let i = inputCount; i > inputCount + addedInputsCount; i--) {
                    this.removeInput(i - 1);
                }
            }
            save && this.updateNodeInput();
        };
        this.addDynamicOutputsOnRange = (save = true) => {
            const count = this.dynamicOutputsCount();
            const targetCount = utils_1.default.clamp(count, this.dynamicMinOutputs, this.dynamicMaxOutputs);
            const currentCount = this.getOutputsCount();
            const addedOutputsCount = targetCount - currentCount;
            if (addedOutputsCount > 0) {
                for (let i = 0; i < addedOutputsCount; i++)
                    this.addOutputWithName();
            }
            else if (addedOutputsCount < 0) {
                const inputCount = this.getOutputsCount();
                for (let i = inputCount; i > inputCount + addedOutputsCount; i--) {
                    this.removeOutput(i - 1);
                }
            }
            save && this.updateNodeOutput();
        };
        this.settingWiseDynamicInputsAndSettingsUpdate = (save = true) => {
            const startingCount = this.getInputsCount();
            this.addDynamicInputsOnRange(save);
            const targetCount = this.getInputsCount();
            this.addDynamicSettings(startingCount, targetCount);
        };
        this.settingWiseDynamicInputsAndSettingsUpdateForBoolean = (save = true) => {
            this.dynamicInputsType = node_1.Type.BOOLEAN;
            const startingCount = this.getInputsCount();
            this.addDynamicInputsOnRange(save);
            const targetCount = this.getInputsCount();
            const name = this.dynamicInputsStartName;
            for (let i = startingCount; i < targetCount; i++) {
                if (!this.settings[`${name} ${this.dynamicIndex(i)}`]) {
                    this.settings[`${name} ${this.dynamicIndex(i)}`] = {
                        description: `${name} ${this.dynamicIndex(i)}`,
                        type: node_1.SettingType.DROPDOWN,
                        config: {
                            items: [
                                { value: false, text: 'false' },
                                { value: true, text: 'true' },
                                { value: null, text: 'null' },
                            ],
                        },
                        value: null,
                    };
                }
            }
            for (let i = targetCount; i < startingCount; i++) {
                delete this.settings[`${name} ${this.dynamicIndex(i)}`];
            }
        };
        this.dynamicInputsCount = () => this.settings[this.dynamicInputsField].value;
        this.dynamicOutputsCount = () => this.settings[this.dynamicOutputsField].value;
        this.addInputWithName = () => {
            let id = this.getFreeInputId();
            let setting = this.getInputSetting();
            let name = `${this.dynamicInputsStartName} ${id + 1 - this.dynamicInputStartPosition}`;
            if (this.dynamicSettingsExist) {
                name = `[${name}]`;
            }
            let input = { name, type: this.dynamicInputsType, setting };
            if (!this.inputs)
                this.inputs = {};
            this.inputs[id] = input;
            if (this['onInputAdded'])
                this['onInputAdded'](input);
        };
        this.addOutputWithName = () => {
            let id = this.getFreeOutputId();
            let name = `${this.dynamicOutputsStartName} ${id + 1}`;
            let output = { name: name, type: this.dynamicOutputsType };
            if (!this.outputs)
                this.outputs = {};
            this.outputs[id] = output;
            if (this['onOutputAdded'])
                this['onOutputAdded'](output);
        };
        this.addDynamicSettings = (startingCount, targetCount) => {
            const value = node_1.SettingType.STRING ? '' : null;
            const name = this.dynamicInputsStartName;
            const type = node_1.convertType(this.dynamicInputsType);
            for (let i = startingCount; i < targetCount; i++) {
                if (!this.settings[`${name} ${this.dynamicIndex(i)}`]) {
                    this.settings[`${name} ${this.dynamicIndex(i)}`] = {
                        description: `${name} ${this.dynamicIndex(i)}`,
                        value,
                        type: type,
                    };
                }
            }
            for (let i = targetCount; i < startingCount; i++) {
                delete this.settings[`${name} ${this.dynamicIndex(i)}`];
            }
        };
        this.dynamicIndex = (id) => id + 1 - this.dynamicInputStartPosition;
    }
    setup() {
        if (this.dynamicInputsExist) {
            this.settings['inputs'] = {
                description: 'Inputs count',
                value: this.dynamicDefaultInputs,
                type: node_1.SettingType.NUMBER,
            };
        }
        if (this.dynamicOutputsExist) {
            this.settings['outputs'] = {
                description: 'Outputs count',
                value: this.dynamicDefaultOutputs,
                type: node_1.SettingType.NUMBER,
            };
        }
    }
    init() {
        if (this.dynamicInputsExist) {
            this.changeDynamicInputsAndSettings(false);
        }
        if (this.dynamicOutputsExist) {
            this.addDynamicOutputsOnRange(false);
        }
    }
    onAfterSettingsChange() {
        if (this.dynamicInputsExist) {
            this.changeDynamicInputsAndSettings();
        }
        if (this.dynamicOutputsExist) {
            this.addDynamicOutputsOnRange();
        }
    }
    changeDynamicInputsAndSettings(save = true) {
        if (this.dynamicSettingsExist) {
            if (this.dynamicInputsType === node_1.Type.BOOLEAN) {
                this.settingWiseDynamicInputsAndSettingsUpdateForBoolean(save);
            }
            else {
                this.settingWiseDynamicInputsAndSettingsUpdate(save);
            }
        }
        else {
            this.addDynamicInputsOnRange(save);
        }
    }
    getInputSetting() {
        return {
            exist: this.dynamicSettingsExist,
            nullable: this.nullableInputs,
        };
    }
}
exports.FlexibleNode = FlexibleNode;
//# sourceMappingURL=flexible-node.js.map