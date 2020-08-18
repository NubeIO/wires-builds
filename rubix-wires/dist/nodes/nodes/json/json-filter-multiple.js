"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const node_1 = require("../../node");
const container_1 = require("../../container");
class JsonFilterMultiple extends node_1.Node {
    constructor() {
        super();
        this.filterKeys = [];
        this.title = 'Json Filter Multiple';
        this.description = 'Filter a json object to multiple outputs';
        this.addInput('input', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
        this.settings['filter'] = {
            description: 'Example: key1.innerKey1, key2, key2.innerKey2',
            value: '',
            type: node_1.SettingType.STRING,
        };
    }
    init() {
        this.addOutputs();
    }
    onAdded() {
        this.filterKeys = this.getFilterKeys();
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        if (input == null) {
            this.setOutputData(0, null);
            return;
        }
        try {
            input = JSON.parse(input);
            for (let i = 0; i < this.filterKeys.length; i++) {
                let out = _.get(input, this.filterKeys[i]);
                if (out != null) {
                    this.setOutputData(i + this.dynamicOutputStartPosition(), out);
                }
                else {
                    this.setOutputData(i + this.dynamicOutputStartPosition(), null);
                }
            }
            this.setOutputData(0, null);
        }
        catch (e) {
            this.setOutputData(0, e.toString());
            for (let i = 0; i < this.filterKeys.length; i++) {
                this.setOutputData(i + this.dynamicOutputStartPosition(), null);
            }
        }
    }
    onAfterSettingsChange() {
        this.updateOutputs();
        this.updateNodeOutput();
        this.updateOutputsLabels();
        this.broadcastOutputsToClients();
        this.onInputUpdated();
    }
    updateOutputs() {
        const filterKeys = this.getFilterKeys();
        if (_.isEqual(_.sortBy(filterKeys), _.sortBy(this.filterKeys))) {
            return;
        }
        const outputsCount = this.getOutputsCount();
        for (let i = this.dynamicOutputStartPosition(); i < outputsCount; i++) {
            this.removeOutput(i);
        }
        this.addOutputs();
    }
    addOutputs() {
        this.filterKeys = this.getFilterKeys();
        for (let i = 0; i < this.filterKeys.length; i++) {
            this.addOutput(this.filterKeys[i], node_1.Type.ANY);
        }
    }
    getFilterKeys() {
        return this.settings['filter'].value
            .replace(/\s+/g, '')
            .split(',')
            .filter(x => !!x);
    }
    dynamicOutputStartPosition() {
        return 1;
    }
}
container_1.Container.registerNodeType('json/json-filter-multiple', JsonFilterMultiple);
//# sourceMappingURL=json-filter-multiple.js.map