"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const _ = require("lodash");
class JSONBuilderNode extends node_1.Node {
    constructor() {
        super();
        this.filterKeys = [];
        this.title = `JSON builder`;
        this.description = 'JSON builder';
        this.settings['definition'] = {
            description: 'payload definition (JSON)',
            type: node_1.SettingType.STRING,
            value: '',
        };
        this.addInput('trigger', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.JSON);
    }
    init() {
        this.addInputs();
    }
    onAdded() {
        this.filterKeys = this.getFilterKeys();
    }
    onInputUpdated() {
        let out = {};
        for (let i = this.dynamicOutputStartPosition(); i < this.getInputsCount(); i++) {
            out = Object.assign(Object.assign({}, out), { [this.filterKeys[i - 1]]: this.inputs[i].data });
        }
        this.setOutputData(0, out);
    }
    onAfterSettingsChange() {
        this.updateInputs();
        this.onInputUpdated();
    }
    updateInputs() {
        const filterKeys = this.getFilterKeys();
        if (_.isEqual(_.sortBy(filterKeys), _.sortBy(this.filterKeys))) {
            return;
        }
        const inputsCount = this.getInputsCount();
        for (let i = this.dynamicOutputStartPosition(); i < inputsCount; i++) {
            this.removeInput(i);
        }
        this.addInputs();
    }
    addInputs() {
        this.filterKeys = this.getFilterKeys();
        for (let i = 0; i < this.filterKeys.length; i++) {
            let name = this.filterKeys[i];
            this.addInput(name.toString(), node_1.Type.ANY);
        }
    }
    getFilterKeys() {
        return this.settings['definition'].value
            .replace(/\s+/g, '')
            .split(',')
            .filter(x => !!x);
    }
    dynamicOutputStartPosition() {
        return 1;
    }
}
exports.JSONBuilderNode = JSONBuilderNode;
container_1.Container.registerNodeType('json/json-builder', JSONBuilderNode);
//# sourceMappingURL=json-builder.js.map