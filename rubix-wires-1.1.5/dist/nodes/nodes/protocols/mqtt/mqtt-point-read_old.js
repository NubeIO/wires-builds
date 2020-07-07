"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const mqtt = require("mqtt");
const matchMQTT = require('mqtt-match');
const crypto_utils_1 = require("../../../utils/crypto-utils");
class MqttPointReadNode extends node_1.Node {
    constructor() {
        super();
        this.topicsCount = 0;
        this.messageQueue = [];
        this.rateLimitMS = 200;
        this.title = 'MQTT Point Read-Only';
        this.description =
            'This node connects to an MQTT Broker, subscribes to a topic.  Once configured (in settings) with a valid ‘Broker URL’, ‘Broker Port’, and ‘Authentication’(if required), this node will read an MQTT topic when ‘enable’ is ‘true’.   This node is to be used with the protocols/MQTT-point nodes (with priority array).  Subscribing to basic MQTT topics should be done with the protocols/MQTT-Client node.';
        this.addInput('[enable]', node_1.Type.BOOLEAN);
        this.addOutput('connected', node_1.Type.BOOLEAN);
        this.addOutput('value', node_1.Type.STRING);
        this.addOutput('JSON', node_1.Type.STRING);
        this.addOutput('priority', node_1.Type.NUMBER);
        this.settings['server'] = { description: 'Broker URL', value: '', type: node_1.SettingType.STRING };
        this.settings['port'] = { description: 'Broker port', value: '', type: node_1.SettingType.STRING };
        this.settings['enable'] = { description: 'Enable', value: false, type: node_1.SettingType.BOOLEAN };
        this.settings['authentication'] = {
            description: 'Use Authentication',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['username'] = { description: 'User name', value: '', type: node_1.SettingType.STRING };
        this.settings['password'] = { description: 'Password', value: '', type: node_1.SettingType.PASSWORD };
        this.settings['topic'] = {
            description: 'Topic',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.setSettingsConfig({
            groups: [
                { server: { weight: 3 }, port: { weight: 1 } },
                { enable: {}, authentication: {} },
                { username: {}, password: {} },
            ],
            conditions: {
                username: setting => {
                    return !!setting['authentication'].value;
                },
                password: setting => {
                    return !!setting['authentication'].value;
                },
            },
        });
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
        this.priorityArray = new Array(17).fill({});
        this.lastEnable = false;
    }
    onAdded() {
        this.EXECUTE_INTERVAL = 200;
        this.lastEnable = false;
        this.title = `MQTT Point Read (${this.settings['topic'].value})`;
        if (this.side == container_1.Side.server) {
            this.setOutputData(0, false);
            let enable = this.getInputData(0);
            if (enable == null)
                enable = this.settings['enable'].value;
            if (enable)
                this.connectToBroker();
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
            const topic = this.settings['topic'].value;
            if (topic != '') {
                this.client.subscribe(topic + '/value/res');
                this.client.subscribe(topic + '/json/res');
            }
        });
        this.client.on('close', () => {
            this.setOutputData(0, false);
            this.setOutputData(1, null);
            this.setOutputData(2, null);
            this.setOutputData(3, null);
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
        let enable = this.getInputData(0);
        if (enable == null)
            enable = this.settings['enable'].value;
        if (enable && enable != this.lastEnable)
            this.connectToBroker();
        else if (!enable && enable != this.lastEnable)
            this.disconnectFromBroker();
        this.lastEnable = enable;
    }
    onAfterSettingsChange() {
        this.title = `MQTT Point Read (${this.settings['topic'].value})`;
        if (this.side == container_1.Side.server) {
            this.onInputUpdated();
        }
    }
    onExecute() {
        if (this.messageQueue && this.messageQueue.length > 0) {
            this.processQueue(this.messageQueue.shift());
        }
    }
    processQueue(mqttMessage) {
        let topic = mqttMessage.topic;
        let payload = '';
        console.log('topic:', topic, '   message:', mqttMessage.message);
        if (this.settings['topic'].value + '/value/res' === topic) {
            this.setOutputData(1, mqttMessage.message);
        }
        else if (this.settings['topic'].value + '/json/res' === topic) {
            this.setOutputData(2, mqttMessage.message);
            payload = JSON.parse(mqttMessage.message);
            if (payload.hasOwnProperty('priority')) {
                this.setOutputData(3, parseInt(payload['priority']));
            }
            if (payload.hasOwnProperty('value')) {
                this.setOutputData(1, payload['value']);
            }
        }
    }
}
container_1.Container.registerNodeType('protocols/mqtt/point-read', MqttPointReadNode);
//# sourceMappingURL=mqtt-point-read_old.js.map