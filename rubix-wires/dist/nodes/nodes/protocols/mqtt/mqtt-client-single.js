"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt = require("mqtt");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const node_io_1 = require("../../../node-io");
const utils_1 = require("../../../utils");
const crypto_utils_1 = require("../../../utils/crypto-utils");
const config_1 = require("../../../../config");
const helper_1 = require("../../../../utils/helper");
const matchMQTT = require('mqtt-match');
class MqttClientSingleNode extends node_1.Node {
    constructor() {
        super();
        this.topicsCount = 0;
        this.messageQueue = [];
        this.rateLimitMS = 200;
        this.inName = 0;
        this.inEnable = 1;
        this.inData = 2;
        this.inTopic = 3;
        this.title = 'MQTT Single Topic client';
        this.description =
            `## Description\n ` +
                `This node connects to an MQTT Broker, subscribes to topics, and can publish values to topics. .\n ` +
                `Once configured (in settings) with a valid ‘Broker URL’, ‘Broker Port’, and ‘Authentication’ (if required), .\n ` +
                `this node will read and write to MQTT topics when ‘enable’ is ‘true’.  .\n ` +
                `Each topic will have a corresponding input and output. .\n ` +
                `   \n ` +
                `### Enable\n ` +
                `   \n ` +
                ` This will enable/disable the device from broker \n ` +
                `   \n ` +
                `### Use env settings\n ` +
                `   \n ` +
                ` If set to true this will allow you to use the MQTT broker details set from the .env configuration file in the device\n ` +
                ` If set to false this will allow you to set the MQTT broker details manually\n ` +
                `   \n ` +
                `### Node input\n ` +
                `   \n ` +
                ` The input named "input" can accept a json input or an mqtt payload to send when the topic is set in the node setting called "[topic]".\n ` +
                ` The input named "input" can accept a json payload input with the name, topic, and mqtt payload. See example below.\n ` +
                ` { "payload": 22, "topic": "my topic", "name": "my node node"}\n ` +
                `   \n `;
        this.addInput('[name]', node_io_1.Type.STRING);
        this.addInputWithSettings('enable', node_io_1.Type.BOOLEAN, false, 'enable broker');
        this.addInputWithSettings('input', node_io_1.Type.STRING, '{ "payload": 22, "topic": "my topic", "name": "my node node"}', 'JSON input or input value');
        this.addInputWithSettings('topic', node_io_1.Type.STRING, 'my topic', 'enter topic if not used from input');
        this.addOutput('connected', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.ANY);
        this.addOutput('output-json', node_io_1.Type.JSON);
        this.settings['broker_group'] = {
            description: 'Broker settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.settings['useEnv'] = { description: 'Dont use env settings', value: false, type: node_1.SettingType.BOOLEAN };
        this.settings['server'] = { description: 'Broker URL', value: '0.0.0.0', type: node_1.SettingType.STRING };
        this.settings['port'] = { description: 'Broker port', value: '1883', type: node_1.SettingType.STRING };
        this.settings['authentication'] = {
            description: 'Use Authentication',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['username'] = { description: 'User name', value: '', type: node_1.SettingType.STRING };
        this.settings['password'] = { description: 'Password', value: '', type: node_1.SettingType.PASSWORD };
        this.setSettingsConfig({
            groups: [
                { server: { weight: 3 }, port: { weight: 1 } },
                { username: {}, password: {} },
            ],
            conditions: {
                server: setting => {
                    return !!setting['useEnv'].value;
                },
                port: setting => {
                    return !!setting['useEnv'].value;
                },
                authentication: setting => {
                    return !!setting['useEnv'].value;
                },
                username: setting => {
                    return !!setting['authentication'].value;
                },
                password: setting => {
                    return !!setting['authentication'].value;
                }
            },
        });
    }
    onAdded() {
        this.EXECUTE_INTERVAL = 200;
        if (this.side == container_1.Side.server) {
            this.setOutputData(0, false);
            if (this.getInputData(this.inEnable) === true) {
                this.connectToBroker();
                this.debugInfo(`MQTT-CLIENT-SINGLE NODE: connect to Broker`);
            }
        }
    }
    connectToBroker() {
        let { protocol, host, port, username, password } = config_1.default.mqtt;
        let options = {};
        if (this.settings['useEnv'].value) {
            if (this.settings['server'].value != null && this.settings['server'].value != '')
                options.host = this.settings['server'].value;
            if (this.settings['port'].value != null && this.settings['port'].value != '')
                options.port = this.settings['port'].value;
            if (this.settings['username'].value != null && this.settings['username'].value != '')
                options.username = this.settings['username'].value;
            if (this.settings['password'].value != null && this.settings['password'].value != '')
                options.password = crypto_utils_1.default.decrypt(this.settings['password'].value);
        }
        else {
            if (helper_1.isNull(host))
                return;
            if (helper_1.isNull(port))
                return;
            options.host = host;
            options.port = port;
            if (this.settings['authentication'].value === true) {
                if (!helper_1.isNull(options.username)) {
                    options.username = username;
                }
                if (!helper_1.isNull(options.password)) {
                    options.password = crypto_utils_1.default.decrypt(password);
                }
            }
        }
        this.client = mqtt.connect(options);
        this.client.on('connect', () => {
            this.setOutputData(0, true);
            let data = this.getInputData(this.inData);
            if (data) {
                let isJSON = true;
                try {
                    if (helper_1.isNull(data))
                        return;
                    data = JSON.parse(data);
                }
                catch (_a) {
                    this.debugInfo(`MQTT-CLIENT-SINGLE NODE: input isn't JSON`);
                    isJSON = false;
                }
                if (isJSON && data.hasOwnProperty('topic') && typeof data.topic === node_io_1.Type.STRING) {
                    if (helper_1.isNull(data.topic))
                        return;
                    this.client.subscribe(data.topic);
                }
                else {
                    let topic = this.getInputData(this.inTopic);
                    if (helper_1.isNull(topic))
                        return;
                    this.client.subscribe(topic);
                }
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
            this.setOutputData(1, obj.message);
            this.setOutputData(2, obj);
        });
    }
    disconnectFromBroker() {
        if (this.client)
            this.client.end();
    }
    onInputUpdated() {
        if (this.inputs[this.inEnable].updated) {
            if (this.getInputData(this.inEnable) === true) {
                this.connectToBroker();
                this.debugInfo(`MQTT-CLIENT-SINGLE NODE: connect to Broker`);
            }
            else if (this.getInputData(this.inEnable) === false) {
                this.disconnectFromBroker();
                this.debugInfo(`MQTT-CLIENT-SINGLE NODE: disconnect From Broker`);
            }
            else if (helper_1.isNull(this.getInputData(this.inEnable))) {
                this.onAfterSettingsChange();
                this.debugInfo(`MQTT-CLIENT-SINGLE NODE: disconnect enable input from node`);
            }
        }
        if (this.inputs[this.inName].updated) {
            let nodeName = this.getInputData(this.inName);
            this.name = nodeName;
            this.broadcastNameToClients();
        }
        if (this.settings['enable'].value && this.client && this.client.connected) {
            let data = this.getInputData(this.inData);
            if (data && this.inputs[this.inData].updated) {
                let isJSON = true;
                try {
                    data = JSON.parse(data);
                }
                catch (_a) {
                    this.debugInfo(`MQTT-CLIENT-SINGLE NODE: input isn't JSON`);
                    isJSON = false;
                }
                let topic;
                let payload = '';
                if (isJSON &&
                    data.hasOwnProperty('topic') &&
                    typeof data.topic === node_io_1.Type.STRING &&
                    data.hasOwnProperty('payload')) {
                    payload = JSON.stringify(data.payload);
                    this.client.publish(data.topic, '' + payload);
                }
                else {
                    topic = this.getInputData(this.inTopic);
                    if (isJSON)
                        payload = JSON.stringify(data);
                    else
                        payload = String(data);
                    this.client.publish(topic, '' + payload);
                }
            }
        }
    }
    onAfterSettingsChange() {
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { inputs: this.inputs, outputs: this.outputs, settings: this.settings },
            });
        if (this.side == container_1.Side.server) {
            this.disconnectFromBroker();
            if (this.getInputData(this.inEnable)) {
                this.connectToBroker();
                this.debugInfo(`MQTT-CLIENT-SINGLE NODE: connect to Broker from settings`);
            }
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
container_1.Container.registerNodeType('protocols/mqtt/client-single', MqttClientSingleNode);
//# sourceMappingURL=mqtt-client-single.js.map