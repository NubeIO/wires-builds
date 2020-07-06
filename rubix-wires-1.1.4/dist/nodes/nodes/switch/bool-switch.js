"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
class BoolSwitchNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Boolean Switch';
        this.description =
            "Boolean 'switch' passes corresponding Boolean input to 'output'.  If 'switch' is 'true', Boolean 'inTrue' value will be passed to 'output'  'inTrue' and 'inFalse' values can be set in settings.";
        this.addInput('switch', node_1.Type.BOOLEAN);
        this.addInput('[inTrue]', node_1.Type.BOOLEAN);
        this.addInput('[inFalse]', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.settings['inTrue'] = {
            description: 'True Value',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: false, text: 'false' },
                    { value: true, text: 'true' },
                    { value: null, text: 'null' },
                ],
            },
            value: null,
        };
        this.settings['inFalse'] = {
            description: 'False Value',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: false, text: 'false' },
                    { value: true, text: 'true' },
                    { value: null, text: 'null' },
                ],
            },
            value: null,
        };
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        let select = this.getInputData(0);
        if (!utils_1.default.hasInput(select)) {
            this.setOutputData(0, null);
            return;
        }
        let inA = this.getInputData(1);
        if (!utils_1.default.hasInput(inA))
            inA = this.settings['inTrue'].value;
        let inB = this.getInputData(2);
        if (!utils_1.default.hasInput(inB))
            inB = this.settings['inFalse'].value;
        if (select)
            this.setOutputData(0, inA);
        else
            this.setOutputData(0, inB);
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('switch/bool-switch', BoolSwitchNode);
//# sourceMappingURL=bool-switch.js.map