"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const ui_node_1 = require("./ui-node");
const node_1 = require("../../node");
class UiLogNode extends ui_node_1.UiNode {
    constructor(container, id, properties) {
        super('Log', 'UiLogNode', properties);
        this.messagesPerSec = 0;
        this.description =
            "Dashboard node which displays a log of the values wired into 'input', these log entries have timestamps attached.  There is an option in settings to save the log entries to the Wires Database (DB). ";
        this.title = 'Log';
        this.properties['log'] = [];
        this.settings['maxRecords'] = {
            description: 'Max Records',
            value: 10,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['maxRecordsPerSec'] = {
            description: 'Max records/sec limit',
            value: 11,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['saveToDb'] = {
            description: 'Save log to DB',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.addInput('input');
    }
    onAdded() {
        super.onAdded();
        if (this.side == container_1.Side.server)
            this.updateMessPerSec();
    }
    onAfterSettingsChange(oldSettings) {
        if (this.side == container_1.Side.server) {
            if (oldSettings.maxRecords != this.settings.maxRecords) {
                this.removeOldRecords();
                this.sendMessageToDashboardSide({
                    maxRecords: this.settings['maxRecords'].value,
                });
            }
        }
    }
    onDbReaded() {
        let log = [];
        this.properties['log'].forEach(rec => log.unshift(rec));
        this.properties['log'] = log;
    }
    removeOldRecords() {
        let records = this.properties['log'] || [];
        let max = this.settings['maxRecords'].value;
        let del = records.length - max;
        records.splice(records.length - del, del);
    }
    updateMessPerSec() {
        setInterval(() => {
            if (this.messagesPerSec > this.settings['maxRecordsPerSec'].value) {
                let dropped = this.messagesPerSec - this.settings['maxRecordsPerSec'].value;
                let record = { date: Date.now(), value: 'Dropped ' + dropped + ' records (rec/sec limit)' };
                this.properties['log'].unshift(record);
                this.sendMessageToDashboardSide({ record: record });
            }
            this.messagesPerSec = 0;
        }, 1000);
    }
    onInputUpdated() {
        if (!this.inputs[0].link)
            return;
        let val = this.getInputData(0);
        this.isRecentlyActive = true;
        this.messagesPerSec++;
        if (this.messagesPerSec <= this.settings['maxRecordsPerSec'].value) {
            let record = { date: Date.now(), value: val };
            if (this.properties['log'])
                this.properties['log'].unshift(record);
            this.removeOldRecords();
            this.sendMessageToDashboardSide({ record: record });
            let max = this.settings['maxRecords'].value;
            if (this.container.db && this.settings['saveToDb'].value) {
                this.container.db.updateNode(this.id, this.container.id, {
                    $push: { 'properties.log': { $each: [record], $slice: -max } },
                });
            }
        }
    }
    onGetMessageToServerSide(message) {
        if (message == 'getLog') {
            this.sendMessageToDashboardSide({
                log: this.properties['log'],
                maxRecords: this.settings['maxRecords'].value,
            });
        }
        else if (message == 'clearLog') {
            this.isRecentlyActive = true;
            this.properties['log'] = [];
            this.sendMessageToDashboardSide({ log: [] });
            if (this.container.db) {
                this.container.db.updateNode(this.id, this.container.id, {
                    $unset: { 'properties.log': true },
                });
            }
        }
    }
}
exports.UiLogNode = UiLogNode;
container_1.Container.registerNodeType('dashboard/log', UiLogNode);
//# sourceMappingURL=log.js.map