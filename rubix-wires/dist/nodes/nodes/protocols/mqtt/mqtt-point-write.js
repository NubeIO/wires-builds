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
const mqtt = require("mqtt");
const constants_1 = require("../../../constants");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const utils_1 = require("../../../utils");
const point_model_1 = require("../model/point-model");
const mqtt_utils_1 = require("./mqtt-utils");
class MqttPointWriteNode extends node_1.Node {
    constructor() {
        super();
        this.messageQueue = [];
        this.priorityLevelItems = Array(16)
            .fill(null)
            .map((_, i) => ({ value: i + 1, text: (i + 1).toString() }));
        this.isFirst = true;
        this.hasStoreHistoryInputSlot = false;
        this.previousTopic = '';
        this.enable = 0;
        this.input = 1;
        this.clearHistory = 2;
        this.storeHistory = 3;
        this.connected = 0;
        this.value = 1;
        this.jsonValue = 2;
        this.priority = 3;
        this.historyCount = 4;
        this.EXECUTE_INTERVAL = 200;
        this.title = 'MQTT Point Write';
        this.description =
            'This node connects to an MQTT Broker, subscribes to a topic, and can publish values once we enable the node. ' +
                'This node has a built in 16 level priority array. A "Write Priority Level" must be selected from settings. ' +
                'The highest write priority value will be published to the `topic/res`. ' +
                'To release a priority level, a `null` message should be sent on the priority level to be released. ' +
                'This point can be modified by an external MQTT device. From-External Example: `topic = "MyTopic"`. ' +
                'To write a value to this MQTT-point from an external MQTT device, a value of the form ' +
                '`{value:${value}, priority:${priority}}` must be published to the MQTT topic `MyTopic/req`. When ' +
                'any message is published on the MQTT topic `MyTopic/req` this node will publish the updated ' +
                'value to MQTT topic `MyTopic/value` it will also publish complete message JSON to MQTT topic `MyTopic/json`. ' +
                'If the current value (in Wires) is 55 @ priority 5, then an external MQTT device publishes ' +
                '`{value:33, priority:3}` to `MyTopic/req` then the `MQTT Point` will output 33. If the external MQTT device ' +
                'then publishes `{value:null, priority:3}` to `MyTopic/req` then the `MQTT Point` output will revert to the ' +
                'next priority value (55 @ priority 5).';
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, false, 'Enable', false);
        this.addInput('input', node_1.Type.STRING);
        this.addInput('clearHistory', node_1.Type.BOOLEAN);
        this.addOutput('connected', node_1.Type.BOOLEAN);
        this.addOutput('value', node_1.Type.STRING);
        this.addOutput('jsonValue', node_1.Type.JSON);
        this.addOutput('priority', node_1.Type.NUMBER);
        this.addOutput('historyCount', node_1.Type.NUMBER);
        this.settings['enableHistory'] = {
            description: 'Enable History',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['topic'] = {
            description: 'Topic',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['priorityLevel'] = {
            description: 'Write Priority Level',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: this.priorityLevelItems,
            },
            value: 16,
        };
        this.settings['historyMode'] = {
            description: 'History Logging Mode',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: point_model_1.HistoryMode.COV, text: 'Change Of Value (COV)' },
                    { value: point_model_1.HistoryMode.TRIGGERED, text: 'Triggered' },
                ],
            },
            value: point_model_1.HistoryMode.COV,
        };
        this.settings['threshold'] = {
            description: 'COV Threshold',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['maxRecords'] = {
            description: 'Max Records',
            value: 100,
            type: node_1.SettingType.NUMBER,
        };
        this.setSettingsConfig({
            groups: [{ enable: {}, enableHistory: {} }],
            conditions: {
                historyMode: setting => {
                    return setting['enableHistory'].value;
                },
                threshold: setting => {
                    return setting['enableHistory'].value && setting['historyMode'].value ===
                        point_model_1.HistoryMode.COV;
                },
                maxRecords: setting => {
                    return setting['enableHistory'].value;
                },
            },
        });
        this.properties['log'] = [];
        this.priorityArray = new Array(16).fill({});
    }
    init() {
        this.dynamicInputUpdate();
    }
    onAdded() {
        return __awaiter(this, void 0, void 0, function* () {
            this.historyMode = this.settings['historyMode'].value;
            this.enableHistory = this.settings['enableHistory'].value;
            this.updateTitle();
            if (this.side !== container_1.Side.server)
                return;
            yield utils_1.default.sleep(500);
            mqtt_utils_1.default.addMqttWriter(this.getParentNode(), this);
            this.parentNode = this.getParentNode();
            this.setLength();
            this.onChanges(true);
        });
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isFirst) {
                yield utils_1.default.sleep(600);
                this.isFirst = false;
            }
            this.onChanges();
            if (this.inputs[this.clearHistory].updated && this.getInputData(this.clearHistory)) {
                this.handleClearHistory();
            }
        });
    }
    onAfterSettingsChange(oldSettings, oldName) {
        super.onAfterSettingsChange(oldSettings, oldName);
        this.dynamicInputUpdate();
        this.onChanges();
    }
    onExecute() {
        if (this.messageQueue && this.messageQueue.length > 0) {
            this.processQueue(this.messageQueue.shift());
        }
    }
    onRemoved() {
        this.disconnectFromBroker();
        mqtt_utils_1.default.removeMqttWriter(this.parentNode, this);
    }
    subscribe(node) {
        this.parentNode = node;
        this.onChanges(true);
    }
    processQueue(mqttMessage) {
        const { topic, message } = mqttMessage;
        if (this.settings['topic'].value + '/req' === topic) {
            let payload;
            if (typeof message === 'object') {
                payload = JSON.stringify(message);
            }
            else {
                payload = message;
            }
            try {
                payload = JSON.parse(payload);
            }
            catch (_a) {
                this.debugErr('Not a valid JSON');
                return;
            }
            if (payload.hasOwnProperty('priority') && payload.hasOwnProperty('value')) {
                const priority = parseInt(payload['priority']);
                if (isNaN(priority) || priority < 1 || priority > 16) {
                    this.debugErr('Invalid priority');
                    return;
                }
                if (payload.value === '' || payload.value === null) {
                    this.priorityArray[priority - 1] = {};
                }
                else {
                    this.priorityArray[priority - 1] = payload;
                }
            }
            const highestPriorityIndex = this.priorityArray.findIndex(element => Object.entries(element).length > 0);
            if (highestPriorityIndex == -1) {
                this.resetOutputs();
                return;
            }
            let brokerStatus = this.client.connected;
            let val = this.priorityArray[highestPriorityIndex]['value'];
            let json = this.priorityArray[highestPriorityIndex];
            let priority = highestPriorityIndex + 1;
            this.setOutputData(this.value, val);
            this.setOutputData(this.jsonValue, json);
            this.setOutputData(this.priority, priority);
            this.client.publish(`${this.settings['topic'].value}/res`, JSON.stringify(json), {
                retain: true,
            });
            if (this.checkCOV() || this.settings['historyMode'].value === point_model_1.HistoryMode.TRIGGERED) {
                this.addHistory(brokerStatus, val, priority);
            }
        }
    }
    onChanges(force = false) {
        this.updateTitle();
        if (this.side !== container_1.Side.server)
            return;
        if (!this.isEnable()) {
            this.resetOutputsWithConnection();
            this.broadcastOutputsToClients();
            if (this.client && this.client.connected) {
                this.disconnectFromBroker();
            }
            return;
        }
        if (!this.client || !this.client.connected || force) {
            if (this.client && this.client.connected && force) {
                this.disconnectFromBroker();
            }
            this.resetOutputsWithConnection();
            this.connectToBroker();
        }
        else {
            this.subscribeTopic();
        }
        this.publishMessage();
        this.broadcastOutputsToClients();
    }
    dynamicInputUpdate() {
        const enableHistory = this.settings['enableHistory'].value;
        const historyMode = this.settings['historyMode'].value;
        if (historyMode !== this.historyMode || enableHistory !== this.enableHistory) {
            if (historyMode === point_model_1.HistoryMode.TRIGGERED && enableHistory) {
                this.addInput('storeHistory', node_1.Type.BOOLEAN);
                this.hasStoreHistoryInputSlot = true;
            }
            else if (this.hasStoreHistoryInputSlot) {
                this.removeInput(this.storeHistory);
                this.hasStoreHistoryInputSlot = false;
            }
        }
        this.historyMode = historyMode;
        this.enableHistory = enableHistory;
    }
    publishMessage() {
        if (!this.isEnable() || !this.client || !this.client.connected) {
            return;
        }
        const priority = this.settings['priorityLevel'].value;
        let data = this.getInputData(this.input);
        if (data !== undefined) {
            try {
                data = JSON.parse(data);
            }
            catch (_a) {
                console.log('Not a valid JSON');
            }
            const msg = {
                topic: this.settings['topic'].value + '/req',
                message: { value: data, priority: priority },
            };
            this.messageQueue.push(msg);
        }
    }
    connectToBroker() {
        this.client = mqtt.connect(mqtt_utils_1.default.createMqttConnectionOptions(this.parentNode));
        this.client.on('connect', () => {
            this.setOutputData(this.connected, true);
            this.subscribeTopic();
        });
        this.client.on('close', () => {
            this.resetOutputsWithConnection();
        });
        this.client.on('error', error => {
            this.debugWarn(error);
        });
        this.client.on('message', (topic, message) => {
            let obj = { topic: topic, message: message.toString() };
            this.messageQueue.push(obj);
        });
    }
    subscribeTopic() {
        if (this.client && this.client.connected) {
            const topic = this.settings['topic'].value;
            if (this.previousTopic !== topic && this.previousTopic) {
                this.client.unsubscribe(`${this.previousTopic}/req`);
                this.previousTopic = '';
            }
            if (topic) {
                this.client.subscribe(`${topic}/req`, { qos: 0, retain: false });
                this.previousTopic = topic;
            }
        }
    }
    checkCOV() {
        if (this.settings['historyMode'].value === point_model_1.HistoryMode.COV) {
            const output = this.outputs[this.value].data;
            const threshold = this.settings['threshold'].value;
            if (threshold === 0 && output !== this.lastHistoryValue)
                return true;
            const isNumber = typeof output === 'number';
            if (output !== this.lastHistoryValue) {
                if (typeof this.lastHistoryValue !== 'number' ||
                    !isNumber ||
                    (isNumber && Math.abs(output - this.lastHistoryValue) >= this.settings['threshold'].value)) {
                    return true;
                }
            }
        }
        return false;
    }
    addHistory(brokerStatus, val, priority) {
        let records = this.properties['log'];
        let record = { val: val, priority, ts: new Date() };
        if (brokerStatus) {
            record = Object.assign(Object.assign({}, record), { sync: true });
        }
        else {
            record = Object.assign(Object.assign({}, record), { sync: false });
        }
        records.push(record);
        const max = this.settings['maxRecords'].value;
        records.splice(0, records.length - max);
        if (this.container.db) {
            this.container.db.updateNode(this.id, this.cid, {
                $push: { 'properties.log': { $each: [record], $slice: -max } },
            });
        }
        this.setLength();
        this.lastHistoryValue = val;
    }
    handleClearHistory() {
        this.properties['log'] = [];
        if (this.container.db) {
            this.container.db.updateNode(this.id, this.cid, { $set: { 'properties.log': [] } });
        }
        this.setLength();
        this.lastHistoryValue = undefined;
    }
    setLength() {
        this.setOutputData(this.historyCount, this.properties['log'].length);
    }
    resetOutputsWithConnection() {
        this.setOutputData(this.connected, false);
        this.resetOutputs();
    }
    resetOutputs() {
        this.setOutputData(this.value, null);
        this.setOutputData(this.jsonValue, null);
        this.setOutputData(this.priority, null);
    }
    disconnectFromBroker() {
        if (this.client) {
            this.client.end(true, null, () => {
                this.debugInfo('MQTT connection is closed closed');
            });
        }
    }
    updateTitle() {
        this.title = `MQTT Point Write (${this.settings['topic'].value})`;
    }
    isEnable() {
        return this.parentNode.getInputData(0) && this.getInputData(this.enable);
    }
}
container_1.Container.registerNodeType(constants_1.MQTT_POINT_WRITE, MqttPointWriteNode, constants_1.MQTT_NETWORK);
//# sourceMappingURL=mqtt-point-write.js.map