"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_node_1 = require("../../../container-node");
const container_1 = require("../../../container");
const check_types_1 = require("../../../utils/check-types");
const constants_1 = require("../../../constants");
const unitsJson_1 = require("../../../utils/data-types/src/valueFormats/unitsJson");
const pointFunc_1 = require("../../../utils/points/pointFunc");
const utils_1 = require("../../../utils");
const node_utils_1 = require("../../../utils/node-utils");
class ModbusPointNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.units = unitsJson_1.unitRefs.map(e => {
            return { value: e.value, text: e.text };
        });
        this.dynamicInputsExist = false;
        this.dynamicSettingsExist = false;
        this.dynamicInputStartPosition = 0;
        this.dynamicMinInputs = 0;
        this.nullableInputs = true;
        this.dynamicOutputsExist = false;
        this.dynamicInputsStartName = 'in';
        this.dynamicOutputsStartName = 'out';
        this.dynamicInputsType = node_1.Type.NUMBER;
        this.inAlarmTrigger = 0;
        this.inHistoryTrigger = 1;
        this.inInput = 2;
        this.outVal = 0;
        this.outError = 1;
        this.outMessageJson = 2;
        this.outAlarm = 3;
        this.dynamicInputsCount = () => this.inputCount;
        this.addDynamicInputsOnRange = (save = true) => {
            let dynamicMaxInputs = 20;
            const count = this.dynamicInputsCount();
            const targetCount = utils_1.default.clamp(count, this.dynamicMinInputs, dynamicMaxInputs);
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
        this.title = 'Modbus Point';
        this.description =
            `## Description\n ` +
                ` This node is used as a modbus device point.\n ` +
                ` The points for the device will be added inside the device node (right click and **open** on the network node to add the device and points) \n ` +
                `   \n ` +
                `## Point Address\n ` +
                `   \n ` +
                `### Coils\n ` +
                `   \n ` +
                ` Valid Coil range is between 0 and 10001. This will allow any modbus client to read and write to those coli ranges\n ` +
                `   \n ` +
                `### Holding Register\n ` +
                `   \n ` +
                ` Valid Holding Register range is between 10001 and 19999. This will allow any modbus client to read and write to those coli ranges\n ` +
                `   \n ` +
                `## Enable\n ` +
                `   \n ` +
                ` This will enable/disable the point from polling \n ` +
                `   \n `;
        this.addOutput('out', node_1.Type.NUMBER);
        this.addOutput('error', node_1.Type.STRING);
        this.addOutput('message', node_1.Type.STRING);
        this.properties['pointVal'] = null;
        this.settings['pointEnable'] = {
            description: 'Point enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['value_group'] = {
            description: 'point settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.settings['valRaw'] = {
            description: 'Raw value',
            value: '',
            type: node_1.SettingType.READONLY,
        };
        this.settings['valOffset'] = {
            description: 'Out value offset',
            value: 1000,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['valPrecision'] = {
            description: 'Out value precision',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['units'] = {
            description: 'Units',
            value: this.units[0].value,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: this.units,
            },
        };
        this.settings['math_group'] = {
            description: 'math settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.settings['mathFunc'] = {
            description: 'Math on output value (optional)',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'na' },
                    { value: 1, text: 'add' },
                    { value: 2, text: 'subtract' },
                    { value: 3, text: 'multiply' },
                    { value: 4, text: 'divide' },
                    { value: 7, text: 'bool invert' },
                    { value: 8, text: 'convert 1/0 to true/false' },
                    { value: 9, text: 'convert true/false to 1/0' },
                ],
            },
            value: 0,
        };
        this.settings['mathValue'] = {
            description: 'Enter a value',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['modbus_group'] = {
            description: 'modbus point settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.settings['pointType'] = {
            description: 'Select a point type',
            value: 1,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 1, text: `Read Coil's` },
                    { value: 2, text: `readDiscreteInput's` },
                    { value: 3, text: `readHoldingRegister's` },
                    { value: 4, text: `readInputRegister's` },
                    { value: 5, text: `writeCoil` },
                    { value: 6, text: `writeRegister` },
                    { value: 16, text: `writeRegister's` },
                ],
            },
        };
        this.settings['address'] = {
            description: 'Register address',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['pointTimeout'] = {
            description: 'Point Timeout (MS)',
            value: 1000,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['offset'] = {
            description: 'Register offset',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['dataType'] = {
            description: 'Set data type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'na' },
                    { value: 1, text: 'INT-16' },
                    { value: 2, text: `UINT-16` },
                    { value: 3, text: 'INT-32' },
                    { value: 4, text: 'UINT-32' },
                    { value: 5, text: 'FLOAT-32' },
                    { value: 8, text: 'DOUBLE-64' },
                ],
            },
            value: 0,
        };
        this.settings['dataEndian'] = {
            description: 'Set byte order',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'LE-Byte BE-Word' },
                    { value: 1, text: 'LE-Byte LE-Word' },
                    { value: 2, text: 'BE-Byte LE-Word' },
                    { value: 3, text: 'BE-Byte BE-Word' },
                ],
            },
            value: 0,
        };
        this.setSettingsConfig({
            groups: [
                { address: {}, offset: {}, pointTimeout: {} },
                { dataType: {}, dataEndian: {} },
                { pointLimitEnable: {}, limitLow: {}, limitHigh: {} },
                { mathFunc: {}, mathValue: {} },
                { valOffset: {}, valPrecision: {} },
            ],
            conditions: {
                offset: setting => {
                    const val = setting['pointType'].value;
                    return ![5, 6].includes(val);
                },
                dataType: setting => {
                    const val = setting['pointType'].value;
                    return ![1, 2, 5, 15].includes(val);
                },
                dataEndian: setting => {
                    const val = setting['pointType'].value;
                    return ![1, 2, 5, 15].includes(val);
                },
            },
        });
    }
    onCreated() {
        super.onCreated();
        this.updateNodeInputs(false);
        this.name = `id_${this.container.id.toString()}_${this.id.toString()}`;
    }
    onAdded() {
        super.onAdded();
        if (this.side !== container_1.Side.server)
            return;
        this.onInputUpdated();
    }
    onInputUpdated() {
        let pointType = this.settings['pointType'].value;
        if ([5, 6, 15, 16, 25, 26].includes(pointType)) {
            let InputStartPosition = 0;
            let inputValue;
            let priority;
            for (let i = InputStartPosition; i < InputStartPosition + 1; i++) {
                inputValue = this.getInputData(i);
                if (inputValue != null) {
                    priority = i;
                    break;
                }
            }
            let input = check_types_1.default.formatValueReturnType(inputValue);
            this.setOutputData(this.outMessageJson, `write val ${inputValue} @ priority ${priority - 1}`, true);
            if (input !== this.lastInputState) {
                this.properties['pointVal'] = input;
                node_utils_1.default.persistProperties(this, false, true);
                this.lastInputState = input;
            }
            else if (typeof this.lastInputState === 'undefined') {
                this.lastInputState = input;
            }
        }
    }
    updateTitle() {
        this.title = `MB Pnt (FC: ${this.settings['pointType'].value}, AD: ${this.settings['address'].value}, ID: ${this.container.id}_${this.id})`;
        this.broadcastSettingsToClients();
    }
    onAfterSettingsChange(oldSettings) {
        super.onAfterSettingsChange(oldSettings);
        this.updateNodeInputs(true);
        this.onInputUpdated();
    }
    updateNodeInputs(save) {
        let pointType = this.settings['pointType'].value;
        if (this.previousPointType !== pointType) {
            if ([5, 6, 15, 16, 25, 26].includes(pointType)) {
                this.inputCount = 1;
                this.addDynamicInputsOnRange(save);
            }
            else {
                this.inputCount = 0;
                this.addDynamicInputsOnRange(save);
            }
        }
        this.previousPointType = pointType;
    }
    getInputSetting() {
        return {
            exist: this.dynamicSettingsExist,
            nullable: this.nullableInputs,
        };
    }
    subscribe(payload) {
        let pointType = this.settings['pointType'].value;
        this.setOutputData(this.outMessageJson, payload.res.data);
        this.setOutputData(this.outError, false, true);
        if ([5, 6, 15, 16, 25, 26].includes(pointType)) {
            if (payload.payload === 'writeOk') {
                this.setOutputData(this.outVal, this.properties['pointVal']);
            }
            else {
                this.setOutputData(this.outMessageJson, `write fail`, true);
            }
        }
        else {
            const mathFunc = this.settings['mathFunc'].value;
            const mathValue = this.settings['mathValue'].value;
            let out;
            if (mathFunc !== 0) {
                if (pointFunc_1.default.validateNumbers(payload.payload, mathValue)) {
                    out = pointFunc_1.default.mathSwitch(mathFunc, payload.payload, mathValue);
                    this.setOutputData(this.outVal, out);
                }
            }
            else {
                if (typeof payload.payload === 'number') {
                    this.setOutputData(this.outVal, payload.payload);
                }
                else if (typeof payload.payload === 'boolean') {
                    this.setOutputData(this.outVal, payload.payload ? 1 : 0);
                }
            }
        }
    }
    subscribeError(e) {
        this.setOutputData(this.outError, true, true);
        this.setOutputData(this.outMessageJson, e, true);
    }
}
container_1.Container.registerNodeType(constants_1.MODBUS_RTU_POINT, ModbusPointNode, constants_1.MODBUS_RTU_DEVICE);
//# sourceMappingURL=modbus-rtu-point.js.map