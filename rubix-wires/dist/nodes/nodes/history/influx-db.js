"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const time_utils_1 = require("../../utils/time-utils");
let moment = require('moment-timezone');
var Influx = require('influx');
class InfluxDBNode extends node_1.Node {
    constructor() {
        super();
        this.obj = [];
        this.title = 'Influx-DB';
        this.description = 'A node for sending data to influxDB';
        this.addInput('input', node_1.Type.ANY);
        this.addInput('trigger', node_1.Type.BOOLEAN);
        this.addOutput('error', node_1.Type.ANY);
        this.addOutput('storedCount', node_1.Type.NUMBER);
        this.addOutput('lastExport', node_1.Type.STRING);
        this.settings['enable'] = { description: 'Enable', value: false, type: node_1.SettingType.BOOLEAN };
        this.settings['host'] = { description: 'Host', value: '', type: node_1.SettingType.STRING };
        this.settings['port'] = { description: 'Port', value: '', type: node_1.SettingType.STRING };
        this.settings['authentication'] = {
            description: 'Use Authentication',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['user'] = { description: 'Username', value: '', type: node_1.SettingType.STRING };
        this.settings['password'] = { description: 'Password', value: '', type: node_1.SettingType.STRING };
        this.settings['databaseName'] = {
            description: 'Database Name',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['tableName'] = {
            description: 'Measurement Name',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['pointName'] = {
            description: 'Point Name',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['historyMode'] = {
            description: 'History Logging Mode',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'Change Of Value (COV)' },
                    { value: 1, text: 'Periodic' },
                    { value: 2, text: 'Trigger Only' },
                ],
            },
            value: 0,
        };
        this.settings['threshold'] = {
            description: 'COV Threshold',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['period'] = {
            description: 'Logging Interval',
            value: 15,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['periodUnits'] = {
            description: 'Units',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'milliseconds', text: 'Milliseconds' },
                    { value: 'seconds', text: 'Seconds' },
                    { value: 'minutes', text: 'Minutes' },
                    { value: 'hours', text: 'Hours' },
                ],
            },
            value: 'minutes',
        };
        this.settings['storage-limit'] = {
            description: 'Local Storage Limit (Max 50)',
            value: 25,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['minuteRoundValue'] = {
            description: 'Round minutes up in increments of',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['decimals'] = {
            description: 'Decimal Places (Limit 5)',
            value: 3,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['timeAsString'] = {
            description: 'Display Timestamp as:',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: false, text: 'Numeric' },
                    { value: true, text: 'String' },
                ],
            },
            value: true,
        };
        this.setSettingsConfig({
            groups: [
                { host: { weight: 3 }, port: { weight: 1 } },
                { user: {}, password: {} },
                { period: { weight: 2 }, periodUnits: {} },
            ],
            conditions: {
                user: setting => {
                    return !!setting['authentication'].value;
                },
                password: setting => {
                    return !!setting['authentication'].value;
                },
                threshold: setting => {
                    return !setting['historyMode'].value;
                },
                period: setting => {
                    return setting['historyMode'].value == 1;
                },
                periodUnits: setting => {
                    return setting['historyMode'].value == 1;
                },
            },
        });
        this.useInterval = false;
        this.properties['lastHistoryValue'] = null;
    }
    onAdded() { }
    nearestFutureMinutes(interval, someMoment) {
        const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval;
        return someMoment
            .clone()
            .minute(roundedMinutes)
            .second(0);
    }
    trySendStoredData() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = this.settings['host'].value;
            const port = this.settings['port'].value;
            var client = new Influx.InfluxDB({
                host: this.settings['host'].value || 'localhost',
                port: this.settings['port'].value || 8086,
                protocol: 'http',
                database: this.settings['databaseName'].value || 'undefined',
                username: this.settings['authentication'].value ? this.settings['user'].value : '',
                password: this.settings['authentication'].value ? this.settings['password'].value : '',
            });
            var writeOptions = {};
            let decimals = this.settings['decimals'].value;
            if (decimals > 5)
                decimals = 5;
            var points = [];
            this.obj.forEach(log => {
                if (typeof log.payload == 'number')
                    log.payload = log.payload.toFixed(decimals);
                points.push({
                    measurement: this.settings['tableName'].value,
                    fields: {
                        val: log.payload,
                    },
                    tags: {
                        point: this.settings['pointName'].value || 'undefined',
                    },
                    time: log.timestamp.valueOf(),
                });
            });
            var errorFlag = false;
            yield client.writePoints(points, writeOptions).catch(err => {
                this.setOutputData(0, String(err.code));
                errorFlag = true;
            });
            if (!errorFlag) {
                this.obj = [];
                this.setOutputData(0, '');
                this.settings['timeAsString'].value
                    ? this.setOutputData(2, moment().format(), true)
                    : this.setOutputData(2, moment().valueOf(), true);
            }
        });
    }
    storeLogEntry(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (input == null)
                return -1;
            const storageLimit = utils_1.default.clamp(this.settings['storage-limit'].value, 0, 50);
            const minuteRound = utils_1.default.clamp(this.settings['minuteRoundValue'].value, 0, 60);
            const now = minuteRound ? yield this.nearestFutureMinutes(minuteRound, moment()) : moment();
            let msg = {
                payload: input,
                timestamp: now._d,
            };
            this.obj.push(msg);
            while (this.obj.length > storageLimit) {
                this.obj.shift();
            }
            this.properties['lastHistoryValue'] = input;
            this.persistProperties(false, true);
            return this.obj.length;
        });
    }
    checkCOV(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.settings['historyMode'].value) {
                const threshold = this.settings['threshold'].value;
                if (threshold === 0 && input !== this.properties['lastHistoryValue'])
                    return true;
                const isNumber = typeof input === 'number';
                if (this.inputs[0].updated && input !== this.properties['lastHistoryValue']) {
                    if (typeof this.properties['lastHistoryValue'] !== 'number' ||
                        !isNumber ||
                        (isNumber && Math.abs(input - this.properties['lastHistoryValue']) >= this.settings['threshold'].value))
                        return true;
                }
            }
            return false;
        });
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            const input = this.getInputData(0);
            if (this.getInputData(1) && this.inputs[1].updated)
                yield this.storeLogEntry(input);
            else if (this.getInputData(0) != null && this.inputs[0].updated && (yield this.checkCOV(input))) {
                yield this.storeLogEntry(input);
            }
            if (this.obj.length > 0)
                yield this.trySendStoredData();
            this.setOutputData(1, this.obj.length);
        });
    }
    setPeriodicLogging() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.settings['historyMode'].value == 1 && !this.useInterval) {
                this.useInterval = true;
                let interval = this.settings['period'].value;
                interval = time_utils_1.default.timeConvert(interval, this.settings['periodUnits'].value);
                this.timeoutFunc = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    const input = this.getInputData(0);
                    yield this.storeLogEntry(input);
                    if (this.obj.length > 0)
                        yield this.trySendStoredData();
                    this.setOutputData(1, this.obj.length);
                }), interval);
            }
            else if (this.settings['historyMode'].value != 1 && this.useInterval) {
                this.useInterval = false;
                clearInterval(this.timeoutFunc);
            }
        });
    }
    onAfterSettingsChange() {
        if (this.side !== container_1.Side.server)
            return;
        this.setPeriodicLogging();
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('history/influx-db', InfluxDBNode);
//# sourceMappingURL=influx-db.js.map