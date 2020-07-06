"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class TypeCheckNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Type Check (string)';
        this.description =
            "'output' is 'true' when 'input' type matches 'Type to check' setting.  'isType' outputs the type of the 'input' value.";
        this.addInput('input', node_1.Type.ANY);
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.addOutput('isType', node_1.Type.STRING);
        this.settings['type'] = {
            description: 'Type to check',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: node_1.Type.STRING, text: node_1.Type.STRING },
                    { value: node_1.Type.NUMBER, text: node_1.Type.NUMBER },
                    { value: node_1.Type.BOOLEAN, text: node_1.Type.BOOLEAN },
                    { value: node_1.Type.JSON, text: node_1.Type.JSON },
                ],
            },
            value: node_1.Type.STRING,
        };
    }
    onAdded() {
        this.updateTitle();
        this.onInputUpdated();
    }
    onInputUpdated() {
        let data = this.getInputData(0);
        if (data === undefined) {
            this.setOutputData(0, null, true);
            this.setOutputData(1, null, true);
        }
        const type = this.settings['type'].value;
        const dataType = typeof data;
        this.setOutputData(1, dataType);
        switch (type) {
            case node_1.Type.STRING:
                this.setOutputData(0, typeof data === node_1.Type.STRING, true);
                break;
            case node_1.Type.NUMBER:
                this.setOutputData(0, typeof data === node_1.Type.NUMBER, true);
                break;
            case node_1.Type.BOOLEAN:
                this.setOutputData(0, typeof data === node_1.Type.BOOLEAN, true);
                break;
            case node_1.Type.JSON:
                if (typeof data === 'string') {
                    try {
                        JSON.parse(data);
                        this.setOutputData(0, true);
                    }
                    catch (e) {
                        this.setOutputData(0, false);
                    }
                }
                else if (typeof data === 'object') {
                    try {
                        JSON.parse(JSON.stringify(data));
                        this.setOutputData(0, true);
                    }
                    catch (e) {
                        this.setOutputData(0, false);
                    }
                }
                this.setOutputData(0, data === null, true);
                break;
        }
    }
    onAfterSettingsChange() {
        this.updateTitle();
        this.onInputUpdated();
    }
    updateTitle() {
        const type = this.settings['type'].value;
        switch (type) {
            case node_1.Type.STRING:
                this.title = 'Type Check (string)';
                break;
            case node_1.Type.NUMBER:
                this.title = 'Type Check (number)';
                break;
            case node_1.Type.BOOLEAN:
                this.title = 'Type Check (boolean)';
                break;
            case node_1.Type.JSON:
                this.title = 'Type Check (json)';
                break;
        }
    }
}
container_1.Container.registerNodeType('compare/type-check', TypeCheckNode);
//# sourceMappingURL=type-check.js.map