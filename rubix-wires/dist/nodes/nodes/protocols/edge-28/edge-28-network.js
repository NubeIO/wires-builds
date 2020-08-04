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
const utils_1 = require("../../../utils");
const axios_1 = require("axios");
const edge_utils_1 = require("./edge-utils");
const time_utils_1 = require("../../../utils/time-utils");
const edge_constant_1 = require("./edge-constant");
const constants_1 = require("../../../constants");
class Edge28ApiNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.pointNodes = [];
        this.inAlarmTrigger = 0;
        this.inHistoryTrigger = 1;
        this.inInput = 2;
        this.outVal = 0;
        this.outError = 1;
        this.outMessageJson = 2;
        this.outAlarm = 3;
        this.lastInterval = 1000;
        this.runState = true;
        this._ui = 'ui';
        this._di = 'di';
        this.title = 'Edge 28 Network';
        this.description =
            `## Description\n ` +
                ` The is node is used for reading and writing values to the edge-io-28. This node uses an internal rest-api to talk to the edge-io-28. No details need to be set\n ` +
                `   \n ` +
                `### Enable\n ` +
                `   \n ` +
                ` The point enable will disable any new value being sent to the node **output**  \n ` +
                `   \n ` +
                `### Polling Interval\n ` +
                `   \n ` +
                ` This will change the poll rate of the edge-io-28 inputs. A normal setting is 1 second\n ` +
                ` The faster the polling rate is the higher the memory usage is\n ` +
                `   \n ` +
                `### Polling Interval Time Setting\n ` +
                `   \n ` +
                `Used in conjugation with the **Polling Interval**. Make the selection for the time units for **Seconds**, **Minutes**, **Hours** \n ` +
                `   \n `;
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, true, 'Enable');
        this.addInputWithSettings('interval', node_1.Type.NUMBER, 2, 'Polling Interval');
        this.addInput('pollInputs', node_1.Type.BOOLEAN);
        this.addOutput('connected', node_1.Type.BOOLEAN);
        this.addOutput('error', node_1.Type.STRING);
        this.addOutput('alarm', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.settings['time'] = {
            description: 'Polling Interval Time Setting',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
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
    }
    fetchPointValue(host, port, apiVer, pointType) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${utils_1.default.buildUrl(host, port)}/api/${apiVer}/read/all/${pointType}`;
            const pointValue = yield axios_1.default.get(url);
            return pointValue.data;
        });
    }
    onCreated() {
        super.onCreated();
        this.name = `id_${this.container.id.toString()}_${this.id.toString()}`;
    }
    onAdded() {
        const _super = Object.create(null, {
            onAdded: { get: () => super.onAdded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onAdded.call(this);
            this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
            clearInterval(this.UI_timeoutFunc);
            clearInterval(this.DI_timeoutFunc);
            let enable = this.getInputData(0);
            if (!enable) {
                this.setOutputData(0, false);
                this.runState = false;
                return;
            }
            let interval = this.getInputData(1);
            interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
            this.startInputPolling(interval);
            yield this.onInputUpdated();
        });
    }
    onRemoved() {
        const _super = Object.create(null, {
            onRemoved: { get: () => super.onRemoved }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onRemoved.call(this);
            clearInterval(this.UI_timeoutFunc);
            clearInterval(this.DI_timeoutFunc);
        });
    }
    startInputPolling(interval) {
        if (this.side !== container_1.Side.server)
            return;
        this.UI_timeoutFunc = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield this.pollUIs();
            this.sendPayloadToPointNodesFunc();
        }), interval);
        this.DI_timeoutFunc = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield this.pollDIs();
            this.sendPayloadToPointNodesFunc();
        }), interval + 5);
    }
    pollUIs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.edgeReadUI_Store = yield this.fetchPointValue(edge_constant_1.edgeIp, edge_constant_1.edgePort, edge_constant_1.edgeApiVer, this._ui);
            }
            catch (err) {
                this.debugInfo(`ERROR: getting edge point type: ${this._ui} ${err}`);
            }
        });
    }
    pollDIs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.edgeReadDI_Store = yield this.fetchPointValue(edge_constant_1.edgeIp, edge_constant_1.edgePort, edge_constant_1.edgeApiVer, this._di);
            }
            catch (err) {
                this.debugInfo(`ERROR: getting edge point type: ${this._di} ${err}`);
            }
        });
    }
    pollInputsAndSend() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            yield this.pollUIs();
            yield this.pollDIs();
            this.sendPayloadToPointNodesFunc();
        });
    }
    sendPayloadToPointNodesFunc() {
        if (this.side !== container_1.Side.server)
            return;
        for (let pointNode of this.pointNodes) {
            edge_utils_1.default.sendPayloadToChild(pointNode, {
                pointsDI: this.edgeReadDI_Store,
                pointsUI: this.edgeReadUI_Store,
            });
        }
    }
    subscribe({ action, payload }) {
        switch (action) {
            case edge_constant_1.ADD_POINT:
                this.pointNodes.push(payload);
                break;
            case edge_constant_1.REMOVE_POINT:
                this.pointNodes = this.pointNodes.filter(pointNode => pointNode.id !== payload.id);
                break;
            case edge_constant_1.GET_POINTS:
                return 'GET_POINTS';
            case edge_constant_1.GET_PRESENT_VALUE:
                return 'GET_PRESENT_VALUE';
            case edge_constant_1.SEND_PAYLOAD_TO_CHILD:
                return 'SEND_PAYLOAD_TO_CHILD';
            default:
                this.debugWarn("Request action doesn't match");
        }
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            let enable = this.getInputData(0);
            if (!enable && this.runState) {
                clearInterval(this.UI_timeoutFunc);
                clearInterval(this.DI_timeoutFunc);
                this.setOutputData(0, false, true);
                this.runState = false;
                return;
            }
            else if (!enable && !this.runState) {
                this.setOutputData(0, false, true);
                this.runState = false;
                return;
            }
            else if (enable) {
                let interval = this.getInputData(1);
                interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
                if (this.runState) {
                    if (interval != this.lastInterval) {
                        this.lastInterval = interval;
                        clearInterval(this.UI_timeoutFunc);
                        clearInterval(this.DI_timeoutFunc);
                        this.startInputPolling(interval);
                    }
                    return;
                }
                else if (!this.runState) {
                    this.runState = true;
                    this.setOutputData(0, yield this.doPing(edge_constant_1.edgeIp, edge_constant_1.edgePort));
                    this.startInputPolling(interval);
                    return;
                }
                yield this.pollInputsAndSend();
            }
        });
    }
    onAfterSettingsChange(oldSettings) {
        const _super = Object.create(null, {
            onAfterSettingsChange: { get: () => super.onAfterSettingsChange }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onAfterSettingsChange.call(this, oldSettings);
            if (this.side !== container_1.Side.server)
                return;
            yield this.onInputUpdated();
        });
    }
    doPing(host, port) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            const url = `${utils_1.default.buildUrl(host, port)}/`;
            const pingVal = yield axios_1.default.get(url);
            return Object.values(pingVal.data).includes('whats up');
        });
    }
}
container_1.Container.registerNodeType(constants_1.EDGE_28_NETWORK, Edge28ApiNode);
//# sourceMappingURL=edge-28-network.js.map