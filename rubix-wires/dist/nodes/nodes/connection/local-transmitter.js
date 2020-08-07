"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_1 = require("../../node");
const utils_1 = require("../../utils");
class ConnectionLocalTransmitterNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Link Transmitter';
        this.description =
            "This node works in conjunction with link-receiver node, and provides a connection of nodes without the graphical wires.  'in #' inputs will be sent to the corresponding 'out #' output on link-receiver nodes with matching 'Channel Number' settings.  The number of inputs is configurable from settings.";
        this.settings['channel'] = {
            description: 'Channel Number',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['inputsCount'] = {
            description: 'Inputs Count',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
    }
    init() {
        this.properties['inputsCount'] = 0;
        this.changeTopicsCount(this.settings['inputsCount'].value);
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        for (let i in this.inputs) {
            let val = this.inputs[i].data;
            if (val == undefined)
                val = null;
            let receivers = container_1.Container.containers[0].getNodesByType('connection/link-receiver', true);
            receivers.forEach(receiver => {
                if (receiver.settings['channel'].value == this.settings['channel'].value) {
                    if (receiver.outputs.hasOwnProperty(i)) {
                        receiver.setOutputData(+i, val, true);
                        if (this.inputs[i].name !== '')
                            receiver.outputs[i].name = this.inputs[i].name;
                    }
                }
            });
        }
    }
    onAfterSettingsChange() {
        this.updateTitle();
        let inputCount = this.settings['inputsCount'].value;
        inputCount = utils_1.default.clamp(inputCount, 1, 100);
        if (inputCount !== this.properties['inputsCount'])
            this.changeTopicsCount(inputCount);
        this.renameInputs();
        this.persistProperties(true, true, true);
        this.onInputUpdated();
    }
    changeTopicsCount(target_count) {
        let diff = target_count - this.properties['inputsCount'];
        if (diff == 0)
            return;
        this.changeInputsCount(target_count, node_1.Type.STRING);
        if (diff > 0) {
            for (let i = this.properties['inputsCount'] + 1; i <= target_count; i++) {
                this.settings['in' + i] = {
                    description: 'Input ' + i,
                    value: '',
                    type: node_1.SettingType.STRING,
                };
            }
        }
        else if (diff < 0) {
            for (let i = this.properties['inputsCount']; i > target_count; i--) {
                delete this.settings['in' + i];
            }
        }
        this.properties['inputsCount'] = target_count;
    }
    renameInputs() {
        for (let i = 0; i <= this.properties['inputsCount'] - 1; i++) {
            let topic = this.settings['in' + (i + 1)].value;
            if (topic.length > 20)
                topic = '...' + topic.substr(topic.length - 20, 20);
            this.inputs[String(i)].name = '' + (i + 1) + ' | ' + topic;
        }
        if (this.side == container_1.Side.editor) {
            for (let i = 0; i <= this.properties['inputsCount'] - 1; i++) {
                this.inputs[String(i)].label = this.inputs[String(i)].name;
            }
            this.setDirtyCanvas(true, true);
        }
    }
    updateTitle() {
        this.title = 'Link Transmitter [' + this.settings['channel'].value + ']';
    }
}
exports.ConnectionLocalTransmitterNode = ConnectionLocalTransmitterNode;
container_1.Container.registerNodeType('connection/link-transmitter', ConnectionLocalTransmitterNode);
//# sourceMappingURL=local-transmitter.js.map