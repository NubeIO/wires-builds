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
const utils_1 = require("../../utils");
const axios_1 = require("axios");
const base_point_1 = require("./base-point");
const node_1 = require("../../node");
class NubeAPIOutputPoint extends base_point_1.default {
    constructor() {
        super();
        this.dynamicInputsType = node_io_1.Type.STRING;
        this.title = 'Nube API Output';
        this.description =
            'This node is used to write to points on connected Nube devices.  Once the nube/login node is successfully authenticated, the API-Output nodes will have their settings updated with values from the connected Nube devices. Connected Nube devices can be selected from the ‘Select URL‘ setting dropdown.  ‘Select Point’ setting dropdown will be populated with the available points from the selected URL.  Nube points have 16 priority levels to write to.  The ‘Priority Level’ setting is the priority that the node will write on.  The ‘in #’ inputs act as a separate priority array; the highest non-null ‘in #’ input will be written to the Nube point on the ‘Priority Level’ setting’.  The number of inputs can be modified from the ‘Inputs Count’ setting. Ticking the ‘Show Advanced Options’ setting will add outputs to the node with extra information about the selected point.';
        this.addOutput('outValue', node_io_1.Type.STRING);
        this.addOutput('lastUpdate', node_io_1.Type.STRING);
        this.addOutput('error', node_io_1.Type.STRING);
        this.settings['priorityLevel'] = {
            description: 'Priority Level',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: this.getConfigItems(),
            },
            value: 16,
        };
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
    reload() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.fetchConnection();
                const point = yield this.fetchPoints(user);
                yield this.writePointValue(user);
                const data = yield this.fetchPointValue(user, point);
                this.setOutputs(data);
            }
            catch (e) {
                this.setErrorOutputs(e.message);
            }
            return null;
        });
    }
    onAfterSettingsChange() {
        const _super = Object.create(null, {
            onAfterSettingsChange: { get: () => super.onAfterSettingsChange },
            onInputUpdated: { get: () => super.onInputUpdated }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onAfterSettingsChange.call(this);
            yield this.onInputUpdated();
            this.updateNodeOutputs();
            this.updateNodeOutput();
            this.broadcastOutputsToClients();
            yield _super.onInputUpdated.call(this);
        });
    }
    updateTitle() {
        if (this.settings['point'].value)
            this.title = `Nube API Output (${this.settings['point'].value})`;
        else
            this.title = 'Nube API Output (unconfigured)';
    }
    filterPoint(points) {
        return points.filter(point => !new RegExp('^DI|UI').test(point));
    }
    setOutputs(body) {
        if (this.advancedSetting) {
            this.setOutputData(0, body.value);
            this.setOutputData(1, this.formattedExecutionTime());
            this.setOutputData(2, body);
            this.setOutputData(3, null);
        }
        else {
            this.setOutputData(0, body.value);
            this.setOutputData(1, this.formattedExecutionTime());
            this.setOutputData(2, null);
        }
    }
    setErrorOutputs(message) {
        if (this.advancedSetting) {
            this.setOutputData(0, null);
            this.setOutputData(1, this.formattedExecutionTime());
            this.setOutputData(2, null);
            this.setOutputData(3, message);
        }
        else {
            this.setOutputData(0, null);
            this.setOutputData(1, this.formattedExecutionTime());
            this.setOutputData(2, message);
        }
    }
    getConfigItems() {
        const configItems = [];
        Array(16)
            .fill(null)
            .map((_, i) => configItems.push({ value: i + 1, text: (i + 1).toString() }));
        return configItems;
    }
    updateNodeOutputs() {
        this.advancedSetting = this.settings['advancedSetting'].value;
        if (this.advancedSetting && !this.previousAdvancedSetting) {
            this.removeOutput(2);
            this.addOutput('asObject', node_io_1.Type.JSON);
            this.addOutput('error', node_io_1.Type.STRING);
        }
        else if (!this.advancedSetting && this.previousAdvancedSetting) {
            this.removeOutput(3);
            this.removeOutput(2);
            this.addOutput('error', node_io_1.Type.STRING);
        }
        this.previousAdvancedSetting = this.advancedSetting;
    }
    writePointValue({ jwt, host, port }) {
        return __awaiter(this, void 0, void 0, function* () {
            const point = this.settings['point'].value;
            const url = `${utils_1.default.buildUrl(host, port)}/points/${point}/value`;
            const body = this.getInputAsJsonString();
            yield axios_1.default.put(url, body, {
                headers: { 'Authorization': jwt, 'Content-Type': 'application/json' },
            });
            return null;
        });
    }
    getInputAsJsonString() {
        const priorityLevel = this.settings['priorityLevel'].value;
        for (let i = 0; i < this.getInputsCount(); i++) {
            let input = this.getInputData(i);
            if (input != null && input !== '') {
                return { value: input, priority: priorityLevel };
            }
        }
        return { value: null, priority: priorityLevel };
    }
}
container_1.Container.registerNodeType('nube/api-output', NubeAPIOutputPoint);
//# sourceMappingURL=api-output.js.map