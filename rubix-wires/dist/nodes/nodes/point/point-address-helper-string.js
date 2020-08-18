"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_1 = require("../../node");
const utils_1 = require("../../utils");
class AddressHelperString extends node_1.Node {
    constructor() {
        super();
        this.topicsCount = 0;
        this.title = 'Point Address Builder String';
        this.description =
            'This node connects to an MQTT Broker, subscribes to topics, and can publish values to topics.  Once configured (in settings) with a valid ‘Broker URL’, ‘Broker Port’, and ‘Authentication’ (if required), this node will read and write to MQTT topics when ‘enable’ is ‘true’.  Number of topics, and the topic names can be configured from settings.  Each topic will have a corresponding input and output. ';
        this.settings['attribute_1'] = {
            description: 'attribute_1',
            value: '1',
            type: node_1.SettingType.STRING,
        };
        this.settings['topics_count'] = {
            description: 'Number of Topics',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.setSettingsConfig({
            groups: [{ topics_count: {} }],
        });
    }
    init() {
        this.changeOutputsAndSettings();
    }
    onCreated() {
        this.renameInputsOutputs();
    }
    onAdded() {
        this.topicsCount = this.settings['topics_count'].value;
        this.onAfterSettingsChange();
    }
    onAfterSettingsChange() {
        this.changeOutputsAndSettings();
        this.renameInputsOutputs();
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { outputs: this.outputs, settings: this.settings },
            });
    }
    changeOutputsAndSettings() {
        let topics = this.settings['topics_count'].value;
        topics = utils_1.default.clamp(topics, 1, 100);
        this.settings['topics_count'].value = topics;
        if (this.topicsCount != topics)
            this.changeTopicsCount(topics);
    }
    changeTopicsCount(target_count) {
        const diff = target_count - this.topicsCount;
        if (diff == 0)
            return;
        this.changeOutputsCount(target_count + 1, node_1.Type.STRING);
        if (diff > 0) {
            for (let i = this.topicsCount + 1; i <= target_count; i++) {
                this.settings['topic' + i] = {
                    description: 'Topic ' + i,
                    value: '',
                    type: node_1.SettingType.STRING,
                };
                for (let i = this.topicsCount + 1; i <= target_count; i++) {
                    this.settingConfigs.groups.push({
                        [`topic${i}`]: { weight: 5 },
                    });
                }
            }
        }
        else if (diff < 0) {
            for (let i = this.topicsCount; i > target_count; i--) {
                delete this.settings['topic' + i];
                this.settingConfigs.groups.pop();
            }
        }
        this.topicsCount = target_count;
    }
    renameInputsOutputs() {
        const input = this.settings['attribute_1'].value;
        for (let i = 1; i <= this.topicsCount; i++) {
            const topic = this.settings['topic' + i].value;
            this.outputs[i].name = '' + i + ' | ' + topic;
            this.setOutputData(i, input + topic);
        }
    }
}
container_1.Container.registerNodeType('point/address-helper-string', AddressHelperString);
//# sourceMappingURL=point-address-helper-string.js.map