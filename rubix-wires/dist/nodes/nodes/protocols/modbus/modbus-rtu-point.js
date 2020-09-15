"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const node_io_1 = require("../../../node-io");
const constants_1 = require("../../../constants");
const BACnet_enums_units_1 = require("../../../utils/points/BACnet-enums-units");
const MathUtils_1 = require("../../../utils/MathUtils");
const helper_1 = require("../../../../utils/helper");
class ModbusPointNode extends node_1.Node {
    constructor() {
        super();
        this.dynamicInputsExist = false;
        this.dynamicSettingsExist = false;
        this.dynamicInputStartPosition = 0;
        this.dynamicMinInputs = 0;
        this.nullableInputs = true;
        this.dynamicOutputsExist = false;
        this.dynamicInputsStartName = 'in';
        this.dynamicOutputsStartName = 'out';
        this.dynamicInputsType = node_io_1.Type.NUMBER;
        this.inAlarmTrigger = 0;
        this.inHistoryTrigger = 1;
        this.inInput = 2;
        this.outVal = 0;
        this.outError = 1;
        this.outModbusMessage = 2;
        this.outMessageJson = 3;
        this.outAlarm = 3;
        this.outArray = 4;
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
        this.addInput('[name]', node_io_1.Type.STRING);
        this.addOutput('output', node_io_1.Type.NUMBER);
        this.addOutput('error', node_io_1.Type.STRING);
        this.addOutput('output-msg', node_io_1.Type.STRING);
        this.addOutput('output json', node_io_1.Type.STRING);
        this.addOutput('output-modbus-array', node_io_1.Type.STRING);
        this.properties['pointVal'] = null;
        this.properties['address'] = 0;
        this.settings['pointEnable'] = {
            description: 'Point enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['value_group'] = {
            description: 'Point settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.addInputWithSettings('input', node_io_1.Type.NUMBER, 0, 'point write value', false);
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
        this.settings['units_group'] = {
            description: 'Units (Save to get units)',
            type: node_1.SettingType.GROUP,
        };
        this.settings['unitsType'] = {
            description: 'Units',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: BACnet_enums_units_1.default.unitCategory,
            },
        };
        this.settings['units'] = {
            description: 'Units',
            value: BACnet_enums_units_1.default.COMMON_METRIC.NO_UNITS,
            type: node_1.SettingType.DROPDOWN,
        };
        this.settings['math_group'] = {
            description: 'Math settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.settings['mathFunc'] = {
            description: 'Math on output value (optional)',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: MathUtils_1.MATH_FUNC_TYPE.NA, text: 'na' },
                    { value: MathUtils_1.MATH_FUNC_TYPE.ADD, text: 'add' },
                    { value: MathUtils_1.MATH_FUNC_TYPE.SUBTRACT, text: 'subtract' },
                    { value: MathUtils_1.MATH_FUNC_TYPE.MULTIPLY, text: 'multiply' },
                    { value: MathUtils_1.MATH_FUNC_TYPE.DIVIDE, text: 'divide' },
                    { value: MathUtils_1.MATH_FUNC_TYPE.BOOL_INVERT, text: 'bool invert' },
                    { value: MathUtils_1.MATH_FUNC_TYPE.ONE_TO_TRUE, text: 'convert 1/0 to true/false' },
                    { value: MathUtils_1.MATH_FUNC_TYPE.TRUE_TO_ONE, text: 'convert true/false to 1/0' },
                ],
            },
            value: MathUtils_1.MATH_FUNC_TYPE.NA,
        };
        this.settings['mathValue'] = {
            description: 'Enter a value',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['modbus_group'] = {
            description: 'Modbus point settings',
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
        this.addInputWithSettings('address', node_io_1.Type.NUMBER, 1, 'Register address', false);
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
        this.updateTitle();
    }
    onAdded() {
        if (this.side !== container_1.Side.server)
            return;
        this.onInputUpdated();
        this.updateTitle();
    }
    updateTitle() {
        let address = this.getInputData(1);
        this.title = `Modbus Point (FC: ${this.settings['pointType'].value}, AD: ${address})`;
        this.broadcastSettingsToClients();
    }
    onInputUpdated() {
        let pointType = this.settings['pointType'].value;
        if ([5, 6, 15, 16, 25, 26].includes(pointType)) {
            const input = this.getInputData(1);
            if (helper_1.isNull(input))
                return;
            this.setOutputData(this.outModbusMessage, `write val ${input}`, true);
            if (input !== this.lastInputState) {
                this.properties['pointVal'] = input;
                this.persistProperties(false, true);
                this.lastInputState = input;
            }
            else if (typeof this.lastInputState === 'undefined') {
                this.lastInputState = input;
            }
        }
        if (this.inputs[2].updated) {
            const address = this.getInputData(2);
            if (!helper_1.isNull(address)) {
                this.properties['address'] = address;
                this.persistProperties(false, true);
            }
            else {
                this.properties['address'] = 0;
                this.persistProperties(false, true);
            }
        }
        if (this.inputs[0].updated) {
            let nodeName = this.getInputData(0);
            if (!helper_1.isNull(nodeName)) {
                this.name = nodeName;
                this.broadcastNameToClients();
            }
            ;
        }
    }
    onAfterSettingsChange() {
        const address = this.getInputData(2);
        if (!helper_1.isNull(address)) {
            this.properties['address'] = address;
            this.persistProperties(false, true);
        }
        else {
            this.properties['address'] = 0;
            this.persistProperties(false, true);
        }
        this.onInputUpdated();
        this.updateTitle();
    }
    sendJson(pointValue) {
        return {
            name: this.name,
            pointValue: pointValue,
            enable: this.settings['pointEnable'].value,
            address: this.settings['address'].value,
            offset: this.settings['offset'].value,
            pointType: this.settings['pointType'].value
        };
    }
    subscribe(payload) {
        let pointType = this.settings['pointType'].value;
        this.setOutputData(this.outArray, payload.res.data);
        this.setOutputData(this.outError, false, true);
        if ([5, 6, 15, 16, 25, 26].includes(pointType)) {
            if (payload.payload === 'writeOk') {
                this.setOutputData(this.outVal, this.properties['pointVal']);
                this.setOutputData(this.outMessageJson, this.sendJson(this.properties['pointVal']));
            }
            else {
                this.setOutputData(this.outModbusMessage, `write fail`, true);
                this.setOutputData(this.outMessageJson, null);
            }
        }
        else {
            const mathFunc = this.settings['mathFunc'].value;
            const mathValue = this.settings['mathValue'].value;
            let out;
            if (mathFunc !== 0) {
                if (MathUtils_1.default.validateNumbers(payload.payload, mathValue)) {
                    out = MathUtils_1.default.mathSwitch(mathFunc, payload.payload, mathValue);
                    this.setOutputData(this.outVal, out);
                    this.setOutputData(this.outMessageJson, this.sendJson(out));
                }
            }
            else {
                if (typeof payload.payload === 'number') {
                    this.setOutputData(this.outVal, payload.payload);
                    this.setOutputData(this.outMessageJson, this.sendJson(payload.payload));
                }
                else if (typeof payload.payload === 'boolean') {
                    this.setOutputData(this.outVal, payload.payload ? 1 : 0);
                    this.setOutputData(this.outMessageJson, this.sendJson(payload.payload ? 1 : 0));
                }
            }
        }
    }
    subscribeError(e) {
        this.setOutputData(this.outError, true, true);
        this.setOutputData(this.outModbusMessage, e, true);
    }
}
exports.ModbusPointNode = ModbusPointNode;
container_1.Container.registerNodeType(constants_1.MODBUS_RTU_POINT, ModbusPointNode, constants_1.MODBUS_RTU_DEVICE);
//# sourceMappingURL=modbus-rtu-point.js.map