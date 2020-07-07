"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            description: "Example (comma separated, '.' to denote level):\nnodeID, values.temperature, values.voltage",
            value: '',
            type: node_1.SettingType.STRING,
        };
    }
    onInputUpdated() {
        let input = this.getInputData(0);
        if (input === null) {
            this.setOutputData(0, null);
            this.setOutputData(0, null);
            return;
        }
        function findVal(object, key) {
            let newObject = object;
            if (key.includes('.')) {
                let subLevels = key.split('.');
                key = subLevels[subLevels.length - 1];
                for (let i = 0; i < subLevels.length - 1; i++) {
                    if (newObject.hasOwnProperty(subLevels[i])) {
                        newObject = newObject[subLevels[i]];
                    }
                    else {
                        return null;
                    }
                }
            }
            return newObject.hasOwnProperty(key) && newObject[key] !== undefined ? newObject[key] : null;
        }
        try {
            input = JSON.parse(input);
            for (let i = 0; i < this.filterKeys.length; i++) {
                let out = findVal(input, this.filterKeys[i]);
                this.setOutputData(i + 1, out);
            }
            this.setOutputData(0, null);
        }
        catch (e) {
            this.setOutputData(0, null);
            this.setOutputData(0, e);
        }
    }
    onAfterSettingsChange() {
        this.filterKeys = this.settings['filter'].value.replace(/ /g, '').split(',');
        const len = this.getOutputsCount();
        for (let i = 1; i < len; i++) {
            this.removeOutput(i);
        }
        for (let i = 0; i < this.filterKeys.length; i++) {
            this.addOutput(this.filterKeys[i], node_1.Type.ANY);
        }
        this.updateNodeOutput();
        this.updateOutputsLabels();
        this.broadcastOutputsToClients();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('json/json-filter-multiple', JsonFilterMultiple);
//# sourceMappingURL=json-filter-multiple.js.map