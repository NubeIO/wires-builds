"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
class MqttTopicPartsNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'MQTT topic extractor';
        this.description =
            `## Description\n ` +
                ` The is node is used to extract sections out of an MQTT topic\n ` +
                `## Settings\n ` +
                ` Index will let you select the part of the topic that you want to extract ***topic/abc/123*** \n ` +
                ` For example if the ***topic*** = ***topic/abc/123***  and ***index*** = 1 the the node ***output*** will = ***abc*** \n ` +
                `## Inputs\n ` +
                ` The input data must be a sting and in a topic format like ***topic/abc/123*** \n ` +
                `## Outputs\n ` +
                ` ***output*** will return the ***index*** selection \n ` +
                ` ***output-all*** (Returns an array) will return all the topic parts\n ` +
                ` For example if the ***topic*** = ***topic/abc/123***  the  ***output-all*** will return ***[topic, abc, 123]***\n `;
        this.addInput('input', node_1.Type.STRING);
        this.addInputWithSettings('index', node_1.Type.NUMBER, 0, 'Index', false);
        this.addOutput('output', node_1.Type.STRING);
        this.addOutput('output-all', node_1.Type.JSON);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const text = this.getInputData(0);
        const index = this.getInputData(1);
        if (text != null && index != null) {
            const topic = text.split('/');
            this.setOutputData(0, topic[index], true);
            this.setOutputData(1, topic, true);
        }
        else {
            this.setOutputData(0, null, true);
            this.setOutputData(1, null, true);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('protocols/mqtt/mqtt-topic-extractor', MqttTopicPartsNode);
//# sourceMappingURL=topic-parts.js.map