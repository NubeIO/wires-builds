"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const container_1 = require("../../../container");
const container_node_1 = require("../../../container-node");
const node_1 = require("../../../node");
const mqtt_types_1 = require("./mqtt-types");
const mqtt_utils_1 = require("./mqtt-utils");
class MqttNetworkNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.writerNodes = [];
        this.readerNodes = [];
        this.title = 'MQTT Network';
        this.description = 'This node acts as a container for MQTT nodes. ' +
            'All MQTT nodes should be added within the MQTT-Network container. ' +
            'The MQTT broker details can be configured in settings.';
        this.settings['server'] = {
            description: 'Broker URL',
            value: 'localhost',
            type: node_1.SettingType.STRING,
        };
        this.settings['port'] = { description: 'Broker port', value: 1883, type: node_1.SettingType.NUMBER };
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, false, 'Enable', false);
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
    }
    onAfterSettingsChange(oldSettings) {
        super.onAfterSettingsChange(oldSettings);
        for (let node of this.writerNodes) {
            mqtt_utils_1.default.sendNodeToChild(node, this);
        }
        for (let node of this.readerNodes) {
            mqtt_utils_1.default.sendNodeToChild(node, this);
        }
    }
    subscribe({ action, payload }) {
        switch (action) {
            case mqtt_types_1.ADD_MQTT_WRITER:
                this.writerNodes.push(payload);
                break;
            case mqtt_types_1.ADD_MQTT_READER:
                this.readerNodes.push(payload);
                break;
            case mqtt_types_1.REMOVE_MQTT_WRITER:
                this.writerNodes = this.writerNodes.filter(node => node.id !== payload.id);
                break;
            case mqtt_types_1.REMOVE_MQTT_READER:
                this.readerNodes = this.readerNodes.filter(node => node.id !== payload.id);
                break;
            default:
                this.debugWarn('Request action doesn\'t match');
        }
    }
}
container_1.Container.registerNodeType(constants_1.MQTT_NETWORK, MqttNetworkNode);
//# sourceMappingURL=mqtt-network.js.map