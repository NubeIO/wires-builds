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
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const base_point_1 = require("./base-point");
const node_1 = require("../../node");
const time_utils_1 = require("../../utils/time-utils");
class NubeAPIInputPoint extends base_point_1.default {
    constructor() {
        super();
        this.dynamicInputsExist = false;
        this.dynamicOutputsExist = false;
        this.dynamicSettingsExist = false;
        this.title = 'Nube API Input';
        this.description =
            "This node is used to fetch point values from Nube devices.  Once the nube/login node is successfully authenticated, the API-Input nodes will have their settings updated with values from the connected Nube devices. Connected Nube devices can be selected from the ‘Select URL‘ setting dropdown.  ‘Select Point’ setting dropdown will be populated with the available points from the selected URL.  Ticking the ‘Show Advanced Options’ setting will add outputs to the node with extra information about the selected point.   ‘Interval’ is the update frequency (minimum 1 second). 'interval’ units can be configured from settings.  Maximum ‘interval’ setting is 587 hours.";
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addInputWithSettings('interval', node_io_1.Type.NUMBER, 5, 'Interval (minimum 1 second)', false);
        this.addOutput('name', node_io_1.Type.STRING);
        this.addOutput('value', node_io_1.Type.STRING);
        this.addOutput('lastUpdate', node_io_1.Type.STRING);
        this.addOutput('error', node_io_1.Type.STRING);
        this.settings['time'] = {
            description: 'Units',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'milliseconds', text: 'Milliseconds' },
                    { value: 'seconds', text: 'Seconds' },
                    { value: 'minutes', text: 'Minutes' },
                    { value: 'hours', text: 'Hours' },
                ],
            },
            value: 'seconds',
        };
        this.setSettingsConfig({
            groups: [{ interval: { weight: 2 }, time: {} }],
        });
        this.settings['advancedSetting'] = {
            description: 'Show Advanced Options',
            value: this.advancedSetting,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    init() {
        super.init();
        this.updateNodeOutputs();
    }
    onAdded() {
        super.onAdded();
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
        this.setExecuteInterval();
    }
    reload() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.fetchConnection();
                const point = yield this.fetchPoints(user);
                const data = yield this.fetchPointValue(user, point);
                this.setOutputs(data);
            }
            catch (e) {
                this.setErrorOutputs(e.message);
            }
            return null;
        });
    }
    onExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            yield this.reload();
        });
    }
    onAfterSettingsChange() {
        const _super = Object.create(null, {
            onInputUpdated: { get: () => super.onInputUpdated }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
            if (this.side !== container_1.Side.server) {
                return;
            }
            this.setExecuteInterval();
            this.updateNodeOutputs();
            this.updateNodeOutput();
            this.broadcastOutputsToClients();
            yield _super.onInputUpdated.call(this);
        });
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            this.setExecuteInterval();
            let trigger = this.getInputData(0);
            if (trigger && this.inputs[0].updated) {
                yield this.reload();
            }
            this.updateTitle();
            this.broadcastTitleToClients();
        });
    }
    setExecuteInterval() {
        let interval = this.getInputData(1);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        interval = Math.max(interval, 1000);
        this.EXECUTE_INTERVAL = interval;
    }
    updateTitle() {
        if (this.settings['point'].value)
            this.title = `Nube API Input (${this.settings['point'].value})`;
        else
            this.title = 'Nube API Input (unconfigured)';
    }
    updateNodeOutputs() {
        this.advancedSetting = this.settings['advancedSetting'].value;
        if (this.advancedSetting && !this.previousAdvancedSetting) {
            this.removeOutput(3);
            this.addOutput('unit', node_io_1.Type.STRING);
            this.addOutput('kind', node_io_1.Type.STRING);
            this.addOutput('type', node_io_1.Type.STRING);
            this.addOutput('scale', node_io_1.Type.STRING);
            this.addOutput('historyType', node_io_1.Type.STRING);
            this.addOutput('asObject', node_io_1.Type.JSON);
            this.addOutput('error', node_io_1.Type.STRING);
        }
        else if (!this.advancedSetting && this.previousAdvancedSetting) {
            this.removeOutput(3);
            this.removeOutput(4);
            this.removeOutput(5);
            this.removeOutput(6);
            this.removeOutput(7);
            this.removeOutput(8);
            this.removeOutput(9);
            this.addOutput('error', node_io_1.Type.STRING);
        }
        this.previousAdvancedSetting = this.advancedSetting;
    }
    setOutputs(data) {
        if (this.advancedSetting) {
            this.setOutputData(0, data.name, true);
            this.setOutputData(1, data.value, true);
            this.setOutputData(2, this.formattedExecutionTime());
            this.setOutputData(3, data.unit, true);
            this.setOutputData(4, data.kind, true);
            this.setOutputData(5, data.type, true);
            this.setOutputData(6, data.scale, true);
            this.setOutputData(7, data.historySettings.type, true);
            this.setOutputData(8, data, true);
            this.setOutputData(9, null, true);
        }
        else {
            this.setOutputData(0, data.name, true);
            this.setOutputData(1, data.value, true);
            this.setOutputData(2, this.formattedExecutionTime());
            this.setOutputData(3, null, true);
        }
    }
    setErrorOutputs(message) {
        if (this.advancedSetting) {
            this.setOutputData(0, null, true);
            this.setOutputData(1, null, true);
            this.setOutputData(2, this.formattedExecutionTime());
            this.setOutputData(3, null, true);
            this.setOutputData(4, null, true);
            this.setOutputData(5, null, true);
            this.setOutputData(6, null, true);
            this.setOutputData(7, null, true);
            this.setOutputData(8, null, true);
            this.setOutputData(9, message);
        }
        else {
            this.setOutputData(0, null, true);
            this.setOutputData(1, null, true);
            this.setOutputData(2, this.formattedExecutionTime());
            this.setOutputData(3, message);
        }
    }
}
container_1.Container.registerNodeType('nube/api-input', NubeAPIInputPoint);
//# sourceMappingURL=api-input.js.map