"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const helper_1 = require("../../../utils/helper");
class JsonConstantNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Json Constant';
        this.description = `Outputs a JSON value set from settings. Can also output null by leaving the settings field blank. Example {"name":"John Hill", "age":31} or [1,2,3,4]`;
        this.addInputWithSettings('value', node_io_1.Type.JSON, '{ "measurement": 22 }', 'JSON value');
        this.settings['passNull'] = {
            description: 'Send null if not a match',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.addOutput('output', node_io_1.Type.JSON);
        this.addOutput('valid-json', node_io_1.Type.BOOLEAN);
        this.addOutput('msg', node_io_1.Type.STRING);
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        const passNull = this.settings['passNull'].value;
        try {
            if (helper_1.isJSON(val) && !helper_1.isEmpty(val)) {
                this.setOutputData(0, val);
                this.setOutputData(1, true);
                this.setOutputData(2, 'valid JSON');
            }
            else if (passNull) {
                this.setOutputData(0, null);
                this.setOutputData(1, false);
                this.setOutputData(2, 'invalid JSON');
            }
            else {
                this.setOutputData(1, false);
                this.setOutputData(2, 'invalid JSON');
            }
        }
        catch (err) {
            this.setOutputData(1, false);
            this.setOutputData(2, err);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('point/json-constant', JsonConstantNode);
//# sourceMappingURL=json-constant.js.map