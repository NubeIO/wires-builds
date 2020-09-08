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
const bacnet_utils_1 = require("./bacnet-utils");
const constants_1 = require("../../../constants");
const bacnet_constant_1 = require("./bacnet-constant");
const utils_1 = require("../../../utils");
const HistoryBase_1 = require("../../history/HistoryBase");
class BACnetPoint extends HistoryBase_1.default {
    constructor() {
        super();
        this.dynamicInputsExist = false;
        this.dynamicSettingsExist = false;
        this.dynamicInputStartPosition = 2;
        this.dynamicMinInputs = 0;
        this.nullableInputs = true;
        this.dynamicOutputsExist = false;
        this.dynamicInputsStartName = 'in';
        this.dynamicOutputsStartName = 'out';
        this.dynamicInputsType = node_io_1.Type.NUMBER;
        this.points = [];
        this.obj = [];
        this.title = 'BACnet Point';
        this.description =
            'All bacnet-point nodes should be added within the bacnet-device container node. Configuration of BACnet points are set from settings.  If the bacnet-network, and bacnet-device are configured correctly, the BACnet points will be available to select from the ‘Select a point’ setting; otherwise the point can be set manually. For information on History settings, see History/History node. Configuration is the same for bacnet-point histories.';
        this.addInput('input', node_io_1.Type.NUMBER);
        this.addOutput('output', node_io_1.Type.STRING);
        this.addOutput('output json', node_io_1.Type.STRING);
        this.addOutput('error', node_io_1.Type.STRING);
        this.settings['pointEnable'] = {
            description: 'Point enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['pointWriteEnable'] = {
            description: 'Point write enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['manualPoint'] = {
            description: 'Add point manually',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['pointsList'] = {
            description: 'Select a point',
            value: null,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [],
            },
        };
        this.settings['objectType'] = {
            description: 'Output type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'analog-input' },
                    { value: 1, text: 'analog-output' },
                    { value: 2, text: 'analog-value' },
                    { value: 3, text: 'binary-input' },
                    { value: 4, text: 'binary-output' },
                    { value: 5, text: 'binary-value' },
                    { value: 13, text: 'multi-state-input' },
                    { value: 14, text: 'multi-state-output' },
                    { value: 19, text: 'multi-state-value' },
                ],
            },
            value: 0,
        };
        this.settings['objectInstance'] = {
            description: 'Point ID',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['priority'] = {
            description: 'Priority Number',
            value: 16,
            type: node_1.SettingType.NUMBER,
        };
        this.setSettingsConfig({
            conditions: {
                pointsList: setting => {
                    return !setting['manualPoint'].value;
                },
                objectType: setting => {
                    return setting['manualPoint'].value;
                },
            },
        });
        this.useInterval = false;
        this.properties['lastHistoryValue'] = null;
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
            yield utils_1.default.sleep(2000);
            this.points = bacnet_utils_1.default.getPoints(this.getParentNode());
            this.setPointsListItems();
            this.getPresentValue();
            bacnet_utils_1.default.addPoint(this.getParentNode(), this);
        });
    }
    onInputUpdated() {
        const _super = Object.create(null, {
            onInputUpdated: { get: () => super.onInputUpdated }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onInputUpdated.call(this);
            if (this.side !== container_1.Side.server)
                return;
            let objectType;
            let objectInstance;
            const value = this.getInputData(0);
            const priority = this.settings['priority'].value;
            const manualPoint = this.settings['manualPoint'].value;
            const selectPoint = this.settings['pointsList'].value;
            let pointWriteEnable = this.settings['pointWriteEnable'].value;
            if (manualPoint) {
                objectType = this.settings['objectType'].value;
                objectInstance = this.settings['objectInstance'].value;
            }
            if (selectPoint) {
                objectType = selectPoint.type;
                objectInstance = selectPoint.instance;
            }
            if (value === undefined)
                return;
            if (pointWriteEnable === false)
                return;
            bacnet_utils_1.default.writePresentValue(this.getParentNode(), [objectType, objectInstance, value, priority]);
        });
    }
    onAfterSettingsChange() {
        const _super = Object.create(null, {
            onAfterSettingsChange: { get: () => super.onAfterSettingsChange }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onAfterSettingsChange.call(this);
            this.getPresentValue();
            const getNetworkNumber = bacnet_utils_1.default.getNetworkSettings(this.getParentNode());
            if (getNetworkNumber) {
                if (!isNaN(getNetworkNumber.networkNumber.value)) {
                    this.networkNumber = getNetworkNumber.networkNumber.value;
                }
            }
        });
    }
    onRemoved() {
        super.onRemoved();
        bacnet_utils_1.default.removePoint(this.getParentNode(), this);
    }
    getPresentValue() {
        if (this.side !== container_1.Side.server)
            return;
        let selectPoint = this.settings['pointsList'].value;
        const manualPoint = this.settings['manualPoint'].value;
        const objectType = this.settings['objectType'].value;
        const objectInstance = this.settings['objectInstance'].value;
        if (manualPoint) {
            selectPoint = { type: objectType, instance: objectInstance };
        }
        if (selectPoint) {
            bacnet_utils_1.default.getPresentValue(this.getParentNode(), selectPoint).then(msg => {
                this.setPointValue(msg);
            });
        }
    }
    setPointValue(msg) {
        let pointValue = msg.value.values[0].value;
        let objectType;
        let objectInstance;
        let pointEnable = this.settings['pointEnable'].value;
        let pointWriteEnable = this.settings['pointWriteEnable'].value;
        const priority = this.settings['priority'].value;
        const manualPoint = this.settings['manualPoint'].value;
        const selectPoint = this.settings['pointsList'].value;
        if (manualPoint) {
            objectType = this.settings['objectType'].value;
            objectInstance = this.settings['objectInstance'].value;
        }
        if (selectPoint) {
            objectType = selectPoint.type;
            objectInstance = selectPoint.instance;
        }
        const json = {
            name: this.name,
            pointValue: pointValue,
            enable: pointEnable,
            pointWriteEnable: pointWriteEnable,
            objectType: objectType,
            objectInstance: objectInstance,
            priority: priority
        };
        if (msg.value) {
            this.setOutputData(0, pointValue, true);
            this.setOutputData(1, json, true);
            this.setOutputData(2, null);
        }
        else {
            this.setOutputData(0, null, true);
            this.setOutputData(1, null, true);
            if (msg.error) {
                this.setOutputData(2, 'Error on reading value');
            }
        }
    }
    setPointsListItems() {
        this.settings['pointsList'].config.items = this.points.map(point => {
            return {
                value: { type: point.type, instance: point.objectInfo },
                text: `${point.name} -> ${this.readObjectName(point.type)}: ${point.objectInfo}`,
            };
        });
        this.persistConfiguration();
        this.broadcastSettingsToClients();
    }
    subscribe({ action, payload }) {
        switch (action) {
            case bacnet_constant_1.SEND_PAYLOAD_TO_CHILD:
                this.points = payload.points;
                this.setPointsListItems();
                break;
            case bacnet_constant_1.SEND_POINT_VALUE:
                this.setPointValue(payload);
                break;
            default:
                this.debugWarn("Request action doesn't match");
        }
    }
    readObjectName(type) {
        switch (type) {
            case 0:
                return 'AI';
            case 1:
                return 'AO';
            case 2:
                return 'AV';
            case 3:
                return 'BI';
            case 4:
                return 'BO';
            case 5:
                return 'BV';
            case 8:
                return 'Device';
            case 13:
                return 'MSI';
            case 14:
                return 'MSO';
            case 19:
                return 'MSV';
            default:
                this.debugWarn('Unknown type of object');
        }
    }
}
container_1.Container.registerNodeType(constants_1.BACNET_POINT, BACnetPoint, constants_1.BACNET_DEVICE);
//# sourceMappingURL=bacnet-point.js.map