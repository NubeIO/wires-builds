"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const moment = require("moment");
const node_io_1 = require("../../node-io");
class TimestampGeneratorNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Timestamp Generator';
        this.description =
            `## Description\n ` +
                ` The is node is used to generate a timestamps\n ` +
                `## Inputs\n ` +
                ` The an active input a timestamp will be generated based of the device time \n ` +
                `## Outputs (return data type is ***JSON***)\n ` +
                ` ***date-string*** will return the timestamp: **"2019-08-31T11:54:27+10:00" ***\n ` +
                ` ***date-unix*** will return the timestamp: **1598838867***\n ` +
                ` ***date-format*** will return the time that is formatted as per moment js format options https://momentjs.com/docs/#/displaying/format/*\n ` +
                `### Formatting options examples\n ` +
                `-ENTER in settings	***LT*** with return 8:30 PM\n ` +
                `-ENTER in settings	***LTS*** with return 8:30:25 PM\n ` +
                `-ENTER in settings	***LLLL*** with return 	Thursday, September 4, 1986 8:30 PM\n `;
        this.addInput('input', node_io_1.Type.ANY);
        this.addOutput('date-string', node_io_1.Type.STRING);
        this.addOutput('date-unix', node_io_1.Type.STRING);
        this.addOutput('date-format', node_io_1.Type.STRING);
        this.settings['format'] = {
            description: 'Formatting options',
            value: "x",
            type: node_1.SettingType.STRING,
        };
    }
    onAfterSettingsChange() {
    }
    onInputUpdated() {
        const format = this.settings['format'].value;
        let date = moment();
        this.setOutputData(0, date.format());
        this.setOutputData(1, date.unix());
        this.setOutputData(2, date.format(format));
    }
}
exports.TimestampGeneratorNode = TimestampGeneratorNode;
container_1.Container.registerNodeType('time/timestamp-generator', TimestampGeneratorNode);
//# sourceMappingURL=timestamp-generator.js.map