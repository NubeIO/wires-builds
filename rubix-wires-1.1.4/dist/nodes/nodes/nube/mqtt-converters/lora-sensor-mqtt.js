"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const _ = require("lodash");
class LoRaSensorToMqtt extends node_1.Node {
    constructor() {
        super();
        this.title = 'LoRa sensor To MQTT';
        this.description = 'LoRa sensor To MQTT';
        this.settings['host'] = { description: 'Device Name', value: '', type: node_1.SettingType.STRING };
        this.addInput('in', node_1.Type.JSON);
        this.addOutput('out', node_1.Type.JSON);
        this.addOutput('error', node_1.Type.STRING);
    }
    onInputUpdated() {
        let payload = this.getInputData(0);
        if (_.isEmpty(payload)) {
            return;
        }
        let topic = ['sensor'];
        if (!payload.hasOwnProperty('id') ||
            !payload.hasOwnProperty('voltage') ||
            !payload.hasOwnProperty('rssi')) {
            this.setOutputData(1, 'Invalid input data. missing fields');
            return;
        }
        switch (payload.id.substring(2, 4)) {
            case 'AA':
                topic.push('MICRO');
                break;
            case 'B0':
                topic.push('TH');
                break;
            case 'B1':
                topic.push('THL');
                break;
            case 'B2':
                topic.push('THLM');
                break;
            default:
                this.setOutputData(1, 'Invalid sensor ID');
                return;
        }
        topic.push('response');
        topic.push(payload.id);
        this.setOutputData(1, null);
        this.setOutputData(0, { payload: payload, topic: topic.join('/') });
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('nube/lora-sensor-to-mqtt', LoRaSensorToMqtt);
//# sourceMappingURL=lora-sensor-mqtt.js.map