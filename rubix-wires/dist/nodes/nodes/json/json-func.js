"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const config_1 = require("../../../config");
class JsonFunc extends node_1.Node {
    constructor() {
        super();
        this.title = 'Json ForEach functions';
        this.description = 'Return json object values.';
        this.addInput('input', node_1.Type.STRING);
        this.addOutput('output', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
        this.settings['operation'] = {
            description: 'Output type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [{ value: 'forEach', text: 'forEach' }],
            },
            value: 'forEach',
        };
    }
    onInputUpdated() {
        const input = this.getInputData(0);
        if (input === null)
            return;
        try {
            const inputToObject = JSON.parse(input);
            function isObject(val) {
                return val instanceof Object;
            }
            let checkObject = isObject(inputToObject);
            if (checkObject) {
                const operation = this.settings['operation'].value;
                const keys = Object.values(inputToObject);
                if (operation === 'forEach') {
                    keys.forEach((item, index) => {
                        setTimeout(() => {
                            this.setOutputData(0, item);
                        }, index * (config_1.default.loopInterval + 100));
                    });
                }
                this.setOutputData(1, null);
            }
            else if (!checkObject) {
                this.setOutputData(0, null);
                this.setOutputData(1, 'Is not Object');
            }
        }
        catch (e) {
            this.setOutputData(0, null);
            this.setOutputData(1, e);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('json/json-func', JsonFunc);
//# sourceMappingURL=json-func.js.map