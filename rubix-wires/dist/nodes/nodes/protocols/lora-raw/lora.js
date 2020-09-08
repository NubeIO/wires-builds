"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const node_io_1 = require("../../../node-io");
const time_utils_1 = require("../../../utils/time-utils");
var SensorType;
(function (SensorType) {
    SensorType["Droplet"] = "Droplet";
    SensorType["MicroEdge"] = "MicroEdge";
})(SensorType || (SensorType = {}));
class LoraSensorDecoderNode extends node_1.Node {
    constructor() {
        super();
        this.watchdogDelay = 3600000;
        this.nodeID = '';
        this.title = `Lora Sensor Decoder (Droplet | Micro)`;
        this.description =
            'This node is used to decode raw serial input messages to LORA sensor values. It should be used in conjunction with the protocols/serial-connector node. If a ‘nodeID’ is set, only messages from matching LORA sensors will be output;  if no ‘nodeID’ is set, all valid LORA sensor messages will be output.  Outputs that are not present in the raw serial input message will be ‘null’.  ‘lowBatteryAlm’ output will be ‘true’ if the LORA sensor has a battery ‘voltage’ value less than the ‘Low battery warning voltage’ setting; otherwise it will be ‘false’.  ‘watchdog’ output will be ‘true’ if there has been no valid message from the ‘nodeID’ LORA sensor for the ‘Watchdog Delay’; otherwise ‘watchdog’ output will be false.  Maximum ‘Watchdog Delay’ setting is 587 hours.  This node can be used for decoding Nube Droplet sensors, and Nube MicroEdge sensors.  The sensor type can be selected from settings.';
        this.settings['sensorType'] = {
            description: 'LORA Sensor Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: SensorType.Droplet, text: SensorType.Droplet },
                    { value: SensorType.MicroEdge, text: SensorType.MicroEdge },
                ],
            },
            value: 'Droplet',
        };
        this.addInput('rawInput', node_io_1.Type.STRING);
        this.addInputWithSettings('nodeID', node_io_1.Type.STRING, '', 'NodeID');
        this.addInputWithSettings('topic', node_io_1.Type.STRING, '', 'Set topic for use elsewhere in wires');
        this.addOutput('json', node_io_1.Type.STRING);
        this.addOutput('id', node_io_1.Type.STRING);
        this.addOutput('voltage', node_io_1.Type.NUMBER);
        this.addOutput('rssi', node_io_1.Type.NUMBER);
        this.addOutput('lowBatteryAlm', node_io_1.Type.BOOLEAN);
        this.addOutput('watchdog', node_io_1.Type.BOOLEAN);
        this.addOutput('temperature', node_io_1.Type.NUMBER);
        this.addOutput('humidity', node_io_1.Type.NUMBER);
        this.addOutput('lux', node_io_1.Type.NUMBER);
        this.addOutput('pressure', node_io_1.Type.NUMBER);
        this.addOutput('movement', node_io_1.Type.BOOLEAN);
        this.settings['microEdgeA1'] = {
            description: 'MicroEdge a1 Input Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: '10k', text: '10k Thermistor' },
                    { value: '10vdc', text: '0-10vdc' },
                    { value: 'digital', text: 'Digital' },
                ],
            },
            value: '10vdc',
        };
        this.settings['microEdgeA2'] = {
            description: 'MicroEdge a2 Input Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: '10k', text: '10k Thermistor' },
                    { value: '10vdc', text: '0-10vdc' },
                    { value: 'digital', text: 'Digital' },
                ],
            },
            value: '10vdc',
        };
        this.settings['microEdgeA3'] = {
            description: 'MicroEdge a3 Input Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: '10k', text: '10k Thermistor' },
                    { value: '10vdc', text: '0-10vdc' },
                    { value: 'digital', text: 'Digital' },
                ],
            },
            value: '10vdc',
        };
        this.settings['battery-warn'] = {
            description: 'Low battery warning voltage',
            value: 3.5,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['watchdog'] = {
            description: 'Watchdog (No message warning) Delay',
            value: 60,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['time'] = {
            description: 'Time',
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
            groups: [{ time: {}, watchdog: { weight: 2 } }],
            conditions: {
                microEdgeA1: setting => {
                    return setting['sensorType'].value === SensorType.MicroEdge;
                },
                microEdgeA2: setting => {
                    return setting['sensorType'].value === SensorType.MicroEdge;
                },
                microEdgeA3: setting => {
                    return setting['sensorType'].value === SensorType.MicroEdge;
                },
            },
        });
    }
    onAdded() {
        this.sensorType = this.settings['sensorType'].value;
        if (this.sensorType === SensorType.MicroEdge) {
            this.removeOutput(10);
        }
        this.clearOutputs();
        this.updateTitle();
    }
    onInputUpdated() {
        const sensorType = this.settings['sensorType'].value;
        let nodeID = this.getInputData(1).toUpperCase() || '';
        if (nodeID != this.nodeID) {
            this.nodeID = nodeID;
            this.updateTitle();
            this.broadcastTitleToClients();
            this.clearOutputs();
            this.resetWatchdog();
        }
        let data = this.getInputData(0) || '';
        if (!data)
            return;
        else if (data.length % 2 === 1 && (data[data.length - 1] === '\r' || data[data.length - 1] === '\n')) {
            data = data.substring(0, data.length - 1);
        }
        else if (data.substring(data.length - 2, data.length) === '\r\n') {
            data = data.substring(0, data.length - 2);
        }
        if (data.length !== 36 &&
            data.length !== 44 &&
            data.substring(2, 4) !== 'AA' &&
            data.substring(2, 4) !== 'B0' &&
            data.substring(2, 4) !== 'B1' &&
            data.substring(2, 4) !== 'B2') {
            return;
        }
        if (nodeID == data.substring(0, 8) || nodeID == '') {
            if (sensorType === SensorType.MicroEdge &&
                data.substring(2, 4) === 'AA' &&
                (data.length === 44 || data.length === 36)) {
                if (this.inputs[0].updated)
                    this.resetWatchdog();
                this.writeOutputs(this.microEdgeDecode(data));
            }
            else if (sensorType === SensorType.Droplet &&
                data.substring(2, 3) === 'B' &&
                (data.length === 44 || data.length === 36)) {
                if (this.inputs[0].updated)
                    this.resetWatchdog();
                this.writeOutputs(this.dropletDecode(data));
            }
        }
    }
    onAfterSettingsChange() {
        let watchdogTime = this.settings['watchdog'].value;
        watchdogTime = time_utils_1.default.timeConvert(watchdogTime, this.settings['time'].value);
        if (this.watchdogDelay != watchdogTime) {
            this.resetWatchdog();
        }
        this.setOutputs();
        this.updateNodeOutput();
        this.onInputUpdated();
    }
    writeOutputs(output) {
        switch (this.settings['sensorType'].value) {
            case SensorType.Droplet:
                this.setOutputData(0, JSON.stringify(output));
                this.setOutputData(1, output['id'] == null ? null : output['id']);
                this.setOutputData(2, output['voltage'] == null ? null : output['voltage']);
                this.setOutputData(3, output['rssi'] == null ? null : output['rssi']);
                this.setOutputData(4, output['voltage'] < this.settings['battery-warn'].value);
                this.setOutputData(6, output['temp'] == null ? null : output['temp']);
                this.setOutputData(7, output['humidity'] == null ? null : output['humidity']);
                this.setOutputData(8, output['lux'] == null ? null : output['lux']);
                this.setOutputData(9, output['pressure'] == null ? null : output['pressure']);
                this.setOutputData(10, output['movement'] == null ? null : output['movement']);
                break;
            case SensorType.MicroEdge:
                this.setOutputData(0, JSON.stringify(output));
                this.setOutputData(1, output['id'] == null ? null : output['id']);
                this.setOutputData(2, output['voltage'] == null ? null : output['voltage']);
                this.setOutputData(3, output['rssi'] == null ? null : output['rssi']);
                this.setOutputData(4, output['voltage'] < this.settings['battery-warn'].value);
                this.setOutputData(6, output['pulses'] == null ? null : output['pulses']);
                const microEdgeOutputs = this.MicroEdgeAnalogs([output['a1'], output['a2'], output['a3']]);
                this.setOutputData(7, microEdgeOutputs[0] == null ? null : microEdgeOutputs[0]);
                this.setOutputData(8, microEdgeOutputs[1] == null ? null : microEdgeOutputs[1]);
                this.setOutputData(9, microEdgeOutputs[2] == null ? null : microEdgeOutputs[2]);
                break;
        }
    }
    MicroEdgeAnalogs(analogInputs) {
        let output = [];
        for (var i = 0; i < 3; i++) {
            if (typeof analogInputs[i] == 'number') {
                switch (this.settings[`microEdgeA${i + 1}`].value) {
                    case '10k':
                        const Vref = 3.34;
                        const V = (analogInputs[i] / 1024) * Vref;
                        const R0 = 10000;
                        const R = (R0 * V) / (Vref - V);
                        const T0 = 273 + 25;
                        const B = 3850;
                        const T = 1 / (1 / T0 + (1 / B) * Math.log(R / R0));
                        const temp = T - 273.15;
                        output.push(Math.round(temp * 100) / 100);
                        break;
                    case '10vdc':
                        output.push((analogInputs[i] / 1024) * 10);
                        break;
                    case 'digital':
                        if (analogInputs[i] === undefined || analogInputs[i] >= 1000) {
                            output.push(false);
                        }
                        else {
                            output.push(true);
                        }
                        break;
                }
            }
            else
                output.push(null);
        }
        return output;
    }
    lastMessageTimeStamp() {
        return new Date();
    }
    microEdgeDecode(data) {
        const topic = this.getInputData(2);
        const topicsBuilder = {
            id: topic + "/id",
            pulses: topic + "/pulses",
            voltage: topic + "/voltage",
            a1: topic + "/a1",
            a2: topic + "/a2",
            a3: topic + "/a3",
            rssi: topic + "/rssi",
            snr: topic + "/snr"
        };
        let lastMessage = null;
        lastMessage = this.lastMessageTimeStamp();
        return {
            id: data.substring(0, 8),
            pulses: parseInt(data.substring(8, 16), 16),
            voltage: parseInt(data.substring(16, 18), 16) / 50,
            a1: parseInt(data.substring(18, 22), 16),
            a2: parseInt(data.substring(22, 26), 16),
            a3: parseInt(data.substring(26, 30), 16),
            rssi: parseInt(data.substring(data.length - 4, data.length - 2), 16) * -1,
            snr: parseInt(data.substring(data.length - 2, data.length), 16) / 10,
            nodeName: this.name,
            topic: topicsBuilder,
            lastMessage: lastMessage
        };
    }
    dropletDecode(data) {
        const topic = this.getInputData(2);
        const topicsBuilder = {
            id: topic + "/id",
            temp: topic + "/temp",
            pressure: topic + "/pressure",
            humidity: topic + "/humidity",
            lux: topic + "/lux",
            movement: topic + "/movement",
            voltage: topic + "/voltage",
            rssi: topic + "/rssi",
            snr: topic + "/snr"
        };
        let lastMessage = null;
        lastMessage = this.lastMessageTimeStamp();
        let output = {
            id: data.substring(0, 8),
            temp: parseInt(data.substring(10, 12) + data.substring(8, 10), 16) / 100,
            pressure: parseInt(data.substring(14, 16) + data.substring(12, 14), 16) / 10,
            humidity: parseInt(data.substring(16, 18), 16) % 128,
            voltage: parseInt(data.substring(22, 24), 16) / 50,
            rssi: parseInt(data.substring(data.length - 4, data.length - 2), 16) * -1,
            snr: parseInt(data.substring(data.length - 2, data.length), 16) / 10,
            nodeName: this.name,
            topic: topicsBuilder,
            lastMessage: lastMessage
        };
        if (data.substring(2, 4) === 'B1' || data.substring(2, 4) === 'B2') {
            const b1Sensor = output;
            b1Sensor.lux = parseInt(data.substring(20, 22) + data.substring(18, 20), 16);
            output = b1Sensor;
            if (data.substring(2, 4) == 'B2') {
                const b2_sensor = b1Sensor;
                b2_sensor.movement = parseInt(data.substring(16, 18), 16) > 127;
                output = b2_sensor;
            }
        }
        return output;
    }
    resetWatchdog() {
        this.setOutputData(5, false, true);
        clearInterval(this.timeoutFunc);
        let watchdogTime = this.settings['watchdog'].value;
        watchdogTime = time_utils_1.default.timeConvert(watchdogTime, this.settings['time'].value);
        this.watchdogDelay = watchdogTime;
        this.timeoutFunc = setTimeout(() => {
            this.setOutputData(5, true, true);
        }, watchdogTime);
    }
    setOutputs() {
        const currentSensorType = this.settings['sensorType'].value;
        if (this.sensorType != currentSensorType) {
            switch (currentSensorType) {
                case SensorType.Droplet:
                    this.removeOutput(6);
                    this.removeOutput(7);
                    this.removeOutput(8);
                    this.removeOutput(9);
                    if (this.outputs[10])
                        this.removeOutput(10);
                    this.addOutput('temperature', node_io_1.Type.NUMBER);
                    this.addOutput('humidity', node_io_1.Type.NUMBER);
                    this.addOutput('lux', node_io_1.Type.NUMBER);
                    this.addOutput('pressure', node_io_1.Type.NUMBER);
                    this.addOutput('movement', node_io_1.Type.BOOLEAN);
                    this.clearOutputs();
                    break;
                case SensorType.MicroEdge:
                    this.removeOutput(6);
                    this.removeOutput(7);
                    this.removeOutput(8);
                    this.removeOutput(9);
                    this.removeOutput(10);
                    if (this.outputs[11])
                        this.removeOutput(11);
                    this.addOutput('pulses', node_io_1.Type.NUMBER);
                    this.addOutput('a1', node_io_1.Type.NUMBER);
                    this.addOutput('a2', node_io_1.Type.NUMBER);
                    this.addOutput('a3', node_io_1.Type.NUMBER);
                    this.clearOutputs();
                    break;
            }
        }
        if (currentSensorType == SensorType.MicroEdge) {
            this.outputs[7].name = `a1 (${this.settings['microEdgeA1'].value})`;
            this.outputs[8].name = `a2 (${this.settings['microEdgeA2'].value})`;
            this.outputs[9].name = `a3 (${this.settings['microEdgeA3'].value})`;
        }
        this.sensorType = currentSensorType;
        this.updateTitle();
    }
    updateTitle() {
        if (this.nodeID)
            this.title = `Lora Sensor Decoder (${this.sensorType} | ${this.nodeID})`;
        else
            this.title = `Lora Sensor Decoder (${this.sensorType} | ALL)`;
    }
    clearOutputs() {
        this.setOutputData(0, null);
        this.setOutputData(1, null);
        this.setOutputData(2, null);
        this.setOutputData(3, null);
        this.setOutputData(4, null);
        this.setOutputData(5, null);
        this.setOutputData(6, null);
        this.setOutputData(7, null);
        this.setOutputData(8, null);
        this.setOutputData(9, null);
        if (this.settings['sensorType'].value === SensorType.Droplet)
            this.setOutputData(10, null);
    }
}
exports.LoraSensorDecoderNode = LoraSensorDecoderNode;
container_1.Container.registerNodeType('protocols/lora-raw/lora-sensor-decoder', LoraSensorDecoderNode);
//# sourceMappingURL=lora.js.map