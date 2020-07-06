"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_node_1 = require("../../../container-node");
const container_1 = require("../../../container");
const modbus_functions_1 = require("./modbus-functions");
const check_types_1 = require("../../../utils/check-types");
const constants_1 = require("../../../constants");
const unitsJson_1 = require("../../../utils/data-types/src/valueFormats/unitsJson");
const pointFunc_1 = require("../../../utils/points/pointFunc");
const utils_1 = require("../../../utils");
class ModbusPointNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.units = unitsJson_1.unitRefs.map(e => {
            return { value: e.value, text: e.text };
        });
        this.dynamicInputsExist = false;
        this.dynamicSettingsExist = false;
        this.dynamicInputStartPosition = 2;
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
        this.description = 'This node allows you create a Modbus TCP server';
        this.addInput('[alarm trigger]', node_1.Type.BOOLEAN);
        this.addInput('[history trigger]', node_1.Type.BOOLEAN);
        this.addOutput('out', node_1.Type.NUMBER);
        this.addOutput('error', node_1.Type.STRING);
        this.addOutput('message', node_1.Type.STRING);
        this.addOutput('alarm', node_1.Type.BOOLEAN);
        this.properties['pointVal'] = null;
        this.settings['pointEnable'] = {
            description: 'Point enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['value_group'] = {
            description: 'value_group',
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
        this.settings['pointLimit_group'] = {
            description: 'pointLimit_group',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.settings['pointLimitEnable'] = {
            description: 'Limit enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['limitLow'] = {
            description: 'Out value low',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['limitHigh'] = {
            description: 'Out value high',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['math_group'] = {
            description: 'math_group',
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
            description: 'modbus_group',
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
                    { value: 21, text: `Read DO` },
                    { value: 2, text: `readDiscreteInput's` },
                    { value: 22, text: `Read DI` },
                    { value: 3, text: `readHoldingRegister's` },
                    { value: 23, text: `Read AO` },
                    { value: 4, text: `readInputRegister's` },
                    { value: 24, text: `Read AI` },
                    { value: 5, text: `writeCoil` },
                    { value: 25, text: `Write DO` },
                    { value: 6, text: `writeRegister` },
                    { value: 26, text: `Write AO` },
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
            value: 2,
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
            let InputStartPosition = 2;
            let inputValue;
            let priority;
            for (let i = InputStartPosition; i < InputStartPosition + 16; i++) {
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
                modbus_functions_1.default.persistProperties(this.container, this.properties, this.id, this.container.id);
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
    onAfterSettingsChange() {
        this.updateNodeInputs(true);
        this.onInputUpdated();
    }
    updateNodeInputs(save) {
        let pointType = this.settings['pointType'].value;
        if (this.previousPointType !== pointType) {
            if ([5, 6, 15, 16, 25, 26].includes(pointType)) {
                this.inputCount = 16;
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
        if ([5, 6, 15, 16, 25, 26].includes(pointType)) {
            if (payload === 'writeOk') {
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
                if (pointFunc_1.default.validateNumbers(payload, mathValue)) {
                    out = pointFunc_1.default.mathSwitch(mathFunc, payload, mathValue);
                    this.setOutputData(this.outVal, out);
                }
            }
            else {
                if (typeof payload === 'number' || typeof payload === 'boolean') {
                    this.setOutputData(this.outVal, payload);
                }
            }
        }
    }
    subscribeError(e) {
        this.setOutputData(this.outError, e, true);
    }
}
container_1.Container.registerNodeType(constants_1.MODBUS_RTU_POINT, ModbusPointNode, constants_1.MODBUS_RTU_DEVICE);
//# sourceMappingURL=modbus-rtu-point.js.map