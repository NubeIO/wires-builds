"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class JsonConstantNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Json Constant';
        this.description = `Outputs a JSON value set from settings. Can also output null by leaving the settings field blank. Example {"name":"John Hill", "age":31} or [1,2,3,4]`;
        this.settings['value'] = { description: 'Value', value: '', type: node_1.SettingType.STRING };
        this.addOutput('output', node_1.Type.JSON);
        this.addOutput('valid', node_1.Type.BOOLEAN);
        this.addOutput('msg', node_1.Type.STRING);
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    isJson(item) {
        item = typeof item !== 'string' ? JSON.stringify(item) : item;
        try {
            item = JSON.parse(item);
        }
        catch (e) {
            return false;
        }
        if (typeof item === 'object' && item !== null) {
            return true;
        }
        return false;
    }
    onAfterSettingsChange() {
        const val = this.settings['value'].value;
        try {
            if (this.isJson(val)) {
                this.setOutputData(0, val);
                this.setOutputData(1, true);
                this.setOutputData(2, 'valid JSON');
            }
            else {
                this.setOutputData(0, val);
                this.setOutputData(1, false);
                this.setOutputData(2, 'invalid JSON');
            }
        }
        catch (err) {
            this.setOutputData(0, val);
            this.setOutputData(1, false);
            this.setOutputData(2, err);
        }
    }
}
container_1.Container.registerNodeType('point/json-constant', JsonConstantNode);
//# sourceMappingURL=json-constant.js.map