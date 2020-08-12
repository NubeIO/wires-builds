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
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const edge_constant_1 = require("./edge-constant");
const edge_utils_1 = require("./edge-utils");
const edge_gpio_utils_1 = require("./edge-gpio-utils");
const edge_10k_sensor_calc_1 = require("./edge-10k-sensor-calc");
const BACnet_enums_units_1 = require("../../../utils/points/BACnet-enums-units");
const utils_1 = require("../../../utils");
const constants_1 = require("../../../constants");
const MathUtils_1 = require("../../../utils/MathUtils");
const HistoryBase_1 = require("../../history/HistoryBase");
var POINT_TYPE;
(function (POINT_TYPE) {
    POINT_TYPE[POINT_TYPE["DIGITAL"] = 1] = "DIGITAL";
    POINT_TYPE[POINT_TYPE["UI_DIGITAL"] = 2] = "UI_DIGITAL";
    POINT_TYPE[POINT_TYPE["_0_10DC"] = 3] = "_0_10DC";
    POINT_TYPE[POINT_TYPE["_0_20MA"] = 4] = "_0_20MA";
    POINT_TYPE[POINT_TYPE["_4_20MA"] = 5] = "_4_20MA";
    POINT_TYPE[POINT_TYPE["_10K_THERMISTOR"] = 6] = "_10K_THERMISTOR";
})(POINT_TYPE || (POINT_TYPE = {}));
class Edge28InputPointNode extends HistoryBase_1.default {
    constructor() {
        super();
        this.title = 'Edge IO 28 Input';
        this.description =
            `## Description\n ` +
                ` The is node is used in conjunction with the edge-io-28. This node uses an internal rest-api to talk to the edge-io-28\n ` +
                `   \n ` +
                `## Digital Input\n ` +
                `   \n ` +
                `A total of 14 DIs can be used on the edge-io-28. There are 7 DIs and 7 UIs\n ` +
                `   \n ` +
                `### DIs (From the UIs)  \n ` +
                `   \n ` +
                ` The UIs can be setup and used to read a status change from a *Digital Input* (7 off dry input)\n ` +
                `   \n ` +
                `### DIs (From the UIs)  \n ` +
                `   \n ` +
                ` The UIs can be setup and used to read a status change from a *Digital Input* (7 off dry input)\n ` +
                `   \n ` +
                `## Universal Input\n ` +
                `   \n ` +
                ` The Universal Input or Analogue Input (7 off) can be used in a number of combinations for reading different sensor types\n ` +
                `   \n ` +
                `### UI as 0/10dc  \n ` +
                `   \n ` +
                ` When configured as a UI 0/10dc the node output value will return a value that is set in the **Low scale** & **High scale**\n ` +
                `   \n ` +
                `### UI as 0/20ma and or 4/20ma \n ` +
                `   \n ` +
                ` When configured as a UI 0/20ma and or 4/20ma the node output value will return a value that is set in the **Low scale** & **High scale**\n ` +
                `   \n ` +
                `### UI as 10K thermistor \n ` +
                `   \n ` +
                ` When configured as a UI 10K thermistor type 2 the node output value will return a value based on the resistance and corresponding temperature\n ` +
                `   \n ` +
                `## Point Configuration\n ` +
                `### Point Enable\n ` +
                `   \n ` +
                ` The point enable will disable any new value being sent to the node **output**  \n ` +
                `   \n ` +
                `### Point Debug\n ` +
                `   \n ` +
                ` The point debug will allow the node **output** to always send the value even if there is node change\n ` +
                ` This is just a guide to see if the polling is working\n ` +
                `   \n ` +
                `### Point Selection\n ` +
                `   \n ` +
                ` 1. Select the **Point Type** for example UO  \n ` +
                ` 2. Select the **Point Number** for example UO-1   \n ` +
                ` **Note:** You cant set a type **Digital** and point number **UI1** the correct types must be matched with the correct point numbers  \n ` +
                `   \n ` +
                `### Point Units\n ` +
                `   \n ` +
                ` The units can be set as required see steps below.  \n ` +
                ` 1. Select the **Units Category**.  \n ` +
                ` 2. Lock (**lock icon**) the node setting's and hit the **save** button to return the units types.  \n ` +
                ` 3. Select the units type.  \n ` +
                ` 4. Save and close the node as required  \n ` +
                `   \n ` +
                `### Point Low Scale\n ` +
                `   \n ` +
                ` This is used in when the UI type is set as a 0-10dc or 4-20ma. The **High Scale**  must be set as well \n ` +
                ` For example if the point type is 0-10dc and the *Low Scale* is set to 0 and *High Scale* is set to 100 \   \n ` +
                ` the node output value when at 0vdc will return 0 and at 10vdc the node output value will return 100 \   \n ` +
                `   \n ` +
                `### Point High Scale\n ` +
                `   \n ` +
                ` This is used in when the UI type is set as a 0-10dc or 4-20ma (See **Low Scale** setting for more info).  \n ` +
                `   \n ` +
                `### Point Decimal Places\n ` +
                `   \n ` +
                ` The units can be set as required see steps below.  \n ` +
                `   \n ` +
                `### Point Offset\n ` +
                `   \n ` +
                ` Enter a float value to offset. This will apply an math add function to the original value  \n ` +
                ` Example original value is 20 and offset is -1 the **node output** value result will be 19 \n ` +
                `   \n ` +
                `### Point Decimal Places\n ` +
                `   \n ` +
                ` Enter a int value to Decimal. This will apply an math round function to the original value \n ` +
                ` Example original value is 99.9999 and the device places is set to 0  the **node output** value result will be 99 \n ` +
                `   \n ` +
                `### Math Function\n ` +
                `   \n ` +
                ` The units can be set as required see steps below.  \n ` +
                ` 1. **na** Will apply not math.  \n ` +
                ` 2. **add** Will add a **value** node output.  \n ` +
                ` 3. **subtract** Will subtract a **value** node output.  \n ` +
                ` 4. **multiply** Will multiply a **value** node output.  \n ` +
                ` 5. **divide** Will divide a **value** node output. \n ` +
                ` 6. **invert** Will invert the node output. Example in original value = 0 the node output value will = 1.   \n ` +
                `   \n ` +
                `###  History Settings Database Type\n ` +
                `   \n ` +
                ` The are two options for the database type. The data can either be pushed to influxDB or PostgreSQL.  \n ` +
                ` 1. Select required database type (if type is *Nube DB PostgreSQL* *no more steps are required*).  \n ` +
                ` 2. Enter DB details like IP, port, username and password(if type is *InfluxDB*)\n ` +
                `   \n ` +
                `#### History Settings History Type\n ` +
                `   \n ` +
                ` 1. **Change Of Value (COV)**.  \n ` +
                ` 2. **Periodic**.  \n ` +
                ` 3. **Trigger Only**.  \n ` +
                `   \n ` +
                `####  History Settings Local Storage Limit\n ` +
                `   \n ` +
                ` 1. **Change Of Value (COV)**.  \n ` +
                ` 2. **Periodic**.  \n ` +
                ` 3. **Trigger Only**.  \n ` +
                `   \n ` +
                `####  History Settings Round minutes\n ` +
                `   \n ` +
                ` 1. **Change Of Value (COV)**.  \n ` +
                ` 2. **Periodic**.  \n ` +
                ` 3. **Trigger Only**.  \n ` +
                `   \n ` +
                `### Alarm Settings\n ` +
                `   \n ` +
                ` to be added  \n ` +
                `   \n ` +
                `### Tag Settings\n ` +
                `   \n ` +
                ` to be added  \n `;
        this.addOutput('value', node_1.Type.NUMBER);
        this.addOutput('error', node_1.Type.STRING);
        this.addOutput('message', node_1.Type.STRING);
        this.settings['pointEnable'] = {
            description: 'Point enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['pointDebug'] = {
            description: 'Point Debug',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['pointNumber'] = {
            description: 'Point',
            value: 'DI1',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'DI1', text: `DI1` },
                    { value: 'DI2', text: `DI2` },
                    { value: 'DI3', text: `DI3` },
                    { value: 'DI4', text: `DI4` },
                    { value: 'DI5', text: `DI5` },
                    { value: 'DI6', text: `DI6` },
                    { value: 'DI7', text: `DI7` },
                    { value: 'UI1', text: `UI1` },
                    { value: 'UI2', text: `UI2` },
                    { value: 'UI3', text: `UI3` },
                    { value: 'UI4', text: `UI4` },
                    { value: 'UI5', text: `UI5` },
                    { value: 'UI6', text: `UI6` },
                    { value: 'UI7', text: `UI7` },
                ],
            },
        };
        this.settings['pointType'] = {
            description: 'Point Type',
            value: 1,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: POINT_TYPE.DIGITAL, text: `Digital` },
                    { value: POINT_TYPE.UI_DIGITAL, text: `UI-Digital` },
                    { value: POINT_TYPE._0_10DC, text: `0-10dc` },
                    { value: POINT_TYPE._0_20MA, text: `0-20ma` },
                    { value: POINT_TYPE._4_20MA, text: `4-20ma` },
                    { value: POINT_TYPE._10K_THERMISTOR, text: `10k-thermistor` },
                ],
                value: POINT_TYPE.DIGITAL,
            },
        };
        this.settings['value_group'] = {
            description: 'Point Settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.settings['lowScale'] = {
            description: 'Low scale',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['highScale'] = {
            description: 'High scale',
            value: 100,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['decimals'] = {
            description: 'Out value precision',
            value: 2,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['offset'] = {
            description: 'Out value offset',
            value: 0,
            type: node_1.SettingType.NUMBER,
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
                    { value: MathUtils_1.MATH_FUNC_TYPE.NUMBER_INVERT, text: 'invert' },
                ],
            },
            value: MathUtils_1.MATH_FUNC_TYPE.NA,
        };
        this.settings['mathValue'] = {
            description: 'Enter a value',
            value: 1,
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
        const isDigitalType = [POINT_TYPE.DIGITAL, POINT_TYPE.UI_DIGITAL];
        this.setSettingsConfig({
            groups: [
                { pointEnable: {}, pointDebug: {} },
                { pointNumber: {}, pointType: {} },
                { decimals: {}, offset: {} },
                { lowScale: {}, highScale: {} },
                { mathFunc: {}, mathValue: {} },
                { unitsType: {}, units: {} },
            ],
            conditions: {
                decimals: setting => {
                    const val = setting['pointType'].value;
                    return !isDigitalType.includes(val);
                },
                offset: setting => {
                    const val = setting['pointType'].value;
                    return !isDigitalType.includes(val);
                },
                lowScale: setting => {
                    const val = setting['pointType'].value;
                    return !isDigitalType.includes(val);
                },
                highScale: setting => {
                    const val = setting['pointType'].value;
                    return !isDigitalType.includes(val);
                },
                mathValue: setting => {
                    const val = setting['mathFunc'].value;
                    return ![MathUtils_1.MATH_FUNC_TYPE.NUMBER_INVERT, MathUtils_1.MATH_FUNC_TYPE.NA].includes(val);
                },
            },
        });
        this.addHistorySettingsConfig(0, false);
    }
    onAdded() {
        const _super = Object.create(null, {
            onAdded: { get: () => super.onAdded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onAdded.call(this);
            if (this.side !== container_1.Side.server)
                return;
            yield utils_1.default.sleep(1000);
            edge_utils_1.default.addPoint(this.getParentNode(), this);
        });
    }
    onAfterSettingsChange() {
        const _super = Object.create(null, {
            onAfterSettingsChange: { get: () => super.onAfterSettingsChange }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onAfterSettingsChange.call(this);
            if (this.side !== container_1.Side.server)
                return;
            this.nodeColour();
            const unitsType = this.settings['unitsType'].value;
            this.settings['units'].config = {
                items: BACnet_enums_units_1.default.unitType(unitsType),
            };
            this.broadcastSettingsToClients();
            setTimeout(() => {
                this.settings['pointDebug'].value = false;
            }, 120 * 1000);
        });
    }
    onRemoved() {
        super.onRemoved();
        edge_utils_1.default.removePoint(this.getParentNode(), this);
    }
    nodeColour() {
        if (this.settings['pointEnable'].value === false) {
            this.setNodeState(node_1.NodeState.INFO);
        }
        else
            this.setNodeState(node_1.NodeState.NORMAL);
    }
    sendPointValue(val) {
        const debug = this.settings['pointDebug'].value;
        if (debug) {
            this.setOutputData(0, val);
        }
        else
            this.setOutputData(0, val, true);
    }
    pointOffset(val) {
        return parseFloat(val) + parseFloat(this.settings['offset'].value);
    }
    pointCalcs(val) {
        const mathFunc = this.settings['mathFunc'].value;
        const mathValue = this.settings['mathValue'].value;
        const decimals = this.settings['decimals'].value;
        const pointType = this.settings['pointType'].value;
        const isDigitalType = [POINT_TYPE.DIGITAL, POINT_TYPE.UI_DIGITAL];
        let out;
        if (MathUtils_1.default.validateNumbers(val, mathValue)) {
            if (mathFunc !== MathUtils_1.MATH_FUNC_TYPE.NA) {
                if (!isDigitalType.includes(pointType)) {
                    out = MathUtils_1.default.mathSwitch(mathFunc, val, mathValue);
                    out = MathUtils_1.default.decimals(out, decimals);
                    out = this.pointOffset(out);
                    this.sendPointValue(out);
                }
                else {
                    out = MathUtils_1.default.mathSwitch(mathFunc, val, mathValue);
                    out = this.pointOffset(out);
                    this.sendPointValue(out);
                }
            }
            else {
                if (!isDigitalType.includes(pointType)) {
                    out = MathUtils_1.default.decimals(val, decimals);
                    out = this.pointOffset(out);
                }
                else {
                    out = val;
                }
                this.sendPointValue(out);
            }
        }
    }
    uiType(type, val, min_range, max_range) {
        const lowScale = this.settings['lowScale'].value;
        const highScale = this.settings['highScale'].value;
        switch (type) {
            case POINT_TYPE.DIGITAL:
                this.pointCalcs(edge_gpio_utils_1.default.diInvert(val));
                break;
            case POINT_TYPE.UI_DIGITAL:
                this.pointCalcs(edge_gpio_utils_1.default.uiAsDI(val));
                break;
            case POINT_TYPE._0_10DC:
                const limitValDc = utils_1.default.clamp(val, 0, highScale);
                this.pointCalcs(edge_gpio_utils_1.default.scaleFromGPIOValue(limitValDc, lowScale, highScale));
                break;
            case POINT_TYPE._0_20MA:
                const limitValMaZero = utils_1.default.clamp(val, 0, highScale);
                this.pointCalcs(edge_gpio_utils_1.default.scaleFromGPIOValue(limitValMaZero, lowScale, highScale));
                break;
            case POINT_TYPE._4_20MA:
                const limitValMaFour = edge_gpio_utils_1.default.scaleUI420ma(val, min_range, max_range);
                this.pointCalcs(edge_gpio_utils_1.default.scale420maToRange(limitValMaFour, lowScale, highScale));
                break;
            case POINT_TYPE._10K_THERMISTOR:
                this.pointCalcs(edge_10k_sensor_calc_1.default.calc10kThermistor(val));
                break;
        }
    }
    subscribe({ action, payload }) {
        switch (action) {
            case edge_constant_1.SEND_PAYLOAD_TO_CHILD:
                if (this.settings['pointEnable'].value === false)
                    return;
                const pointType = this.settings['pointType'].value;
                const pointNumber = this.settings['pointNumber'].value;
                let out;
                let min_range;
                let max_range;
                if (pointType === POINT_TYPE.DIGITAL) {
                    if (!['DI1', 'DI2', 'DI3', 'DI4', 'DI5', 'DI6', 'DI7'].includes(pointNumber))
                        return;
                    try {
                        for (let val of [payload]) {
                            out = val.pointsDI['4_val'][this.settings['pointNumber'].value].val;
                        }
                        this.uiType(pointType, out, payload);
                    }
                    catch (err) {
                        this.debugErr(err);
                    }
                }
                else {
                    if (!['UI1', 'UI2', 'UI3', 'UI4', 'UI5', 'UI6', 'UI7'].includes(pointNumber))
                        return;
                    try {
                        for (let val of [payload]) {
                            out = val.pointsUI['4_val'][this.settings['pointNumber'].value].val;
                            min_range = val.pointsUI['6_min_range'][this.settings['pointNumber'].value];
                            max_range = val.pointsUI['7_max_range'][this.settings['pointNumber'].value];
                        }
                        this.uiType(pointType, out, min_range, max_range);
                    }
                    catch (err) {
                        this.debugErr(err);
                    }
                }
                break;
            default:
                this.debugWarn("Request action doesn't match");
        }
    }
}
container_1.Container.registerNodeType(constants_1.EDGE_28_INPUT, Edge28InputPointNode, constants_1.EDGE_28_NETWORK);
//# sourceMappingURL=edge-28-input.js.map