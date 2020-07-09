"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const decorators_1 = require("../../../../decorators");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const registry_1 = require("../../../registry");
const node_mixin_1 = require("../../node-mixin");
const point_node_1 = require("../model/point-node");
const mqtt_client_node_1 = require("./mqtt-client-node");
const mqtt_model_1 = require("./mqtt-model");
const mqtt_subscriber_helper_1 = require("./mqtt-subscriber-helper");
var HistoryMode;
(function (HistoryMode) {
    HistoryMode[HistoryMode["COV"] = 0] = "COV";
    HistoryMode[HistoryMode["TRIGGERED"] = 1] = "TRIGGERED";
})(HistoryMode || (HistoryMode = {}));
class MqttPointPublisherNode extends point_node_1.PointNodeMixin(node_mixin_1.AbleEnableNode(node_1.Node)) {
    constructor() {
        var _a, _b;
        super();
        this.EXECUTE_INTERVAL = 200;
        this.title = 'MQTT Point Publisher';
        this.description =
            'This node connects to an MQTT Broker, subscribes to a topic, and can publish values once we enable the node. ' +
                'This node has a built in 16 level priority array. A "Write Priority Level" must be selected from settings. ' +
                'The highest write priority value will be published to the `topic/res`. ' +
                'To release a priority level, a `null` message should be sent on the priority level to be released. ' +
                'This point can be modified by an external MQTT device. From-External Example: `topic = "MyTopic"`. ' +
                'To write a value to this MQTT-point from an external MQTT device, a value of the form ' +
                '`{value:${value}, priority:${priority}}` must be published to the MQTT topic `MyTopic/req`. When ' +
                'any message is published on the MQTT topic `MyTopic/req` this node will publish the updated ' +
                'value to MQTT topic `MyTopic/value` it will also publish complete message JSON to MQTT topic `MyTopic/json`. ' +
                'If the current value (in Wires) is 55 @ priority 5, then an external MQTT device publishes ' +
                '`{value:33, priority:3}` to `MyTopic/req` then the `MQTT Point` will output 33. If the external MQTT device ' +
                'then publishes `{value:null, priority:3}` to `MyTopic/req` then the `MQTT Point` output will revert to the ' +
                'next priority value (55 @ priority 5).';
        this.mixinEnableInputSetting();
        this.addInputWithSettings('topic', node_1.Type.STRING, '', 'MQTT Topic');
        let pvSettingCfg = this.mixinPointValueInputOutput();
        let historySettingCfg = this.mixinHistoryFields();
        this.setSettingsConfig({
            groups: [{ enable: {}, enableHistory: {} }],
            conditions: lodash_1.merge((_a = historySettingCfg) === null || _a === void 0 ? void 0 : _a.conditions, (_b = pvSettingCfg) === null || _b === void 0 ? void 0 : _b.conditions),
        });
        this.properties['log'] = [];
    }
    onRemoved() {
        let payload = {};
        payload[this.modelSettingKey()] = this.initializePointBySettingInput();
        mqtt_subscriber_helper_1.default.unregisterPublisher(this.getParentNode(), payload);
    }
    isEnabled() {
        var _a;
        return ((_a = this.getParentNode()) === null || _a === void 0 ? void 0 : _a.getInputData(0)) && super.isEnabled();
    }
    handleOnUpdate(current, prev) {
        var _a, _b;
        if (this.side !== container_1.Side.server || (!((_a = prev) === null || _a === void 0 ? void 0 : _a.mqttTopic) && !((_b = current) === null || _b === void 0 ? void 0 : _b.mqttTopic))) {
            return null;
        }
        let payload = {
            mqttp: current,
            enable: this.isEnabled(),
            nodeId: registry_1.default.getId(this.cid, this.id),
            func: this.updateOutput,
        };
        if (!prev) {
            return mqtt_subscriber_helper_1.default.registerPublisher(this.getParentNode(), payload);
        }
        if (!this.isEnabled() || !current.mightOnlyValueChanged(prev)) {
            payload['prev'] = prev;
            return mqtt_subscriber_helper_1.default.updatePublisher(this.getParentNode(), payload);
        }
        return mqtt_subscriber_helper_1.default.publishData(this.getParentNode(), payload);
    }
    initializePointBySettingInput(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return mqtt_model_1.MqttPointCreator.by(st['topic'].value, this.createPointValue(st));
    }
    initializePointBySettingObject(settings) {
        let st = ((settings !== null && settings !== void 0 ? settings : this.settings));
        return st[this.modelSettingKey()].value
            ? mqtt_model_1.MqttPointCreator.from(st[this.modelSettingKey()].value)
            : this.initializePointBySettingInput(st);
    }
    handler() {
        return this;
    }
    modelSettingKey() {
        return `mqttp`;
    }
    presentValueInputIdx() {
        return 2;
    }
    computeTitle() {
        return `MQTT Point Publisher (${this.settings['topic'].value})`;
    }
    enableDescription() {
        return 'Enable Publisher';
    }
    updateOutput(pv, nodeId) {
        super.updateOutput(pv, nodeId);
        if (!pv) {
            return;
        }
    }
    mixinHistoryFields() {
        this.settings['enableHistory'] = { description: 'Enable History', value: false, type: node_1.SettingType.BOOLEAN };
        this.settings['historyMode'] = {
            description: 'History Logging Mode',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: HistoryMode.COV, text: 'Change Of Value (COV)' },
                    { value: HistoryMode.TRIGGERED, text: 'Triggered' },
                ],
            },
            value: HistoryMode.COV,
        };
        this.settings['threshold'] = { description: 'COV Threshold', value: 0, type: node_1.SettingType.NUMBER };
        this.settings['maxRecords'] = { description: 'Max Records', value: 100, type: node_1.SettingType.NUMBER };
        return {
            conditions: {
                historyMode: setting => setting['enableHistory'].value,
                threshold: setting => setting['enableHistory'].value && setting['historyMode'].value === HistoryMode.COV,
                maxRecords: setting => setting['enableHistory'].value,
            },
        };
    }
}
__decorate([
    decorators_1.ErrorHandler
], MqttPointPublisherNode.prototype, "handleOnUpdate", null);
__decorate([
    decorators_1.ErrorHandler
], MqttPointPublisherNode.prototype, "initializePointBySettingInput", null);
__decorate([
    decorators_1.ErrorHandler
], MqttPointPublisherNode.prototype, "initializePointBySettingObject", null);
container_1.Container.registerNodeType('protocols/mqtt/mqtt-publisher', MqttPointPublisherNode, mqtt_client_node_1.MQTT_CLIENT_NODE);
//# sourceMappingURL=mqtt-point-publisher.js.map