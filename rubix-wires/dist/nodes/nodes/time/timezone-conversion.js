"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const timezone_utils_1 = require("../../utils/timezone-utils");
const moment = require("moment-timezone");
class TimezoneConvertNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Timezone Conversion';
        this.description =
            `## Description\n ` +
                ` The is node is used to convert two timestamps\n `;
        this.addInput('input', node_1.Type.ANY);
        this.addOutput('out-time-converted', node_1.Type.ANY);
        this.addOutput('out-local-converted', node_1.Type.ANY);
        this.settings['region'] = {
            description: 'Select Region',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: timezone_utils_1.default.tsCategory,
            },
        };
        this.settings['timezone'] = {
            description: 'Select TimeZone (Hit save to refresh)',
            value: "Sydney/Australia",
            type: node_1.SettingType.DROPDOWN,
        };
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        const input = this.getInputData(0);
        try {
            const m = moment.tz(input, this.settings['timezone'].value);
            const local = moment(input);
            this.setOutputData(0, m.format());
            this.setOutputData(1, local.format());
        }
        catch (e) {
            this.debugWarn(`ERROR: trying to convert a timezone${e}`);
        }
    }
    onAfterSettingsChange() {
        const region = this.settings['region'].value;
        this.settings['timezone'].config = {
            items: timezone_utils_1.default.tsType(region),
        };
        this.broadcastSettingsToClients();
        this.onInputUpdated();
    }
}
exports.TimezoneConvertNode = TimezoneConvertNode;
container_1.Container.registerNodeType('time/timezone-conversion', TimezoneConvertNode);
//# sourceMappingURL=timezone-conversion.js.map