"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_node_1 = require("../../../container-node");
const container_1 = require("../../../container");
const edge_constant_1 = require("./edge-constant");
const edge_utils_1 = require("./edge-utils");
const edge_gpio_utils_1 = require("./edge-gpio-utils");
const edge_10k_sensor_calc_1 = require("./edge-10k-sensor-calc");
const BACnet_enums_units_1 = require("../../../utils/points/BACnet-enums-units");
const history_config_1 = require("../../../utils/points/history-config");
const utils_1 = require("../../../utils");
const constants_1 = require("../../../constants");
const MathUtils_1 = require("../../../utils/MathUtils");
class Edge28InputPointNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
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
                    { value: 1, text: `Digital` },
                    { value: 2, text: `UI-Digital` },
                    { value: 3, text: `0-10dc` },
                    { value: 4, text: `0-20ma` },
                    { value: 5, text: `4-20ma` },
                    { value: 6, text: `10k-thermistor` },
                ],
                value: 1,
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
            value: 0,
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
        history_config_1.default.addHistorySettings(this);
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
                    return ![1, 2].includes(val);
                },
                offset: setting => {
                    const val = setting['pointType'].value;
                    return ![1, 2].includes(val);
                },
                lowScale: setting => {
                    const val = setting['pointType'].value;
                    return ![1, 2].includes(val);
                },
                highScale: setting => {
                    const val = setting['pointType'].value;
                    return ![1, 2].includes(val);
                },
                mathValue: setting => {
                    const val = setting['mathFunc'].value;
                    return ![10, 0].includes(val);
                },
            },
        });
        history_config_1.default.addHistorySettingsConfig(this, 0, false);
    }
    onCreated() {
        super.onCreated();
        history_config_1.default.historyOnCreated(this);
    }
    onAdded() {
        super.onAdded();
        if (this.side !== container_1.Side.server)
            return;
        try {
            edge_utils_1.default.addPoint(this.getParentNode(), this);
        }
        catch (error) { }
        history_config_1.default.historyFunctionsForAfterSettingsChange(this, this.settings['pointName'].value || this.settings['pointNumber'].value);
    }
    onAfterSettingsChange(oldSettings) {
        super.onAfterSettingsChange(oldSettings);
        history_config_1.default.historyFunctionsForAfterSettingsChange(this, this.settings['pointName'].value || this.settings['pointNumber'].value);
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
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        history_config_1.default.doHistoryFunctions(this);
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
        history_config_1.default.doHistoryFunctions(this);
    }
    pointOffset(val) {
        return parseFloat(val) + parseFloat(this.settings['offset'].value);
    }
    pointCalcs(val) {
        const mathFunc = this.settings['mathFunc'].value;
        const mathValue = this.settings['mathValue'].value;
        const decimals = this.settings['decimals'].value;
        const pointType = this.settings['pointType'].value;
        let out;
        if (MathUtils_1.default.validateNumbers(val, mathValue)) {
            if (mathFunc !== 0) {
                if (![1, 2].includes(pointType)) {
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
                if (![1, 2].includes(pointType)) {
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
            case 1:
                this.pointCalcs(edge_gpio_utils_1.default.diInvert(val));
                break;
            case 2:
                this.pointCalcs(edge_gpio_utils_1.default.uiAsDI(val));
                break;
            case 3:
                const limitValDc = utils_1.default.clamp(val, 0, highScale);
                this.pointCalcs(edge_gpio_utils_1.default.scaleFromGPIOValue(limitValDc, lowScale, highScale));
                break;
            case 4:
                const limitValMaZero = utils_1.default.clamp(val, 0, highScale);
                this.pointCalcs(edge_gpio_utils_1.default.scaleFromGPIOValue(limitValMaZero, lowScale, highScale));
                break;
            case 5:
                const limitValMaFour = edge_gpio_utils_1.default.scaleUI420ma(val, min_range, max_range);
                this.pointCalcs(edge_gpio_utils_1.default.scale420maToRange(limitValMaFour, lowScale, highScale));
                break;
            case 6:
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
                if (pointType === 1) {
                    if (!['DI1', 'DI2', 'DI3', 'DI4', 'DI5', 'DI6', 'DI7'].includes(pointNumber))
                        return;
                    try {
                        for (let val of [payload]) {
                            out = val.pointsDI['4_val'][this.settings['pointNumber'].value].val;
                        }
                        this.uiType(pointType, out, payload);
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
                else if (pointType >= 2) {
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
                        console.log(err);
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