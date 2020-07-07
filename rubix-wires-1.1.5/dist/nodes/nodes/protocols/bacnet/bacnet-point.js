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
const container_node_1 = require("../../../container-node");
const bacnet_utils_1 = require("./bacnet-utils");
const constants_1 = require("../../../constants");
const bacnet_constant_1 = require("./bacnet-constant");
const utils_1 = require("../../../utils");
const history_config_1 = require("../../../utils/points/history-config");
class BACnetPoint extends container_node_1.ContainerNode {
    constructor(ContainerNode) {
        super(ContainerNode);
        this.dynamicInputsExist = false;
        this.dynamicSettingsExist = false;
        this.dynamicInputStartPosition = 2;
        this.dynamicMinInputs = 0;
        this.nullableInputs = true;
        this.dynamicOutputsExist = false;
        this.dynamicInputsStartName = 'in';
        this.dynamicOutputsStartName = 'out';
        this.dynamicInputsType = node_1.Type.NUMBER;
        this.points = [];
        this.obj = [];
        this.title = 'BACnet Point';
        this.description =
            'All bacnet-point nodes should be added within the bacnet-device container node. Configuration of BACnet points are set from settings.  If the bacnet-network, and bacnet-device are configured correctly, the BACnet points will be available to select from the ‘Select a point’ setting; otherwise the point can be set manually. For information on History settings, see History/History node. Configuration is the same for bacnet-point histories.';
        this.addInput('input', node_1.Type.NUMBER);
        this.addOutput('output', node_1.Type.STRING);
        this.addOutput('out bytes', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
        this.settings['pointEnable'] = {
            description: 'Point enable',
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
        history_config_1.default.addHistorySettings(this);
        this.setSettingsConfig({
            groups: [
                { host: { weight: 3 }, port: { weight: 1 } },
                { user: {}, password: {} },
                { period: { weight: 2 }, periodUnits: {} },
            ],
            conditions: {
                pointsList: setting => {
                    return !setting['manualPoint'].value;
                },
                objectType: setting => {
                    return setting['manualPoint'].value;
                },
                user: setting => {
                    return !!setting['authentication'].value;
                },
                password: setting => {
                    return !!setting['authentication'].value;
                },
            },
        });
        history_config_1.default.addHistorySettingsConfig(this);
        this.useInterval = false;
        this.properties['lastHistoryValue'] = null;
    }
    onCreated() {
        history_config_1.default.historyOnCreated(this);
    }
    onAdded() {
        const _super = Object.create(null, {
            onAdded: { get: () => super.onAdded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onAdded.call(this);
            this.name = `BACnet Point: cid_${this.container.id.toString()}_id${this.id.toString()}`;
            if (this.side !== container_1.Side.server)
                return;
            this.points = bacnet_utils_1.default.getPoints(this.getParentNode());
            this.setPointsListItems();
            yield utils_1.default.sleep(1000);
            this.getPresentValue();
            bacnet_utils_1.default.addPoint(this.getParentNode(), this);
        });
    }
    onRemoved() {
        super.onRemoved();
        bacnet_utils_1.default.removePoint(this.getParentNode(), this);
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        history_config_1.default.doHistoryFunctions(this).then();
        let objectType;
        let objectInstance;
        const value = this.getInputData(0);
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
        bacnet_utils_1.default.writePresentValue(this.getParentNode(), [objectType, objectInstance, value, priority]);
    }
    onAfterSettingsChange() {
        history_config_1.default.historyFunctionsForAfterSettingsChange(this, this.settings['pointName'].value).then();
        this.getPresentValue();
        const getNetworkNumber = bacnet_utils_1.default.getNetworkSettings(this.getParentNode());
        if (getNetworkNumber) {
            if (!isNaN(getNetworkNumber.networkNumber.value)) {
                this.networkNumber = getNetworkNumber.networkNumber.value;
            }
        }
        this.onInputUpdated();
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
        if (msg.value) {
            this.setOutputData(0, msg.value.values[0].value, true);
            this.setOutputData(2, null);
        }
        else {
            this.setOutputData(0, null, true);
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
    emitResult(id, out) {
        this.setOutputData(id, out);
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