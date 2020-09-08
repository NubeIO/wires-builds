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
const node_io_1 = require("../../../node-io");
const edge_utils_1 = require("./edge-utils");
const edge_gpio_utils_1 = require("./edge-gpio-utils");
const BACnet_enums_units_1 = require("../../../utils/points/BACnet-enums-units");
const edge_constant_1 = require("./edge-constant");
const constants_1 = require("../../../constants");
const HistoryBase_1 = require("../../history/HistoryBase");
const edge_28_1 = require("../../../utils/help/protocols/edge-28");
const helper_1 = require("../../../../utils/helper");
var OUTPUT_POINT_TYPE;
(function (OUTPUT_POINT_TYPE) {
    OUTPUT_POINT_TYPE[OUTPUT_POINT_TYPE["DO"] = 1] = "DO";
    OUTPUT_POINT_TYPE[OUTPUT_POINT_TYPE["UO_AS_DIGITAL"] = 2] = "UO_AS_DIGITAL";
    OUTPUT_POINT_TYPE[OUTPUT_POINT_TYPE["UO_AS_0_10DC"] = 3] = "UO_AS_0_10DC";
})(OUTPUT_POINT_TYPE || (OUTPUT_POINT_TYPE = {}));
var OUTPUT_POINT_TYPE_TEXT;
(function (OUTPUT_POINT_TYPE_TEXT) {
    OUTPUT_POINT_TYPE_TEXT["DO"] = "DO";
    OUTPUT_POINT_TYPE_TEXT["UO_AS_DIGITAL"] = "UO As Digital";
    OUTPUT_POINT_TYPE_TEXT["UO_AS_0_10DC"] = "UO As 0-10dc";
})(OUTPUT_POINT_TYPE_TEXT || (OUTPUT_POINT_TYPE_TEXT = {}));
class Edge28OutputPointNode extends HistoryBase_1.default {
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
        this.description = edge_28_1.default.NetworkDesc;
        this.addInput('input', node_io_1.Type.ANY);
        this.addOutput('output', node_io_1.Type.NUMBER);
        this.addOutput('output-json', node_io_1.Type.JSON);
        this.properties['pointVal'] = null;
        this.settings['pointEnable'] = {
            description: 'Point enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['pointType'] = {
            description: 'Point Type',
            value: OUTPUT_POINT_TYPE.DO,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: OUTPUT_POINT_TYPE.DO, text: OUTPUT_POINT_TYPE_TEXT.DO },
                    { value: OUTPUT_POINT_TYPE.UO_AS_DIGITAL, text: OUTPUT_POINT_TYPE_TEXT.UO_AS_DIGITAL },
                    { value: OUTPUT_POINT_TYPE.UO_AS_0_10DC, text: OUTPUT_POINT_TYPE_TEXT.UO_AS_0_10DC },
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
        this.addHistorySettingsConfig();
    }
    onAdded() {
        super.onAdded();
        this.updateTitle();
        if (this.side !== container_1.Side.server)
            return;
        this.EXECUTE_INTERVAL = 60000;
        this.lastSendTime = new Date().valueOf();
        this.inputChange();
    }
    onExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            if (new Date().valueOf() - 1000 > this.lastSendTime)
                yield this.onInputUpdated();
        });
    }
    pointType(type) {
        switch (type) {
            case OUTPUT_POINT_TYPE.DO:
                return 'do';
            case OUTPUT_POINT_TYPE.UO_AS_DIGITAL:
                return 'uo';
            case OUTPUT_POINT_TYPE.UO_AS_0_10DC:
                return 'uo';
            default:
                this.debugWarn('Unknown type of object');
        }
    }
    pointTypeText(type) {
        switch (type) {
            case OUTPUT_POINT_TYPE.DO:
                return OUTPUT_POINT_TYPE_TEXT.DO;
            case OUTPUT_POINT_TYPE.UO_AS_DIGITAL:
                return OUTPUT_POINT_TYPE_TEXT.UO_AS_DIGITAL;
            case OUTPUT_POINT_TYPE.UO_AS_0_10DC:
                return OUTPUT_POINT_TYPE_TEXT.UO_AS_0_10DC;
            default:
                this.debugWarn('Unknown type of object');
        }
    }
    onInputUpdated() {
        const _super = Object.create(null, {
            onInputUpdated: { get: () => super.onInputUpdated }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onInputUpdated.call(this);
            this.inputChange();
        });
    }
    onRemoved() {
        super.onRemoved();
    }
    onAfterSettingsChange() {
        const _super = Object.create(null, {
            onAfterSettingsChange: { get: () => super.onAfterSettingsChange }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onAfterSettingsChange.call(this);
            this.updateTitle();
            const unitsType = this.settings['unitsType'].value;
            this.settings['units'].config = {
                items: BACnet_enums_units_1.default.unitType(unitsType),
            };
            this.broadcastSettingsToClients();
            this.inputChange();
        });
    }
    inputChange() {
        if (this.side !== container_1.Side.server)
            return;
        const inputVal = this.getInputData(this.inInput);
        this.apiCall(inputVal);
    }
    updateTitle() {
        const pointNumber = this.settings['pointNumber'].value;
        this.title = `Edge-28-Output: (${pointNumber} as ${this.pointTypeText(this.settings['pointType'].value)})`;
        this.broadcastTitleToClients();
    }
    sendJson() {
        return {
            name: this.name,
            pointValue: this.properties['pointVal'],
            enable: this.settings['pointEnable'].value,
            units: this.settings['units'].value,
            pointNumber: this.settings['pointNumber'].value,
            pointType: this.settings['pointType'].value,
        };
    }
    apiCall(inputVal) {
        if (this.side !== container_1.Side.server)
            return;
        if (this.settings['pointEnable'].value === false)
            return;
        const pointNumber = this.settings['pointNumber'].value;
        let outVal = null;
        const nodeVal = inputVal;
        if (inputVal === undefined || inputVal === null)
            return;
        if (this.settings['pointType'].value === OUTPUT_POINT_TYPE.DO) {
            if (typeof inputVal === 'boolean') {
                outVal = inputVal ? 1 : 0;
            }
            else if (typeof inputVal === 'string') {
                if (inputVal === '1' || inputVal === 'true') {
                    outVal = 1;
                }
                else if (inputVal === '0' || inputVal === 'false') {
                    outVal = 0;
                }
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
        else if (this.settings['pointType'].value === OUTPUT_POINT_TYPE.UO_AS_DIGITAL) {
            if (typeof inputVal === 'boolean') {
                if (inputVal) {
                    outVal = 0;
                }
                else
                    outVal = 100;
            }
            else if (typeof inputVal === 'string') {
                if (inputVal === '1' || inputVal === 'true') {
                    outVal = 0;
                }
                else if (inputVal === '0' || inputVal === 'false') {
                    outVal = 100;
                }
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
        else if (this.settings['pointType'].value === OUTPUT_POINT_TYPE.UO_AS_0_10DC) {
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
        if (helper_1.isNull(outVal))
            return;
        const pointType = this.pointType(this.settings['pointType'].value);
        edge_utils_1.default.writePointValue(edge_constant_1.edgeIp, edge_constant_1.edgePort, edge_constant_1.edgeApiVer, pointType, pointNumber, outVal, 16)
            .then(e => {
            this.properties['pointVal'] = nodeVal;
            this.setOutputData(0, nodeVal, true);
            this.setOutputData(1, this.sendJson(), true);
            this.lastSendTime = new Date().valueOf();
        })
            .catch(err => {
            this.debugInfo(`ERROR: getting edge point type: ${pointType} ${err}`);
        });
    }
}
container_1.Container.registerNodeType(constants_1.EDGE_28_OUTPUT, Edge28OutputPointNode, constants_1.EDGE_28_NETWORK);
//# sourceMappingURL=edge-28-output.js.map