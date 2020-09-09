"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt = require("mqtt");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const node_io_1 = require("../../../node-io");
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
        this.enableDebug = false;
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
        this.addInputWithSettings('input', node_io_1.Type.STRING, '', 'JSON input or input value');
        this.addInputWithSettings('topic', node_io_1.Type.STRING, '', 'enter topic if not used from input');
        this.addOutput('connected', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.ANY);
        this.addOutput('output-json', node_io_1.Type.JSON);
        this.settings['retain'] = { description: 'Retain message on publish', value: true, type: node_1.SettingType.BOOLEAN };
        this.settings['qos'] = {
            description: 'MQTT Quality Of Service (QoS)',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: -1, text: 'na' },
                    { value: 0, text: 'QoS 0' },
                    { value: 1, text: 'QoS 1' },
                    { value: 2, text: 'QoS 2' },
                ],
            },
            value: 0,
        };
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
                if (this.enableDebug)
                    this.debugInfo(`MQTT-CLIENT-SINGLE NODE: connect to Broker`);
            }
        }
    }
    connectToBroker() {
        let { protocol, host, port, username, password } = config_1.default.mqtt;
        let options = {};
        const retain = this.settings['retain'].value;
        if (retain) {
            options.retain = true;
        }
        const qos = this.settings['qos'].value;
        if (qos !== -1) {
            options.qos = qos;
        }
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
            if (this.enableDebug)
                this.debugInfo(`MQTT-CLIENT-SINGLE NODE: this.client = mqtt.connect options: ${JSON.stringify(options)}`);
            this.setOutputData(0, true);
            let data = this.getInputData(this.inData);
            let topic = this.getInputData(this.inTopic);
            if (data || topic) {
                let isJSON = true;
                try {
                    data = JSON.parse(data);
                }
                catch (_a) {
                    if (this.enableDebug)
                        this.debugInfo(`MQTT-CLIENT-SINGLE NODE: input isn't JSON`);
                    isJSON = false;
                }
                if (isJSON && data.hasOwnProperty('topic') && typeof data.topic === node_io_1.Type.STRING) {
                    if (!helper_1.isNull(data.topic)) {
                        this.client.subscribe(data.topic);
                        if (this.enableDebug)
                            this.debugInfo(`MQTT-CLIENT-SINGLE NODE:  subscribe on json topic ${data.topic}`);
                    }
                }
                else {
                    if (!helper_1.isNull(topic)) {
                        if (this.enableDebug)
                            this.debugInfo(`MQTT-CLIENT-SINGLE NODE:  subscribe on node input topic ${topic}`);
                        this.client.subscribe(topic);
                    }
                    ;
                }
            }
        });
        this.client.on('close', () => {
            this.setOutputData(0, false);
        });
        this.client.on('error', error => {
            this.debugWarn(error);
        });
        this.client.on('message', (topic, message) => {
            let obj = { topic: topic, message: message.toString() };
            if (this.enableDebug)
                this.debugInfo(`MQTT-CLIENT-SINGLE NODE:  this.client.on('message' ${JSON.stringify(obj)}`);
            this.processMessage(obj);
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
                if (this.enableDebug)
                    this.debugInfo(`MQTT-CLIENT-SINGLE NODE: connect to Broker`);
            }
            else if (this.getInputData(this.inEnable) === false) {
                this.disconnectFromBroker();
                if (this.enableDebug)
                    this.debugInfo(`MQTT-CLIENT-SINGLE NODE: disconnect From Broker`);
            }
            else if (helper_1.isNull(this.getInputData(this.inEnable))) {
                this.onAfterSettingsChange();
                if (this.enableDebug)
                    this.debugInfo(`MQTT-CLIENT-SINGLE NODE: disconnect enable input from node`);
            }
        }
        if (this.inputs[this.inName].updated) {
            let nodeName = this.getInputData(this.inName);
            if (!helper_1.isNull(nodeName)) {
                this.name = nodeName;
                this.broadcastNameToClients();
            }
            ;
        }
        if (this.getInputData(this.inEnable) && this.inputs[this.inTopic].updated) {
            this.connectToBroker();
            if (this.enableDebug)
                this.debugInfo(`MQTT-CLIENT-SINGLE NODE: node input topic updated`);
        }
        if (this.getInputData(this.inEnable) && this.client && this.client.connected) {
            let data = this.getInputData(this.inData);
            if (data && this.inputs[this.inData].updated) {
                let isJSON = true;
                try {
                    data = JSON.parse(data);
                }
                catch (_a) {
                    if (this.enableDebug)
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
                    if (this.enableDebug)
                        this.debugInfo(`MQTT-CLIENT-SINGLE NODE: publish on input topic from json${data.topic}, '' + ${payload}`);
                }
                else {
                    topic = this.getInputData(this.inTopic);
                    if (isJSON)
                        payload = JSON.stringify(data);
                    else
                        payload = String(data);
                    this.client.publish(topic, '' + payload);
                    if (this.enableDebug)
                        this.debugInfo(`MQTT-CLIENT-SINGLE NODE: publish on input topic from node input ${topic}, '' + ${payload}`);
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
                if (this.enableDebug)
                    this.debugInfo(`MQTT-CLIENT-SINGLE NODE: connect to Broker from settings`);
            }
        }
    }
    processMessage(mqttMessage) {
        let topic = this.getInputData(this.inTopic);
        if (matchMQTT(topic, mqttMessage.topic)) {
            this.setOutputData(1, mqttMessage.message);
            this.setOutputData(2, mqttMessage);
        }
    }
}
container_1.Container.registerNodeType('protocols/mqtt/client-single', MqttClientSingleNode);
//# sourceMappingURL=mqtt-client-single.js.map