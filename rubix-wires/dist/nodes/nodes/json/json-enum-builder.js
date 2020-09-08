"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const helper_1 = require("../../../utils/helper");
class JSONBuilderNode2 extends node_1.Node {
    constructor() {
        super();
        this.filterKeys = [];
        this.title = `JSON enum builder`;
        this.description = 'JSON ENUM builder';
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addInputWithSettings('definition', node_io_1.Type.JSON, '{"pointOne":22, "pointTwo":33}', 'JSON value');
        this.addOutput('output', node_io_1.Type.ANY);
        this.addOutput('valid-json', node_io_1.Type.BOOLEAN);
        this.settings['json'] = {
            description: 'Select output',
            type: node_1.SettingType.DROPDOWN,
            value: '',
        };
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        const trigger = this.getInputData(0);
        this.onAfterSettingsChange();
    }
    onAfterSettingsChange() {
        const input = this.getInputData(1);
        if (helper_1.isNull(input))
            return;
        if (helper_1.isJSON(input) && !helper_1.isEmpty(input)) {
            const definition = Object.entries(input).map(e => {
                return { value: e[1], text: e[0] };
            });
            if (definition) {
                this.settings['json'].config = {
                    items: definition,
                };
                const out = this.settings['json'].value;
                this.setOutputData(0, out);
                this.setOutputData(1, true);
                this.broadcastSettingsToClients();
            }
        }
        else
            this.setOutputData(1, false);
    }
}
exports.JSONBuilderNode2 = JSONBuilderNode2;
container_1.Container.registerNodeType('json/json-builder 2', JSONBuilderNode2);
//# sourceMappingURL=json-enum-builder.js.map