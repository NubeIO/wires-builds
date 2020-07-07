"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const ui_node_1 = require("./ui-node");
class UiChartNode extends ui_node_1.UiNode {
    constructor(container, id, properties) {
        super('Chart', 'UiChartNode', properties);
        this.UPDATE_INPUTS_INTERVAL = 100;
        this.title = 'Button';
        this.description =
            "Dashboard node which displays a chart of the values wired into 'input'.  Chart properties and types can be modified in settings.  There is an option in settings to save the chart entries to the Wires Database (DB). ";
        this.properties['log'] = [];
        this.settings['maxRecords'] = {
            description: 'Max Records',
            value: 100,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['saveToDb'] = {
            description: 'Save data to DB',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['style'] = { description: 'Style', value: 'bars', type: node_1.SettingType.STRING };
        this.settings['autoscroll'] = {
            description: 'Auto scroll',
            value: 'continuous',
            type: node_1.SettingType.STRING,
        };
        this.addInput('input');
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        let records = this.properties['log'];
        let record = { x: Date.now(), y: val };
        records.push(record);
        let max = this.settings['maxRecords'].value;
        records.splice(0, records.length - max);
        this.sendMessageToDashboardSide({ record: record });
        if (this.container.db && this.settings['saveToDb'].value) {
            this.container.db.updateNode(this.id, this.container.id, {
                $push: { 'properties.log': { $each: [record], $slice: -max } },
            });
        }
    }
    onGetMessageToServerSide(data) {
        if (data == 'clear') {
            this.isRecentlyActive = true;
            this.properties['log'] = [];
            this.sendMessageToDashboardSide({ log: [] });
            if (this.container.db && this.settings['saveToDb'].value) {
                this.container.db.updateNode(this.id, this.container.id, {
                    $unset: { 'properties.log': true },
                });
            }
        }
        if (data.style) {
            this.settings['style'].value = data.style;
            this.sendMessageToDashboardSide({ style: data.style });
        }
        if (data == 'getLog') {
            this.sendMessageToDashboardSide({
                log: this.properties['log'],
                maxRecords: this.settings['maxRecords'].value,
            });
        }
    }
}
exports.UiChartNode = UiChartNode;
container_1.Container.registerNodeType('dashboard/chart', UiChartNode);
//# sourceMappingURL=chart.js.map