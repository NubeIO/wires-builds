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
const time_utils_1 = require("../../../utils/time-utils");
const edge_utils_1 = require("./edge-utils");
const edge_constant_1 = require("./edge-constant");
class Edge28LORAResetNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.title = 'Edge IO 28 LORA Connect Reset';
        this.description =
            `## Description\n ` +
                ` The is node is used in conjunction with the edge-io-28. This node uses an internal rest-api to rest a LORA Connect gateway connected to an edge-io-28 controller\n `;
        this.addInputWithSettings('enableInterval', node_1.Type.BOOLEAN, false, 'Enable Interval Reset');
        this.addInputWithSettings('interval', node_1.Type.NUMBER, 15, 'Interval');
        this.addInput('trigger', node_1.Type.BOOLEAN);
        this.addOutput('lastReset');
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
            value: 'minutes',
        };
        this.setSettingsConfig({
            groups: [{ interval: { weight: 2 }, time: {} }],
        });
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
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
        if (this.side !== container_1.Side.server)
            return;
        let interval = this.getInputData(1);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        this.EXECUTE_INTERVAL = interval;
        try {
            edge_utils_1.default.addPoint(this.getParentNode(), this);
        }
        catch (error) { }
    }
    onExecute() {
        if (this.side !== container_1.Side.server)
            return;
        if (!this.getInputData(0))
            return;
        this.resetLORAConnect();
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        let interval = this.getInputData(1);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        this.EXECUTE_INTERVAL = interval;
        let trigger = this.getInputData(2);
        if (trigger && !this.lastTrigger)
            this.resetLORAConnect();
        this.lastTrigger = trigger;
    }
    resetLORAConnect() {
        if (this.side !== container_1.Side.server)
            return;
        const pointType = 'do';
        const pointNumber = 'lc';
        this.writePointValue(edge_constant_1.edgeIp, edge_constant_1.edgePort, edge_constant_1.edgeApiVer, pointType, pointNumber, 0, 16)
            .then(e => {
            this.setOutputData(0, new Date().valueOf(), true);
            this.timeoutFunc = setTimeout(() => {
                this.writePointValue(edge_constant_1.edgeIp, edge_constant_1.edgePort, edge_constant_1.edgeApiVer, pointType, pointNumber, 1, 16);
            }, 2000);
        })
            .catch(err => this.debugInfo(`ERROR: ${err}`));
    }
    onRemoved() {
        super.onRemoved();
    }
    onAfterSettingsChange() {
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
        if (this.side !== container_1.Side.server)
            return;
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('protocols/nube/edge-28-lora-reset', Edge28LORAResetNode);
//# sourceMappingURL=edge-28-lora-reset.js.map