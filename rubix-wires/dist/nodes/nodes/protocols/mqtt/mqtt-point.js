"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const mqtt = require("mqtt");
const crypto_utils_1 = require("../../../utils/crypto-utils");
class MqttPointNode extends node_1.Node {
    constructor() {
        super();
        this.topicsCount = 0;
        this.messageQueue = [];
        this.rateLimitMS = 200;
        this.addHistory = (brokerStatus, val, pri, propertiesLog, this_settings, container_db, this_id, container_id) => {
            let records = propertiesLog;
            let record = null;
            if (brokerStatus) {
                record = {
                    val: val,
                    pri: pri,
                    ts: new Date(),
                    sync: true,
                };
            }
            else {
                record = {
                    val: val,
                    pri: pri,
                    ts: new Date(),
                    sync: false,
                };
            }
            records.push(record);
            let max = this_settings['maxRecords'].value;
            records.splice(0, records.length - max);
            if (this.container.db && this_settings['saveToDb'].value) {
                this.container.db.updateNode(this_id, container_id, {
                    $push: { 'properties.log': { $each: [record], $slice: -max } },
                });
            }
            this.setOutputData(4, records.length);
            this.lastHistoryValue = val;
        };
        this.title = 'MQTT Point Write';
        this.description =
            'This node connects to an MQTT Broker, subscribes to a topic, and can publish values.  Once configured (in settings) with a valid ‘Broker URL’, ‘Broker Port’, and ‘Authentication’(if required), this node will read and write to MQTT topics when ‘enable’ is ‘true’.  This node has a built in 16 level priority array.  A ‘Write Priority Level’ must be selected from settings. The highest write priority value will be published to the ‘topic’/value and ‘topic’/json. To release a priority level, a ‘null’ message should be sent on the priority level to be released. This point can be modified by an external MQTT device.  From-External Example: ‘topic’ = “MyTopic”.  To write a value to this MQTT-point from an external MQTT device, a value of the form {value:(your value here), priority:(your priority)} must be published to the MQTT topic “MyTopic/req”.  When any message is published on the MQTT topic “MyTopic/req” this node will publish the updated value to MQTT topic “MyTopic/value” it will also publish complete message JSON to MQTT topic “MyTopic/json”.  If the current value (in Wires) is 55 @ priority 5, then an external MQTT device publishes {value:33, priority:3} to “MyTopic/req” then the MQTT-Point will output 33.  If the external MQTT device then publishes {value:null, priority:3} to “MyTopic/req” then the MQTT-Point output will revert to the next priority value (55 @ priority 5). ';
        this.addInput('[enable]', node_1.Type.BOOLEAN);
        this.addInput('input', node_1.Type.STRING);
        this.addInput('clearHistory', node_1.Type.BOOLEAN);
        this.addOutput('connected', node_1.Type.BOOLEAN);
        this.addOutput('value', node_1.Type.STRING);
        this.addOutput('JSON', node_1.Type.STRING);
        this.addOutput('priority', node_1.Type.NUMBER);
        this.addOutput('historyCount', node_1.Type.NUMBER);
        this.properties['log'] = [];
        this.properties['creationDate'];
        this.properties['birthMsg'];
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
        this.settings['priorityLevel'] = {
            description: 'Write Priority Level',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: this.getConfigItems(16),
            },
            value: 10,
        };
        this.settings['historyGroup'] = {
            description: 'History',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.settings['saveToDb'] = {
            description: 'History Enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['historyMode'] = {
            description: 'History Logging Mode',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: false, text: 'Change Of Value (COV)' },
                    { value: true, text: 'Triggered' },
                ],
            },
            value: false,
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
        this.settings['minuteRoundValue'] = {
            description: 'Round minutes up in increments of',
            value: 0,
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
            ],
            conditions: {
                username: setting => {
                    return !!setting['authentication'].value;
                },
                password: setting => {
                    return !!setting['authentication'].value;
                },
                threshold: setting => {
                    return !setting['historyMode'].value;
                },
            },
        });
        this.priorityArray = new Array(17).fill({});
        this.lastEnable = false;
        this.useTrigger = false;
        this.bufferData = '';
    }
    onAdded() {
        this.EXECUTE_INTERVAL = 200;
        this.lastEnable = false;
        this.title = `MQTT Point Write (${this.settings['topic'].value})`;
        if (this.side == container_1.Side.server) {
            this.setOutputData(0, false);
            let enable = this.getInputData(0);
            if (enable == null)
                enable = this.settings['enable'].value;
            if (enable)
                this.connectToBroker();
        }
    }
    onRemoved() {
        if (this.side !== container_1.Side.server)
            return;
        if (this.client === undefined)
            return;
        try {
            if (this.client.connected) {
                const topic = this.settings['topic'].value;
                this.client.unsubscribe(topic);
            }
        }
        catch (error) { }
    }
    connectToBroker() {
        const topic = this.settings['topic'].value;
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
            if (topic != '') {
                this.client.publish(topic + '/birth', 'my birth msg', { qos: 0, retain: false });
                this.client.subscribe(topic + '/req', { qos: 0, retain: false });
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
        const topic = this.settings['topic'].value;
        if (topic == '')
            return;
        if (enable && this.client) {
            let data = this.inputs[1].data;
            const priority = this.settings['priorityLevel'].value || 9;
            let brokerStatus = this.client.connected;
            let val = data;
            let pri = priority;
            if (this.settings['historyMode'].value && this.getInputData(3) && this.inputs[3].updated) {
                const highestPriority = this.priorityArray.findIndex(element => Object.entries(element).length > 0);
                let val = highestPriority !== -1 ? this.priorityArray[highestPriority]['value'] : null;
                this.addHistory(brokerStatus, val, highestPriority, this.properties['log'], this.settings, this.container, this.id, this.container.id);
            }
            if (data !== undefined) {
                try {
                    data = JSON.parse(data);
                }
                catch (_a) {
                    console.log('Not a valid JSON');
                }
                if (this.inputs[1].updated) {
                    if (brokerStatus) {
                        let obj = {
                            topic: topic + '/req',
                            message: `{"value":"${data}", "priority":${priority}}`,
                            fromNode: true,
                            fromNodePriority: priority,
                        };
                        this.messageQueue.push(obj);
                    }
                    if (!brokerStatus || this.checkCOV()) {
                        this.addHistory(brokerStatus, val, pri, this.properties['log'], this.settings, this.container, this.id, this.container.id);
                    }
                }
            }
        }
    }
    onAfterSettingsChange() {
        this.title = `MQTT Point Write(${this.settings['topic'].value})`;
        const triggerInput = this.settings['historyMode'].value;
        if (triggerInput !== this.useTrigger) {
            if (triggerInput)
                this.addInput('storeHistory', node_1.Type.BOOLEAN);
            else
                this.removeInput(3);
        }
        this.useTrigger = triggerInput;
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
        let fromNode = mqttMessage.fromNode;
        let fromNodePriority = mqttMessage.fromNodePriority;
        if (this.settings['topic'].value + '/value/res' === topic) {
        }
        else if (this.settings['topic'].value + '/json/res' === topic) {
            if (payload.hasOwnProperty('priority')) {
                this.setOutputData(3, parseInt(payload['priority']));
            }
            if (payload.hasOwnProperty('value')) {
                this.setOutputData(1, payload['value']);
                this.lastHistoryValue = payload['value'];
            }
        }
        else if (this.settings['topic'].value + '/req' === topic) {
            payload = mqttMessage.message;
            if (typeof payload == 'object') {
                payload = JSON.stringify(payload);
            }
            try {
                payload = JSON.parse(payload);
            }
            catch (_a) {
                console.log('Not a valid JSON');
            }
            if (payload.hasOwnProperty('priority') && payload.hasOwnProperty('value')) {
                const priority = parseInt(payload['priority']);
                if (payload['value'] === '' || payload['value'] === null) {
                    this.priorityArray[priority] = {};
                }
                else {
                    this.priorityArray[priority] = payload;
                }
            }
            const highestPriority = this.priorityArray.findIndex(element => Object.entries(element).length > 0);
            if (highestPriority == -1) {
                this.setOutputData(1, null, true);
                this.setOutputData(2, null, true);
                this.setOutputData(3, null, true);
                return;
            }
            let brokerStatus = this.client.connected;
            let val = this.priorityArray[highestPriority]['value'];
            let json = this.priorityArray[highestPriority];
            let pri = highestPriority;
            if (fromNode && fromNodePriority <= highestPriority) {
                this.setOutputData(1, val);
                this.setOutputData(2, json);
                this.setOutputData(3, pri);
                this.client.publish(this.settings['topic'].value + '/value/res', '' + val);
                this.client.publish(this.settings['topic'].value + '/json/res', '' + JSON.stringify(json));
            }
            else if (!fromNode) {
                this.setOutputData(1, val);
                this.setOutputData(2, json);
                this.setOutputData(3, pri);
                this.client.publish(this.settings['topic'].value + '/value/res', '' + val, {
                    retain: true,
                });
                this.client.publish(this.settings['topic'].value + '/json/res', '' + JSON.stringify(json), {
                    retain: true,
                });
            }
            if (this.checkCOV()) {
                this.addHistory(brokerStatus, val, pri, this.properties['log'], this.settings, this.container, this.id, this.container.id);
            }
        }
    }
    getConfigItems(num) {
        const configItems = [];
        Array(num)
            .fill(null)
            .map((_, i) => configItems.push({ value: i + 1, text: (i + 1).toString() }));
        return configItems;
    }
    checkCOV() {
        if (!this.settings['historyMode'].value) {
            const output = this.outputs[1].data;
            const threshold = this.settings['threshold'].value;
            if (threshold === 0 && output !== this.lastHistoryValue)
                return true;
            const isNumber = typeof output === 'number';
            if (this.inputs[0].updated && output !== this.lastHistoryValue) {
                if (typeof this.lastHistoryValue !== 'number' ||
                    !isNumber ||
                    (isNumber && Math.abs(output - this.lastHistoryValue) >= this.settings['threshold'].value))
                    return true;
            }
        }
        return false;
    }
}
container_1.Container.registerNodeType('protocols/mqtt/point-write', MqttPointNode);
//# sourceMappingURL=mqtt-point.js.map