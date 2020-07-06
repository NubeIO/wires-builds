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
const container_node_1 = require("../../../container-node");
const container_1 = require("../../../container");
const utils_1 = require("../../../utils");
const axios_1 = require("axios");
const edge_utils_1 = require("./edge-utils");
const edge_gpio_utils_1 = require("./edge-gpio-utils");
const BACnet_enums_units_1 = require("../../../utils/points/BACnet-enums-units");
const edge_constant_1 = require("./edge-constant");
const history_utils_1 = require("../../../utils/points/history-utils");
class Edge28OutputPointNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.uuid = null;
        this.deviceContainerID = null;
        this.topic = null;
        this.newSetting = false;
        this.inInput = 0;
        this.inAlarmTrigger = 1;
        this.inHistoryTrigger = 2;
        this.title = 'Edge IO 28 Output';
        this.description =
            `## Description\n ` +
                ` The is node is used in conjunction with the edge-io-28. This node uses an internal rest-api to talk to the edge-io-28\n ` +
                `   \n ` +
                `## Digital Output\n ` +
                `   \n ` +
                ` The DOs can be used to drive a 0-12vdc relay (5 off) or an onboard Normally Open Relay (2 off)\n ` +
                `### DOs  \n ` +
                `   \n ` +
                ` The input of the node can will drive the output on/true  with any value > 1 or a true value \n ` +
                ` Any value < 0 or a false will drive the output off/false \n ` +
                `### Relay Output  \n ` +
                `   \n ` +
                ` The input of the node can will drive the output on/true  with any value > 1 or a true value \n ` +
                ` Any value < 0 or a false will drive the output off/false \n ` +
                `## Universal Output\n ` +
                `   \n ` +
                ` The Universal Output or Analogue Output (7 off) has a voltage range of 0 to 12vdc\n ` +
                ` The UOs can be used as an AO floating point 0/10dc or a binary on/off 0-12dc \n ` +
                `### UOs as 0/10dc  \n ` +
                `   \n ` +
                ` When configured as a UOs a the node input value is a float value between 0/100 to drive a voltage of 0/10dc \n ` +
                `### UOs as On/Off  \n ` +
                `   \n ` +
                ` The input of the node can will drive the output on/true  with any value > 1 or a true value \n ` +
                ` Any value < 0 or a false will drive the output off/false \n ` +
                `## Point Configuration\n ` +
                `### Point Enable\n ` +
                `   \n ` +
                ` The point enable will disable any new value being sent to the node **output**  \n ` +
                `### Point Selection\n ` +
                `   \n ` +
                ` 1. Select the **Point Type** for example UO  \n ` +
                ` 2. Select the **Point Number** for example UO-1   \n ` +
                `### Point Settings\n ` +
                `   \n ` +
                ` The DOs can be used to drive a 0-12vdc relay (5 off) or an onboard Normally Open Relay (2 off)\n ` +
                `### Point Units\n ` +
                `   \n ` +
                ` The units can be set as required see steps below.  \n ` +
                ` 1. Select the **Units Category**.  \n ` +
                ` 2. Lock (**lock icon**) the node setting's and hit the **save** button to return the units types.  \n ` +
                ` 3. Select the units type.  \n ` +
                ` 4. Save and close the node as required  \n ` +
                `###  History Settings Database Type\n ` +
                `   \n ` +
                ` The are two options for the database type. The data can either be pushed to influxDB or PostgreSQL.  \n ` +
                ` 1. Select required database type (if type is *Nube DB PostgreSQL* *no more steps are required*).  \n ` +
                ` 2. Enter DB details like IP, port, username and password(if type is *InfluxDB*)\n ` +
                `#### History Settings History Type\n ` +
                `   \n ` +
                ` 1. **Change Of Value (COV)**.  \n ` +
                ` 2. **Periodic**.  \n ` +
                ` 3. **Trigger Only**.  \n ` +
                `####  History Settings Local Storage Limit\n ` +
                `   \n ` +
                ` 1. **Change Of Value (COV)**.  \n ` +
                ` 2. **Periodic**.  \n ` +
                ` 3. **Trigger Only**.  \n ` +
                `####  History Settings Round minutes\n ` +
                `   \n ` +
                ` 1. **Change Of Value (COV)**.  \n ` +
                ` 2. **Periodic**.  \n ` +
                ` 3. **Trigger Only**.  \n ` +
                `### Alarm Settings\n ` +
                `   \n ` +
                ` to be added  \n ` +
                `### Tag Settings\n ` +
                `   \n ` +
                ` to be added  \n `;
        this.addInput('input', node_1.Type.NUMBER);
        this.addOutput('output', node_1.Type.NUMBER);
        this.addOutput('error', node_1.Type.STRING);
        this.properties['pointVal'] = null;
        this.settings['pointEnable'] = {
            description: 'Point enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['pointType'] = {
            description: 'Point Type',
            value: 1,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 1, text: `DO` },
                    { value: 2, text: `UO As Digital` },
                    { value: 3, text: `UO As 0-10dc` },
                ],
            },
        };
        this.settings['pointNumber'] = {
            description: 'Point',
            value: 'UO1',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'UO1', text: `UO1` },
                    { value: 'UO2', text: `UO2` },
                    { value: 'UO3', text: `UO3` },
                    { value: 'UO4', text: `UO4` },
                    { value: 'UO5', text: `UO5` },
                    { value: 'UO6', text: `UO6` },
                    { value: 'UO7', text: `UO7` },
                    { value: 'DO1', text: `DO1` },
                    { value: 'DO2', text: `DO2` },
                    { value: 'DO3', text: `DO3` },
                    { value: 'DO4', text: `DO4` },
                    { value: 'DO5', text: `DO5` },
                    { value: 'R1', text: `R1` },
                    { value: 'R2', text: `R2` },
                ],
            },
        };
        this.settings['units_group'] = {
            description: 'Units (Save to get units)',
            type: node_1.SettingType.GROUP,
        };
        this.settings['unitsType'] = {
            description: 'Units Category',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: BACnet_enums_units_1.default.unitCategory,
            },
        };
        this.settings['units'] = {
            description: 'Units Type',
            value: BACnet_enums_units_1.default.COMMON_METRIC.NO_UNITS,
            type: node_1.SettingType.DROPDOWN,
        };
        history_utils_1.default.addHistorySettings(this);
        this.setSettingsConfig({
            groups: [
                { pointNumber: {}, pointType: {} },
                { mathFunc: {}, mathValue: {} },
                { unitsType: {}, units: {} },
            ],
            conditions: {
                mathValue: setting => {
                    const val = setting['mathFunc'].value;
                    return ![10, 0].includes(val);
                },
            },
        });
        history_utils_1.default.addHistorySettingsConfig(this);
    }
    writePointValue(host, port, apiVer, pointType, pointId, val, priority) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${utils_1.default.buildUrl(host, port)}/api/${apiVer}/write/${pointType}/${pointId}/${val}/${priority}`;
            const pointValue = yield axios_1.default.get(url);
            return pointValue.data;
        });
    }
    onCreated() {
        super.onCreated();
    }
    onAdded() {
        if (this.side !== container_1.Side.server)
            return;
        this.EXECUTE_INTERVAL = 60000;
        this.lastSendTime = new Date().valueOf();
        this.onInputUpdated();
        edge_utils_1.default.addPoint(this.getParentNode(), this);
    }
    onExecute() {
        if (this.side !== container_1.Side.server)
            return;
        if (new Date().valueOf() - 1000 > this.lastSendTime)
            this.onInputUpdated();
    }
    pointType(type) {
        switch (type) {
            case 1:
                return 'do';
            case 2:
                return 'uo';
            case 3:
                return 'uo';
            default:
                this.debugWarn('Unknown type of object');
        }
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        const inputVal = this.getInputData(this.inInput);
        history_utils_1.default.doHistoryFunctions(this);
        this.apiCall(inputVal);
    }
    apiCall(inputVal) {
        if (this.side !== container_1.Side.server)
            return;
        if (this.settings['pointEnable'].value === false)
            return;
        const pointType = this.pointType(this.settings['pointType'].value);
        const pointNumber = this.settings['pointNumber'].value;
        let outVal = null;
        const nodeVal = inputVal;
        if (inputVal === undefined || inputVal === null)
            return;
        if (this.settings['pointType'].value === 1) {
            if (typeof inputVal === 'boolean') {
                outVal = inputVal ? 1 : 0;
            }
            else if (typeof inputVal === 'string') {
                if (inputVal === '1') {
                    outVal = 1;
                }
                else if (inputVal === '0')
                    outVal = 0;
            }
            else if (typeof inputVal === 'number') {
                if (inputVal >= 1) {
                    outVal = 1;
                }
                else if (inputVal < 1)
                    outVal = 0;
            }
            else
                this.debugInfo(`ERROR: input value must be a int 1 or 0 or a bool`);
        }
        if (this.settings['pointType'].value === 2) {
            if (typeof inputVal === 'boolean') {
                if (inputVal) {
                    outVal = 0;
                }
                else
                    outVal = 100;
            }
            else if (typeof inputVal === 'string') {
                if (inputVal === '1') {
                    outVal = 0;
                }
                else if (inputVal === '0')
                    outVal = 100;
            }
            else if (typeof inputVal === 'number') {
                if (inputVal >= 1) {
                    outVal = 0;
                }
                else if (inputVal < 1)
                    outVal = 100;
            }
            else
                this.debugInfo(`ERROR: input value must be a int 1 or 0 or a bool`);
        }
        if (this.settings['pointType'].value === 3) {
            if (typeof inputVal === 'number') {
                if (inputVal >= 100)
                    outVal = edge_gpio_utils_1.default.scaleToGPIOValue(100, 0, 100);
                else {
                    inputVal = inputVal * 0.9839;
                    outVal = edge_gpio_utils_1.default.scaleToGPIOValue(inputVal, 0, 100);
                }
            }
            else if (typeof inputVal === 'string') {
                this.debugInfo(`ERROR: input value must be a float`);
            }
        }
        this.writePointValue(edge_constant_1.edgeIp, edge_constant_1.edgePort, edge_constant_1.edgeApiVer, pointType, pointNumber, outVal, 16)
            .then(e => {
            this.setOutputData(0, nodeVal, true);
            this.lastSendTime = new Date().valueOf();
        })
            .catch(err => this.debugInfo(`ERROR: getting edge point type: ${pointType} ${err}`));
    }
    onRemoved() {
        super.onRemoved();
        edge_utils_1.default.removePoint(this.getParentNode(), this);
    }
    onAfterSettingsChange() {
        history_utils_1.default.historyFunctionsForAfterSettingsChange(this, this.settings['pointName'].value || this.settings['pointNumber'].value);
        const unitsType = this.settings['unitsType'].value;
        this.settings['units'].config = {
            items: BACnet_enums_units_1.default.unitType(unitsType),
        };
        this.broadcastSettingsToClients();
        this.onInputUpdated();
        if (this.side !== container_1.Side.server)
            return;
    }
}
container_1.Container.registerNodeType('protocols/nube/edge-28-output', Edge28OutputPointNode);
//# sourceMappingURL=edge-28-output.js.map