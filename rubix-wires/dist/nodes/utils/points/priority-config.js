"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const node_io_1 = require("../../node-io");
const node_utils_1 = require("../../utils/node-utils");
class PriorityConfig {
    static addPrioritySettings(self) {
        self.properties['priorityStartInput'] = self.getFreeInputId();
        self.properties['priorityStartOutput'] = self.getFreeOutputId();
        self.addInput('inputValue', node_io_1.Type.ANY);
        self.addInput('inputPriority', node_io_1.Type.NUMBER);
        self.addOutput('outputValue', node_io_1.Type.ANY);
        self.addOutput('outputPriority', node_io_1.Type.NUMBER);
        self.addOutput('outputJSON', node_io_1.Type.STRING);
        for (let input in self.inputs) {
            if (self.inputs[input].name == 'inputValue') {
                self.properties['valueInput'] = input;
            }
            else if (self.inputs[input].name == 'inputPriority')
                self.properties['priorityInput'] = input;
        }
        for (let output in self.outputs) {
            if (self.outputs[output].name == 'outputValue') {
                self.properties['valueOutput'] = output;
            }
            else if (self.outputs[output].name == 'outputPriority') {
                self.properties['priorityOutput'] = output;
            }
            else if (self.outputs[output].name == 'outputJSON')
                self.properties['jsonOutput'] = output;
        }
        self.settings['input_group'] = {
            description: 'Input Settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        self.settings['decimals'] = {
            description: 'Decimal Places (Limit 5)',
            value: 3,
            type: node_1.SettingType.NUMBER,
        };
        self.settings['inputMethod'] = {
            description: 'Input Method',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'Value and Priority' },
                    { value: 1, text: 'Priority Array' },
                    { value: 2, text: 'JSON' },
                ],
            },
            value: 0,
        };
        self.properties['priorityLevelItems'] = Array(16)
            .fill(null)
            .map((_, i) => ({ value: i + 1, text: (i + 1).toString() }));
        self.settings['priorityLevel'] = {
            description: 'Write Priority Level',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: self.properties['priorityLevelItems'],
            },
            value: 16,
        };
        self.settings['in1'] = {
            description: 'in1',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in2'] = {
            description: 'in2',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in3'] = {
            description: 'in3',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in4'] = {
            description: 'in4',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in5'] = {
            description: 'in5',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in6'] = {
            description: 'in6',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in7'] = {
            description: 'in7',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in8'] = {
            description: 'in8',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in9'] = {
            description: 'in9',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in10'] = {
            description: 'in10',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in11'] = {
            description: 'in11',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in12'] = {
            description: 'in12',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in13'] = {
            description: 'in13',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in14'] = {
            description: 'in14',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in15'] = {
            description: 'in15',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['in16'] = {
            description: 'in16',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    static addPrioritySettingsConfig(self) {
        if (!self.settingConfigs.hasOwnProperty('groups') && !self.settingConfigs.hasOwnProperty('conditions')) {
            self.setSettingsConfig({ groups: [], conditions: {} });
        }
        self.settingConfigs.groups.push({ input_group: {} });
        self.settingConfigs.conditions['priorityLevel'] = setting => {
            return setting['inputMethod'].value == 0;
        };
        self.settingConfigs.conditions['in1'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in2'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in3'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in4'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in5'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in6'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in7'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in8'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in9'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in10'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in11'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in12'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in13'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in14'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in15'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.settingConfigs.conditions['in16'] = setting => {
            return setting['inputMethod'].value == 1;
        };
        self.properties['priorityArray'] = {};
        for (var i = 1; i < 16; i++) {
            self.properties['priorityArray'][String(i)] = null;
        }
        self.properties['inputMethod'] = self.settings['inputMethod'].value;
        self.properties['prioritySettingsArray'] = new Array(16).fill(false);
    }
    static priorityOnCreated(self) {
        self.properties['dynamicInputStartPosition'] = self.getInputsCount();
        node_utils_1.default.persistProperties(self, true, true, true, true);
    }
    static doPriorityFunctions(self) {
        return __awaiter(this, void 0, void 0, function* () {
            let input = null;
            let priority = null;
            switch (self.properties['inputMethod']) {
                case 0:
                    input = self.getInputData(self.properties['priorityStartInput']);
                    if (input == undefined)
                        input = null;
                    priority = self.getInputData(self.properties['priorityStartInput'] + 1) || 16;
                    if (priority > 16 || priority == null)
                        priority = 16;
                    self.properties['priorityArray'][String(priority)] = input;
                    break;
                case 1:
                    var inputsCount = 0;
                    self.properties['prioritySettingsArray'].forEach(setting => {
                        if (setting)
                            inputsCount++;
                    });
                    for (var i = 0; i < inputsCount; i++) {
                        input = self.getInputData(self.properties['priorityStartInput'] + i);
                        if (input == undefined)
                            input = null;
                        const inputName = self.inputs[self.properties['priorityStartInput'] + i].name;
                        if (inputName.startsWith('in')) {
                            const inputNumber = Number(inputName.replace(/\D/g, ''));
                            if (!isNaN(inputNumber)) {
                                self.properties['priorityArray'][`${inputNumber}`] = input;
                            }
                        }
                    }
                    break;
                case 2:
                    input = self.getInputData(self.properties['priorityStartInput']);
                    if (typeof input === 'string') {
                        try {
                            self.properties['priorityArray'] = JSON.parse(input);
                        }
                        catch (e) {
                            console.log('PRIORITY ARRAY JSON ERROR: ', e);
                        }
                    }
                    break;
            }
            const highestPriorityIndex = Object.values(self.properties['priorityArray']).findIndex(element => element != null) + 1;
            if (highestPriorityIndex <= 0) {
                self.setOutputData(self.properties['priorityStartOutput'], null);
                self.setOutputData(self.properties['priorityStartOutput'] + 1, null);
                self.setOutputData(self.properties['priorityStartOutput'] + 2, null);
            }
            else {
                self.setOutputData(self.properties['priorityStartOutput'], self.properties['priorityArray'][String(highestPriorityIndex)]);
                self.setOutputData(self.properties['priorityStartOutput'] + 1, highestPriorityIndex);
                self.setOutputData(self.properties['priorityStartOutput'] + 2, self.properties['priorityArray']);
            }
        });
    }
    static priorityFunctionsForAfterSettingsChange(self) {
        return __awaiter(this, void 0, void 0, function* () {
            if (self.properties['inputMethod'] !== self.settings['inputMethod'].value) {
                PriorityConfig.initializePriorityArray(self);
                switch (self.settings['inputMethod'].value) {
                    case 0:
                        if (self.properties['inputMethod'] == 2) {
                            self.removeInputAtPosition(self.properties['priorityStartInput']);
                        }
                        else if (self.properties['inputMethod'] == 1) {
                            PriorityConfig.updatePriorityInputsFromSettings(self, true);
                        }
                        self.addInputAtPosition(self.properties['priorityStartInput'], 'inputValue', node_io_1.Type.ANY);
                        self.addInputAtPosition(self.properties['priorityStartInput'] + 1, 'inputPriority', node_io_1.Type.NUMBER);
                        break;
                    case 1:
                        if (self.properties['inputMethod'] == 2) {
                            self.removeInputAtPosition(self.properties['priorityStartInput']);
                        }
                        else if (self.properties['inputMethod'] == 0) {
                            self.removeInputAtPosition(self.properties['priorityStartInput']);
                            self.removeInputAtPosition(self.properties['priorityStartInput']);
                        }
                        PriorityConfig.updatePriorityInputsFromSettings(self);
                        break;
                    case 2:
                        if (self.properties['inputMethod'] == 1) {
                            PriorityConfig.updatePriorityInputsFromSettings(self, true);
                        }
                        else if (self.properties['inputMethod'] == 0) {
                            self.removeInputAtPosition(self.properties['priorityStartInput']);
                            self.removeInputAtPosition(self.properties['priorityStartInput']);
                        }
                        self.addInputAtPosition(self.properties['priorityStartInput'], 'inputJSON', node_io_1.Type.ANY);
                        break;
                }
            }
            else if (self.properties['inputMethod'] == 1)
                PriorityConfig.updatePriorityInputsFromSettings(self);
            self.properties['inputMethod'] = self.settings['inputMethod'].value;
            node_utils_1.default.persistProperties(self, true, true, true);
        });
    }
    static updatePriorityInputsFromSettings(self, removeAll = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const startPosition = self.properties['priorityStartInput'];
            var settingsArray = new Array(16).fill(false);
            var inputsArray = new Array(16).fill(-1);
            for (var i = 0; i < 16; i++) {
                removeAll ? (settingsArray[i] = false) : (settingsArray[i] = self.settings['in' + (i + 1)].value);
                if (self.inputs.hasOwnProperty(`${startPosition + i}`)) {
                    const inputName = self.inputs[`${startPosition + i}`].name;
                    if (inputName.startsWith('in')) {
                        const inputNumber = Number(inputName.replace(/\D/g, ''));
                        if (!isNaN(inputNumber)) {
                            inputsArray[i] = inputNumber;
                        }
                    }
                }
                self.properties['prioritySettingsArray'] = settingsArray;
            }
            for (var j = 0; j < 16; j++) {
                if (settingsArray[j]) {
                    for (var y = 0; y <= j; y++) {
                        const inputArrayatY = inputsArray[y];
                        if (inputArrayatY == j + 1)
                            break;
                        if (inputArrayatY == -1 || inputArrayatY > j + 1) {
                            self.addInputAtPosition(startPosition + y, 'in' + (j + 1), node_io_1.Type.ANY);
                            inputsArray.splice(y, 0, j + 1);
                            inputsArray.pop();
                            break;
                        }
                    }
                }
                else if (!settingsArray[j]) {
                    for (var x = 0; x <= j; x++) {
                        const inputArrayatX = inputsArray[x];
                        if (inputArrayatX == -1 || inputArrayatX > j + 1) {
                            break;
                        }
                        else if (inputsArray[x] == j + 1) {
                            self.removeInputAtPosition(startPosition + x);
                            inputsArray.splice(x, 1);
                            inputsArray.push(-1);
                            break;
                        }
                    }
                }
            }
        });
    }
    static initializePriorityArray(self) {
        return __awaiter(this, void 0, void 0, function* () {
            self.properties['priorityArray'] = {};
            for (var i = 1; i < 16; i++) {
                self.properties['priorityArray'][String(i)] = null;
            }
        });
    }
}
exports.default = PriorityConfig;
//# sourceMappingURL=priority-config.js.map