"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt = require("mqtt");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const utils_1 = require("../../../utils");
const crypto_utils_1 = require("../../../utils/crypto-utils");
const matchMQTT = require('mqtt-match');
class MqttClientNode extends node_1.Node {
    constructor() {
        super();
        this.topicsCount = 0;
        this.messageQueue = [];
        this.rateLimitMS = 200;
        this.title = 'MQTT client';
        this.description =
            'This node connects to an MQTT Broker, subscribes to topics, and can publish values to topics.  ' +
                'Once configured (in settings) with a valid ‘Broker URL’, ‘Broker Port’, and ‘Authentication’ (if required), ' +
                'this node will read and write to MQTT topics when ‘enable’ is ‘true’.  ' +
                'Number of topics, and the topic names can be configured from settings. ' +
                'Each topic will have a corresponding input and output. ';
        this.addInput('[enable]', node_1.Type.BOOLEAN);
        this.addOutput('connected', node_1.Type.BOOLEAN);
        this.settings['server'] = { description: 'Broker URL', value: '0.0.0.0', type: node_1.SettingType.STRING };
        this.settings['port'] = { description: 'Broker port', value: '1883', type: node_1.SettingType.STRING };
        this.settings['enable'] = { description: 'Enable', value: false, type: node_1.SettingType.BOOLEAN };
        this.settings['authentication'] = {
            description: 'Use Authentication',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['username'] = { description: 'User name', value: '', type: node_1.SettingType.STRING };
        this.settings['password'] = { description: 'Password', value: '', type: node_1.SettingType.PASSWORD };
        this.settings['topics_count'] = {
            description: 'Number of Topics',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['decimals'] = {
            description: 'Decimal Places (Numerics)',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: '0' },
                    { value: 1, text: '1' },
                    { value: 2, text: '2' },
                    { value: 3, text: '3' },
                    { value: 4, text: '4' },
                    { value: 5, text: '5' },
                    { value: 6, text: '6' },
                    { value: 7, text: '7' },
                    { value: 8, text: '8' },
                    { value: 9, text: '9' },
                    { value: 10, text: '10' },
                ],
            },
            value: 3,
        };
        this.setSettingsConfig({
            groups: [
                { server: { weight: 3 }, port: { weight: 1 } },
                { enable: {}, authentication: {} },
                { username: {}, password: {} },
                { topics_count: {}, decimals: {} },
            ],
            conditions: {
                username: setting => {
                    return !!setting['authentication'].value;
                },
                password: setting => {
                    return !!setting['authentication'].value;
                },
                topics_count2: setting => {
                    return !setting['authentication'].value;
                },
            },
        });
    }
    init() {
        this.changeTopicsCount(this.settings['topics_count'].value);
    }
    onCreated() {
        this.renameInputsOutputs();
    }
    onAdded() {
        this.EXECUTE_INTERVAL = 200;
        this.topicsCount = this.settings['topics_count'].value;
        if (this.side == container_1.Side.server) {
            this.setOutputData(0, false);
            if (this.settings['enable'].value && (this.inputs[0].link == null || this.inputs[0].data == true)) {
                this.connectToBroker();
            }
        }
    }
    connectToBroker() {
        let options = { host: this.settings['server'].value };
        if (this.settings['port'].value != null && this.settings['port'].value != '')
            options.port = this.settings['port'].value;
        if (this.settings['username'].value != null && this.settings['username'].value != '')
            options.username = this.settings['username'].value;
        if (this.settings['password'].value != null && this.settings['password'].value != '')
            options.password = crypto_utils_1.default.decrypt(this.settings['password'].value);
        this.client = mqtt.connect(options);
        this.client.on('connect', () => {
            this.setOutputData(0, true);
            for (let i = 1; i <= this.topicsCount; i++) {
                let topic = this.settings['topic' + i].value;
                if (topic && topic != '')
                    this.client.subscribe(topic);
            }
        });
        this.client.on('close', () => {
            this.setOutputData(0, false);
            this.setOutputData(1, null);
        });
        this.client.on('error', error => {
            this.debugWarn(error);
        });
        this.client.on('message', (topic, message) => {
            let obj = { topic: topic, message: message.toString() };
            this.messageQueue.push(obj);
        });
    }
    disconnectFromBroker() {
        if (this.client)
            this.client.end();
    }
    onInputUpdated() {
        if (this.inputs[0].updated) {
            if (this.inputs[0].data == false)
                this.disconnectFromBroker();
            else if (this.settings['enable'].value && (this.inputs[0].link == null || this.inputs[0].data == true))
                this.connectToBroker();
        }
        if (this.settings['enable'].value && this.client && this.client.connected) {
            for (let i = 1; i < this.getInputsCount(); i++) {
                let data = this.inputs[i].data;
                if (data && this.inputs[i].updated) {
                    let isJSON = true;
                    try {
                        data = JSON.parse(data);
                    }
                    catch (_a) {
                        console.log('Not a valid JSON');
                        isJSON = false;
                    }
                    let topic;
                    let payload = '';
                    if (isJSON &&
                        data.hasOwnProperty('topic') &&
                        typeof data.topic === node_1.Type.STRING &&
                        data.hasOwnProperty('payload')) {
                        payload = JSON.stringify(data.payload);
                        this.client.publish(data.topic, '' + payload);
                    }
                    else {
                        topic = this.settings['topic' + i].value;
                        if (isJSON)
                            payload = JSON.stringify(data);
                        else
                            payload = String(data);
                        this.client.publish(topic, '' + payload);
                    }
                }
            }
        }
    }
    onAfterSettingsChange() {
        let topics = this.settings['topics_count'].value;
        topics = utils_1.default.clamp(topics, 1, 100);
        this.settings['topics_count'].value = topics;
        if (this.topicsCount != topics)
            this.changeTopicsCount(topics);
        this.renameInputsOutputs();
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { inputs: this.inputs, outputs: this.outputs, settings: this.settings },
            });
        if (this.side == container_1.Side.server) {
            this.disconnectFromBroker();
            if (this.settings['enable'].value)
                this.connectToBroker();
        }
    }
    changeTopicsCount(target_count) {
        let diff = target_count - this.topicsCount;
        if (diff == 0)
            return;
        this.changeInputsCount(target_count + 1, node_1.Type.STRING);
        this.changeOutputsCount(target_count + 1, node_1.Type.STRING);
        if (diff > 0) {
            for (let i = this.topicsCount + 1; i <= target_count; i++) {
                this.settings['outputType' + i] = {
                    description: 'Output Type',
                    type: node_1.SettingType.DROPDOWN,
                    config: {
                        items: [
                            { value: false, text: 'Payload' },
                            { value: true, text: 'JSON' },
                        ],
                    },
                    value: false,
                };
                this.settings['topic' + i] = {
                    description: 'Topic ' + i,
                    value: '',
                    type: node_1.SettingType.STRING,
                };
                for (let i = this.topicsCount + 1; i <= target_count; i++) {
                    this.settingConfigs.groups.push({
                        [`outputType${i}`]: { weight: 2 },
                        [`topic${i}`]: { weight: 5 },
                    });
                }
            }
        }
        else if (diff < 0) {
            for (let i = this.topicsCount; i > target_count; i--) {
                delete this.settings['topic' + i];
                this.settingConfigs.groups.pop();
            }
        }
        this.topicsCount = target_count;
    }
    renameInputsOutputs() {
        for (let i = 1; i <= this.topicsCount; i++) {
            let topic = this.settings['topic' + i].value;
            if (topic.length > 20)
                topic = '...' + topic.substr(topic.length - 20, 20);
            this.inputs[i].name = '' + i + ' | ' + topic;
            this.outputs[i].name = topic + ' | ' + i;
        }
        if (this.side == container_1.Side.editor) {
            for (let i = 1; i <= this.topicsCount; i++) {
                this.inputs[i].label = this.inputs[i].name;
                this.outputs[i].label = this.outputs[i].name;
            }
            this.setDirtyCanvas(true, true);
        }
    }
    onExecute() {
        if (this.messageQueue && this.messageQueue.length > 0) {
            this.processQueue(this.messageQueue.shift());
        }
    }
    setMQTTOutput(mqttMessage, outputNum) {
        if (this.settings['outputType' + outputNum].value) {
            this.setOutputData(outputNum, { topic: mqttMessage.topic, payload: mqttMessage.message });
            return;
        }
        else {
            let msgAsNum = Number(mqttMessage.message);
            if (isNaN(msgAsNum)) {
                this.setOutputData(outputNum, mqttMessage.message);
                return;
            }
            this.setOutputData(outputNum, utils_1.default.toFixedNumber(msgAsNum, this.settings['decimals'].value).toString());
        }
    }
    processQueue(mqttMessage) {
        for (let outInd = 1; outInd <= this.topicsCount; outInd++) {
            if (matchMQTT(this.settings['topic' + outInd].value, mqttMessage.topic))
                this.setMQTTOutput(mqttMessage, outInd);
        }
    }
}
container_1.Container.registerNodeType('protocols/mqtt/client', MqttClientNode);
//# sourceMappingURL=mqtt-client.js.map