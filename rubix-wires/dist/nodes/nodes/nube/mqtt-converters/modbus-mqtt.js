"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const _ = require("lodash");
const node_io_1 = require("../../../node-io");
const LORA_OUT_RATE_LIMIT_MS = 1000;
class ModbusToMqtt extends node_1.Node {
    constructor() {
        super();
        this.title = 'Modbus To MQTT';
        this.description = 'Modbus To MQTT';
        this.settings['host'] = { description: 'Device Name', value: '', type: node_1.SettingType.STRING };
        this.addInput('in', node_io_1.Type.JSON);
        this.addOutput('out', node_io_1.Type.JSON);
        this.addOutput('error', node_io_1.Type.STRING);
    }
    onInputUpdated() {
        let payload = this.getInputData(0);
        if (_.isEmpty(payload)) {
            return;
        }
        if (payload.length <= 2) {
            this.setOutputData(1, 'Invalid input data. input length < 2');
            return;
        }
        const address = payload[0];
        const fc = payload[1];
        const newfc = fc > 6 && fc <= 14 ? fc - 10 : fc;
        let topic = ['slave', 'modbus', 'response', address, newfc];
        let value = null;
        let error = false;
        let error_msg = '';
        let setError = (msg) => {
            error = true;
            error_msg = msg;
        };
        let readDigitalNube = () => {
            if (payload.length !== 5) {
                setError('Invalid msg length for read digital');
                return;
            }
            topic.push(payload[3] + 1);
            value = (payload[4] & 0x01) === 1;
        };
        let writeDigital = () => {
            if (payload.length !== 6) {
                setError('Invalid msg length for write digital');
                return;
            }
            topic.push(payload[3] + 1);
            value = payload[4] === 0xff;
        };
        let readAnalogNube = () => {
            if (payload.length !== 9) {
                setError('Invalid msg length for read analog');
                return;
            }
            topic.push(payload[3] + 1);
            if (payload[4] !== 4) {
                setError('Invalid read analog value returned');
                return;
            }
            const vp = payload.slice(5, 5 + 4);
            const vb = [vp[1], vp[0], vp[3], vp[2]];
            value = parseFloat(Buffer.from(vb)
                .readFloatLE(0)
                .toFixed(2));
        };
        let writeAnalog = () => {
            if (payload.length !== 8) {
                setError('Invalid msg length for write analog');
                return;
            }
            topic.push(payload[3] + 1);
            const vp = payload.slice(4, 4 + 4);
            const vb = [vp[1], vp[0], vp[3], vp[2]];
            value = parseFloat(Buffer.from(vb)
                .readFloatLE(0)
                .toFixed(2));
        };
        let illegalFC = () => {
            let errfc = fc & 0x7f;
            errfc = errfc > 6 && errfc <= 14 ? errfc - 10 : errfc;
            let errorTopic = ['slave', 'modbus', 'response', 'error', address, errfc, payload[2]];
            if (payload[2] == 0x01) {
                this.setOutputData(0, {
                    topic: errorTopic.join('/'),
                    payload: { msg: 'Illegal function code' },
                });
                setError('Illegal function code: ' + newfc.toString());
            }
            else if (payload[2] == 0x02) {
                this.setOutputData(0, {
                    topic: errorTopic.join('/'),
                    payload: { msg: 'Illegal data address' },
                });
                setError('Illegal data address. fc: ' + newfc.toString());
            }
            else {
                this.setOutputData(0, {
                    topic: errorTopic.join('/'),
                    payload: { msg: 'Unhandled error code' },
                });
                setError('Unhandled error code. code: ' + payload[2].toString() + ', fc: ' + newfc.toString());
            }
        };
        switch (fc) {
            case 11:
                readDigitalNube();
                break;
            case 12:
                readDigitalNube();
                break;
            case 13:
                readAnalogNube();
                break;
            case 14:
                readAnalogNube();
                break;
            case 5:
                writeDigital();
                break;
            case 6:
                writeAnalog();
                break;
            default:
                illegalFC();
                break;
        }
        if (error) {
            this.setOutputData(0, null);
            this.setOutputData(1, error_msg);
            return;
        }
        if (value !== null) {
            this.setOutputData(0, JSON.stringify({ topic: topic.join('/'), payload: { value: value } }));
        }
        else {
            this.setOutputData(0, JSON.stringify({ topic: topic.join('/') }));
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('nube/modbus-to-mqtt', ModbusToMqtt);
class MqttToModbus extends node_1.Node {
    constructor() {
        super();
        this.queue = [];
        this.title = 'MQTT To Modbus';
        this.description = 'MQTT To Modbus';
        this.settings['host'] = { description: 'Device Name', value: '', type: node_1.SettingType.STRING };
        this.addInput('in', node_io_1.Type.JSON);
        this.addOutput('out', node_io_1.Type.JSON);
        this.addOutput('error', node_io_1.Type.STRING);
        this.addOutput('queue', node_io_1.Type.NUMBER);
    }
    onAdded() {
        this.onInputUpdated();
        this.EXECUTE_INTERVAL = LORA_OUT_RATE_LIMIT_MS;
    }
    onInputUpdated() {
        let payload = this.getInputData(0);
        let obj = payload;
        if (_.isEmpty(payload)) {
            return;
        }
        if (!obj || !obj.hasOwnProperty('topic')) {
            this.setError('Invalid input. no topic');
            return;
        }
        let topic = obj.topic.split('/');
        if (topic.length < 6 ||
            topic.length > 6 ||
            topic[0] !== 'slave' ||
            topic[1] !== 'modbus' ||
            topic[2] !== 'request') {
            this.setError('Invalid input topic structure');
            return;
        }
        const slave_id = parseInt(topic[3]);
        const fc = parseInt(topic[4]);
        const reg = parseInt(topic[5]);
        let write_value = null;
        if (obj.hasOwnProperty('payload') && obj.payload) {
            if (typeof obj.payload === node_io_1.Type.STRING) {
                obj.payload = JSON.parse(obj.payload);
            }
            if (typeof obj.payload.value === node_io_1.Type.NUMBER || typeof obj.payload.value === node_io_1.Type.BOOLEAN) {
                write_value = obj.payload.value;
            }
            else if (isNaN(parseInt(obj.payload.value))) {
                this.setError('Invalid value in payload');
                return;
            }
            else {
                write_value = parseInt(obj.payload.value);
            }
        }
        if (isNaN(slave_id) || isNaN(fc) || isNaN(fc)) {
            this.setError('Invalid topic (NaN)');
            return;
        }
        if (fc < 1 || fc > 6) {
            this.setError('Invalid function code: ' + fc.toString());
            return;
        }
        const newfc = fc >= 0 && fc <= 4 ? fc + 10 : fc;
        let output = [slave_id, newfc];
        let error = false;
        let error_msg = '';
        const setErrorInner = (msg) => {
            error = true;
            error_msg = msg;
        };
        const readDigital = () => {
            output.push(0x00);
            output.push(reg - 1);
            output.push(0x00);
            output.push(0x01);
        };
        const writeDigital = () => {
            output.push(0x00);
            output.push(reg - 1);
            if (write_value !== true && write_value !== false && write_value !== 1 && write_value !== 0) {
                setErrorInner('invalid write digital value');
                return;
            }
            if (write_value) {
                output.push(0xff);
            }
            else {
                output.push(0x00);
            }
            output.push(0x00);
        };
        const readAnalog = () => {
            output.push(0x00);
            output.push(reg - 1);
            output.push(0x00);
            output.push(0x01);
        };
        const writeAnalog = () => {
            output.push(0x00);
            output.push(reg - 1);
            if (isNaN(write_value)) {
                setErrorInner('invalid write analog value');
                return;
            }
            const b = Buffer.alloc(4);
            b.writeFloatLE(write_value, 0);
            output.push(b[1]);
            output.push(b[0]);
            output.push(b[3]);
            output.push(b[2]);
        };
        switch (fc) {
            case 1:
                readDigital();
                break;
            case 2:
                readDigital();
                break;
            case 3:
                readAnalog();
                break;
            case 4:
                readAnalog();
                break;
            case 5:
                writeDigital();
                break;
            case 6:
                writeAnalog();
                break;
            default:
                return;
        }
        if (error) {
            this.queue.push({ data: null, error: error_msg });
        }
        else {
            this.queue.push({ data: output, error: null });
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
    onExecute() {
        if (this.queue && this.queue.length > 0) {
            const message = this.queue.shift();
            this.setOutputData(0, message.data);
            this.setOutputData(1, message.error);
            this.setOutputData(2, this.queue.length);
        }
    }
    setError(error) {
        this.queue.push({ data: null, error });
    }
}
container_1.Container.registerNodeType('nube/mqtt-to-modbus', MqttToModbus);
//# sourceMappingURL=modbus-mqtt.js.map