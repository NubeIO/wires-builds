"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
const time_utils_1 = require("../../utils/time-utils");
const moment = require('moment-timezone');
class AnyDataStoreNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Data Store';
        this.description =
            'The data-store node is used to store history log data locally.  The data-store node has limited memory so the capacity is limited to 50 log entries; beware of using too many data-store nodes as it could affect the operation of Wires.  The history logs can be configured to log in UTC or local timezone, and the output format can be set to ‘Array’, ‘CSV’, or ‘JSON’.  If ‘Round up in increments of’ setting is used (not zero), then the timestamp will be rounded up to the nearest increment value step.';
        this.addInput('input', node_io_1.Type.ANY);
        this.addInput('clear', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.ANY);
        this.addOutput('storedCount', node_io_1.Type.NUMBER);
        this.settings['time-conversation-enable'] = {
            description: 'Timestamp in system timezone?',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['storage-limit'] = {
            description: 'Storage Limit (Max 50)',
            value: 25,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['date-iso'] = {
            description: 'Typestamp Format',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'YYYY-MM-DD HH:mm:ss TZ (ISO8601)' },
                    { value: 1, text: 'YYYY-MM-DD HH:mm:ss' },
                    { value: 2, text: 'MM-DD-YYYY HH:mm:ss' },
                    { value: 3, text: 'DD-MM-YYYY HH:mm:ss' },
                    { value: 4, text: 'DAY, Month DD, YYYY HH:MM AM/PM' },
                    { value: 5, text: 'Month DD, YYYY HH:MM AM/PM' },
                    { value: 6, text: 'Unix timestamp in Milliseconds' },
                ],
            },
            value: 0,
        };
        this.settings['outputFormat'] = {
            description: 'Output Format',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'Array', text: 'Array' },
                    { value: 'CSV', text: 'CSV' },
                    { value: 'JSON', text: 'JSON' },
                ],
            },
            value: 'Array',
        };
        this.settings['pointName'] = {
            description: 'Point Name',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['minuteRoundValue'] = {
            description: 'Round minutes up in increments of',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.setSettingsConfig({
            conditions: {
                pointName: setting => {
                    return setting['outputFormat'].value != 'Array';
                },
            },
        });
    }
    onCreated() {
        this.properties['historyLog'] = [];
    }
    onAdded() {
        this.setOutputData(0, this.properties['historyLog']);
        this.setOutputData(1, this.properties['historyLog'] ? this.properties['historyLog'].length : 0);
    }
    nearestFutureMinutes(interval, someMoment) {
        const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval;
        return someMoment
            .clone()
            .minute(roundedMinutes)
            .second(0);
    }
    formatOutputs() {
        const timezone = this.settings['time-conversation-enable'].value
            ? Intl.DateTimeFormat().resolvedOptions().timeZone
            : 'Etc/UTC';
        let dateTz = null;
        const pointName = this.settings['pointName'].value;
        let timeFormatedArray = this.properties['historyLog'].map(entry => {
            return entry;
        });
        timeFormatedArray = timeFormatedArray.reverse().map(entry => {
            switch (this.settings['date-iso'].value) {
                case 0:
                    dateTz = moment(entry.timestamp)
                        .tz(timezone)
                        .format();
                    break;
                case 1:
                    dateTz = moment(entry.timestamp)
                        .tz(timezone)
                        .format('YYYY-MM-DD HH:mm:ss');
                    break;
                case 2:
                    dateTz = moment(entry.timestamp)
                        .tz(timezone)
                        .format('MM-DD-YYYY HH:mm:ss');
                    break;
                case 3:
                    dateTz = moment(entry.timestamp)
                        .tz(timezone)
                        .format('DD-MM-YYYY HH:mm:ss');
                    break;
                case 4:
                    dateTz = moment(entry.timestamp)
                        .tz(timezone)
                        .format('LLLL');
                    break;
                case 5:
                    dateTz = moment(entry.timestamp)
                        .tz(timezone)
                        .format('LLL');
                    break;
                case 6:
                    dateTz = moment(entry.timestamp)
                        .tz(timezone)
                        .valueOf();
                    break;
                default:
                    dateTz = moment(entry.timestamp)
                        .tz(timezone)
                        .format();
            }
            return {
                payload: entry.payload,
                timestamp: dateTz,
            };
        });
        switch (this.settings['outputFormat'].value) {
            case 'Array':
                return timeFormatedArray;
            case 'CSV':
                let csvString = `name, timestamp, payload\n`;
                timeFormatedArray.forEach(log => {
                    csvString += `${pointName}, ${log.timestamp}, ${log.payload} \n`;
                });
                return csvString;
            case 'JSON':
                return JSON.stringify({ [pointName]: timeFormatedArray });
        }
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        if (this.getInputData(1) && this.inputs[1].updated) {
            this.properties['historyLog'] = [];
            this.setOutputData(0, this.properties['historyLog'].reverse());
            this.setOutputData(1, this.properties['historyLog'].length);
        }
        if (this.getInputData(0) == null || !this.inputs[0].updated)
            return;
        const storageLimit = utils_1.default.clamp(this.settings['storage-limit'].value, 0, 50);
        const minuteRound = utils_1.default.clamp(this.settings['minuteRoundValue'].value, 0, 60);
        const now = minuteRound ? time_utils_1.default.nearestFutureMinutes(minuteRound, moment()) : moment();
        let msg = {
            payload: this.getInputData(0),
            timestamp: now._d,
        };
        this.properties['historyLog'].push(msg);
        while (this.properties['historyLog'].length > storageLimit) {
            this.properties['historyLog'].shift();
        }
        this.persistProperties(true, true);
        const newObj = this.formatOutputs() || [];
        this.setOutputData(0, newObj);
        this.setOutputData(1, this.properties['historyLog'].length);
    }
    onAfterSettingsChange() {
        this.outputs[0].name = `output (${this.settings['outputFormat'].value})`;
        this.broadcastOutputsToClients();
        const newObj = this.formatOutputs() || [];
        this.setOutputData(0, newObj);
        this.setOutputData(1, this.properties['historyLog'].length);
    }
}
container_1.Container.registerNodeType('history/data-store', AnyDataStoreNode);
//# sourceMappingURL=data-store.js.map