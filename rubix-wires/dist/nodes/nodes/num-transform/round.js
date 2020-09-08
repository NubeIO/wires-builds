"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class MathDecimalPlaceNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Round (Decimal Place)';
        this.description =
            "'output' is the 'input' value rounded to the configured number of decimal places.  The number of decimal places can be configured from settings (limited to 5 decimal places).";
        this.addInput('input', node_io_1.Type.NUMBER);
        this.addOutput('output', node_io_1.Type.NUMBER);
        this.settings['decimals'] = {
            description: 'Decimal Places (Limit 5)',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
    }
    onInputUpdated() {
        let decimals = this.settings['decimals'].value;
        if (decimals > 5)
            decimals = 5;
        this.emitTransformedInput(x => x.toFixed(decimals));
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('num-transform/round', MathDecimalPlaceNode);
//# sourceMappingURL=round.js.map