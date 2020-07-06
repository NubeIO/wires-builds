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
const mqtt = require("mqtt");
const utils_1 = require("../../../utils");
const mqtt_utils_1 = require("./mqtt-utils");
const constants_1 = require("../../../constants");
class MqttPointReadNode extends node_1.Node {
    constructor() {
        super();
        this.messageQueue = [];
        this.previousTopic = '';
        this.enable = 0;
        this.connected = 0;
        this.value = 1;
        this.jsonValue = 2;
        this.priority = 3;
        this.EXECUTE_INTERVAL = 200;
        this.title = 'MQTT Point Read-Only';
        this.description =
            'This node connects to an MQTT Broker, subscribes to a topic. Once configured (in settings) with a valid ' +
                'this node will read an MQTT topic when `enable` is `true`. This node is to be used with the ' +
                'protocols/MQTT-point nodes (with priority array). Subscribing to basic MQTT topics should be done with the ' +
                'protocols/MQTT-Client node.';
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, false, 'Enable', false);
        this.addOutput('connected', node_1.Type.BOOLEAN);
        this.addOutput('value', node_1.Type.STRING);
        this.addOutput('jsonValue', node_1.Type.JSON);
        this.addOutput('priority', node_1.Type.NUMBER);
        this.settings['enable'] = { description: 'Enable', value: false, type: node_1.SettingType.BOOLEAN };
        this.settings['topic'] = {
            description: 'Topic',
            value: '',
            type: node_1.SettingType.STRING,
        };
    }
    onAdded() {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateTitle();
            if (this.side !== container_1.Side.server)
                return;
            yield utils_1.default.sleep(500);
            mqtt_utils_1.default.addMqttReader(this.getParentNode(), this);
            this.parentNode = this.getParentNode();
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
        });
    }
    onAfterSettingsChange(oldSettings, oldName) {
        super.onAfterSettingsChange(oldSettings, oldName);
        this.onChanges();
    }
    onExecute() {
        if (this.messageQueue && this.messageQueue.length > 0) {
            this.processQueue(this.messageQueue.shift());
        }
    }
    onRemoved() {
        this.disconnectFromBroker();
        mqtt_utils_1.default.removeMqttReader(this.parentNode, this);
    }
    subscribe(node) {
        this.parentNode = node;
        this.onChanges(true);
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
    processQueue(mqttMessage) {
        const { message } = mqttMessage;
        let payload;
        if (typeof message === 'object') {
            payload = JSON.stringify(message);
        }
        else {
            payload = message;
        }
        try {
            payload = JSON.parse(payload);
            this.setOutputData(this.jsonValue, payload);
            this.setOutputData(this.value, (payload && payload.value) || null);
            this.setOutputData(this.priority, (payload && payload.priority) || null);
        }
        catch (_a) {
            this.debugErr('Not a valid JSON');
            this.setOutputData(this.jsonValue, null);
            this.setOutputData(this.value, null);
            this.setOutputData(this.priority, null);
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
    }
    subscribeTopic() {
        if (this.client && this.client.connected) {
            const topic = this.settings['topic'].value;
            if (this.previousTopic !== topic && this.previousTopic) {
                this.client.unsubscribe(`${this.previousTopic}/res`);
                this.previousTopic = '';
            }
            if (topic) {
                this.client.subscribe(`${topic}/res`);
                this.previousTopic = topic;
            }
        }
    }
    disconnectFromBroker() {
        if (this.client)
            this.client.end(true, null, () => {
                this.debugInfo('MQTT connection is closed closed');
            });
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
    updateTitle() {
        this.title = `MQTT Point Read (${this.settings['topic'].value})`;
    }
    isEnable() {
        return this.parentNode.getInputData(0) && this.getInputData(this.enable);
    }
}
container_1.Container.registerNodeType(constants_1.MQTT_POINT_READ, MqttPointReadNode, constants_1.MQTT_NETWORK);
//# sourceMappingURL=mqtt-point-read.js.map