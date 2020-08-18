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
const moment = require("moment-timezone");
const node_1 = require("../../node");
const utils_1 = require("../../utils");
const time_utils_1 = require("../../utils/time-utils");
const setting_utils_1 = require("../../utils/setting-utils");
const crypto_utils_1 = require("../../utils/crypto-utils");
const axios_1 = require("axios");
const container_1 = require("../../container");
const system_utils_1 = require("../system/system-utils");
const config_1 = require("../../../config");
const Influx = require('influx');
var HistoryMode;
(function (HistoryMode) {
    HistoryMode[HistoryMode["COV"] = 0] = "COV";
    HistoryMode[HistoryMode["PERIODIC"] = 1] = "PERIODIC";
    HistoryMode[HistoryMode["TRIGGER_ONLY"] = 2] = "TRIGGER_ONLY";
})(HistoryMode || (HistoryMode = {}));
var DataBaseType;
(function (DataBaseType) {
    DataBaseType[DataBaseType["POSTGRES"] = 0] = "POSTGRES";
    DataBaseType[DataBaseType["InfluxDB"] = 1] = "InfluxDB";
})(DataBaseType || (DataBaseType = {}));
class HistoryBase extends node_1.Node {
    constructor() {
        super(...arguments);
        this.interval = -1;
        this.dynamicInputStartPosition = 2;
        this.alarmCount = 0;
        this.tagCount = 0;
    }
    addHistoryConfiguration() {
        this.addInput('histTrigger', node_1.Type.BOOLEAN);
        this.addInput('clearStoredHis', node_1.Type.BOOLEAN);
        this.addOutput('histError', node_1.Type.ANY);
        this.addOutput('storedHistCount', node_1.Type.NUMBER);
        this.addOutput('lastHistExport', node_1.Type.STRING);
        this.settings['history_group'] = {
            description: 'History Settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.settings['databaseType'] = {
            description: 'Database Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: DataBaseType.POSTGRES, text: 'Postgres' },
                    { value: DataBaseType.InfluxDB, text: 'InfluxDB' },
                ],
            },
            value: DataBaseType.POSTGRES,
        };
        this.settings['enable'] = {
            description: 'History Enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['host'] = { description: 'Host', value: '0.0.0.0', type: node_1.SettingType.STRING };
        this.settings['port'] = { description: 'Port', value: '8086', type: node_1.SettingType.STRING };
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
        this.addInputWithSettings('pointName', node_1.Type.STRING, '', 'Point Name');
        this.settings['historyMode'] = {
            description: 'History Logging Mode',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: HistoryMode.COV, text: 'Change Of Value (COV)' },
                    { value: HistoryMode.PERIODIC, text: 'Periodic' },
                    { value: HistoryMode.TRIGGER_ONLY, text: 'Trigger Only' },
                ],
            },
            value: HistoryMode.COV,
        };
        this.settings['dataType'] = {
            description: 'Data type for storing',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: node_1.Type.NUMBER, text: 'Number' },
                    { value: node_1.Type.BOOLEAN, text: 'Boolean' },
                    { value: node_1.Type.STRING, text: 'String' },
                ],
            },
            value: node_1.Type.NUMBER,
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
                    { value: time_utils_1.TIME_TYPE.MILLISECONDS, text: 'Milliseconds' },
                    { value: time_utils_1.TIME_TYPE.SECONDS, text: 'Seconds' },
                    { value: time_utils_1.TIME_TYPE.MINUTES, text: 'Minutes' },
                    { value: time_utils_1.TIME_TYPE.HOURS, text: 'Hours' },
                ],
            },
            value: time_utils_1.TIME_TYPE.MINUTES,
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
            description: 'Display Timestamp as',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: false, text: 'Numeric' },
                    { value: true, text: 'String' },
                ],
            },
            value: true,
        };
        this.settings['alarm_group'] = {
            description: 'Alarm Settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.settings['alarms_count'] = {
            description: 'Alarms Count (Max 10)',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['tags_group'] = {
            description: 'Tag Settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.settings['tags_count'] = {
            description: 'Tag Count (Max 10)',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.properties['obj'] = [];
    }
    setup() {
        this.addHistoryConfiguration();
    }
    init(properties) {
        this.historyFunctionsForAfterSettingsChange(properties['settings'], false);
    }
    changeInputDynamically(settings) {
        this.assignInputsOutputs();
        if (this.tableNameInput === -1 && settings['databaseType'].value === DataBaseType.InfluxDB) {
            if (this.pointNameInput)
                this.removeInput(this.pointNameInput);
            this.addInput('[tableName]', node_1.Type.STRING, { exist: true, nullable: false, hidden: false });
            this.addInput('[pointName]', node_1.Type.STRING, { exist: true, nullable: false, hidden: false });
        }
        else if (this.tableNameInput !== -1 && settings['databaseType'].value === DataBaseType.POSTGRES) {
            if (this.pointNameInput)
                this.removeInput(this.pointNameInput);
            this.removeInput(this.tableNameInput);
            this.addInput('[pointName]', node_1.Type.STRING, { exist: true, nullable: false, hidden: false });
        }
    }
    onAdded() {
        this.assignInputsOutputs();
        this.resetOutputs();
        this.doPeriodicHistoryFunctions();
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.getInputData(this.clearStoredHisInput)) {
                this.properties['obj'] = [];
                this.updateHistoryCountOutput();
            }
            yield this.doNonPeriodicHistoryFunctions();
        });
    }
    onAfterSettingsChange() {
        return __awaiter(this, void 0, void 0, function* () {
            this.historyFunctionsForAfterSettingsChange();
            yield this.doNonPeriodicHistoryFunctions();
            this.doPeriodicHistoryFunctions();
        });
    }
    onRemoved() {
        clearInterval(this.timeoutFunc);
    }
    assignInputsOutputs() {
        this.tableNameInput = -1;
        this.pointNameInput = -1;
        for (let input in this.inputs) {
            if (this.inputs.hasOwnProperty(input)) {
                if (this.inputs[input].name == 'histTrigger')
                    this.histTriggerInput = Number(input);
                if (this.inputs[input].name == 'clearStoredHis')
                    this.clearStoredHisInput = Number(input);
                if (this.inputs[input].name == '[tableName]')
                    this.tableNameInput = Number(input);
                if (this.inputs[input].name == '[pointName]')
                    this.pointNameInput = Number(input);
            }
        }
        for (let output in this.outputs) {
            if (this.outputs.hasOwnProperty(output)) {
                if (this.outputs[output].name == 'histError')
                    this.histErrorOutput = Number(output);
                else if (this.outputs[output].name == 'storedHistCount')
                    this.storedHistCountOutput = Number(output);
                else if (this.outputs[output].name == 'lastHistExport')
                    this.lastHistExportOutput = Number(output);
            }
        }
    }
    addHistorySettingsConfig(valueInput = 0, takeValueFromInput = true) {
        if (!this.settingConfigs.hasOwnProperty('groups') || !this.settingConfigs.hasOwnProperty('conditions')) {
            this.setSettingsConfig({
                groups: this.settingConfigs['groups'] || [],
                conditions: this.settingConfigs['conditions'] || {},
            });
        }
        this.settingConfigs.groups.push({ history_group: {} });
        this.settingConfigs.groups.push({ databaseType: {} });
        this.settingConfigs.groups.push({ host: { weight: 3 }, port: { weight: 1 } });
        this.settingConfigs.groups.push({ user: {}, password: {} });
        this.settingConfigs.groups.push({ period: { weight: 2 }, periodUnits: {} });
        this.settingConfigs.conditions['authentication'] = setting => {
            return setting['databaseType'].value == 1;
        };
        this.settingConfigs.conditions['host'] = setting => {
            return setting['databaseType'].value == 1;
        };
        this.settingConfigs.conditions['port'] = setting => {
            return setting['databaseType'].value == 1;
        };
        this.settingConfigs.conditions['databaseName'] = setting => {
            return setting['databaseType'].value == 1;
        };
        this.settingConfigs.conditions['tableName'] = setting => {
            return setting['databaseType'].value == 1;
        };
        this.settingConfigs.conditions['user'] = setting => {
            return !!setting['authentication'].value && setting['databaseType'].value == 1;
        };
        this.settingConfigs.conditions['password'] = setting => {
            return !!setting['authentication'].value && setting['databaseType'].value == 1;
        };
        this.settingConfigs.conditions['threshold'] = setting => {
            return setting['historyMode'].value === HistoryMode.COV;
        };
        this.settingConfigs.conditions['period'] = setting => {
            return setting['historyMode'].value === HistoryMode.PERIODIC;
        };
        this.settingConfigs.conditions['periodUnits'] = setting => {
            return setting['historyMode'].value === HistoryMode.PERIODIC;
        };
        this.settingConfigs.conditions['alarm_group'] = setting => {
            return setting['databaseType'].value == 1;
        };
        this.settingConfigs.conditions['alarms_count'] = setting => {
            return setting['databaseType'].value == 1;
        };
        this.settingConfigs.conditions['tags_group'] = setting => {
            return setting['databaseType'].value == 1;
        };
        this.settingConfigs.conditions['tags_count'] = setting => {
            return setting['databaseType'].value == 1;
        };
        if (this.settings['authentication']) {
            this.settingConfigs.groups.push({ host: { weight: 3 }, port: { weight: 1 } });
            this.settingConfigs.groups.push({ user: {}, password: {} });
            this.settingConfigs.conditions['user'] = setting => {
                return !!setting['authentication'].value;
            };
            this.settingConfigs.conditions['password'] = setting => {
                return !!setting['authentication'].value;
            };
        }
        this.valueInput = valueInput;
        this.takeValueFromInput = takeValueFromInput;
    }
    resetOutputs() {
        this.updateHistoryCountOutput();
    }
    doNonPeriodicHistoryFunctions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            if (!this.settings['enable'].value)
                return;
            let input = null;
            if (this.takeValueFromInput) {
                input = this.getInputData(this.valueInput);
            }
            else {
                input = this.outputs[this.valueInput].data;
            }
            if (this.checkTriggered()) {
                yield this.storeLogEntry(input);
            }
            else if (this.checkCOV(input)) {
                yield this.storeLogEntry(input);
            }
            if (this.properties['obj'].length > 0)
                yield this.trySendStoredData();
        });
    }
    trySendStoredData() {
        return __awaiter(this, void 0, void 0, function* () {
            let decimals = this.settings['decimals'].value;
            decimals = utils_1.default.clamp(decimals, 0, 5);
            const points = [];
            this.properties['obj'].forEach(log => {
                const dataType = this.settings['dataType'].value;
                log.payload = this.convertInput(log.payload, dataType, decimals);
                const tagList = {};
                tagList['point'] = this.getInputData(this.pointNameInput) || 'undefined';
                Object.keys(log).map(key => {
                    if (key !== 'payload' && key !== 'timestamp' && key !== 'tags') {
                        tagList[key] = log[key];
                    }
                });
                for (let i = 0; i < 10; i++) {
                    tagList['tag' + (i + 1)] = log['tags'][i] || null;
                }
                points.push({
                    measurement: this.getInputData(this.tableNameInput),
                    fields: { val: log.payload },
                    timestamp: moment(log.timestamp).valueOf() * 1000000,
                    tags: tagList,
                });
            });
            let errorFlag = false;
            if (this.settings['databaseType'].value === DataBaseType.POSTGRES) {
                let clientIdFromPlat;
                let deviceIdFromPlat;
                try {
                    clientIdFromPlat = yield system_utils_1.default.getClientID(this);
                }
                catch (e) {
                    clientIdFromPlat = 'unknownDeviceID';
                }
                try {
                    deviceIdFromPlat = yield system_utils_1.default.getDeviceID(this);
                }
                catch (e) {
                    deviceIdFromPlat = 'unknownClientID';
                }
                const multiPointPost = points.map(point => ({
                    deviceid: deviceIdFromPlat,
                    clientid: clientIdFromPlat,
                    val: point.fields.val,
                    point: point.tags.point,
                    ts: moment(Number(point.timestamp) / 1000000).toISOString(),
                }));
                const that = this;
                const pgUrl = config_1.default.pg.baseURL;
                try {
                    yield axios_1.default({
                        method: 'post',
                        url: pgUrl,
                        data: multiPointPost,
                    });
                }
                catch (error) {
                    this.setOutputData(that.histErrorOutput, String(error));
                    errorFlag = true;
                }
            }
            else if (DataBaseType.InfluxDB === DataBaseType.InfluxDB) {
                const writeOptions = {};
                const client = new Influx.InfluxDB({
                    host: this.settings['host'].value || 'localhost',
                    port: this.settings['port'].value || 8086,
                    protocol: 'http',
                    database: this.settings['databaseName'].value || 'undefined',
                    username: this.settings['authentication'].value ? this.settings['user'].value : '',
                    password: this.settings['authentication'].value ? crypto_utils_1.default.decrypt(this.settings['password'].value) : '',
                });
                try {
                    yield client.writePoints(points, writeOptions);
                }
                catch (err) {
                    this.setOutputData(this.histErrorOutput, String(err));
                    this.debugErr(err);
                    errorFlag = true;
                }
            }
            if (!errorFlag) {
                this.properties['obj'] = [];
                this.setOutputData(this.histErrorOutput, '');
                this.settings['timeAsString'].value
                    ? this.setOutputData(this.lastHistExportOutput, moment().format(), true)
                    : this.setOutputData(this.lastHistExportOutput, moment().valueOf(), true);
                this.updateHistoryCountOutput();
            }
        });
    }
    historyFunctionsForAfterSettingsChange(configSettings = null, save = true) {
        this.changeInputDynamically(configSettings || this.settings);
        this.assignInputsOutputs();
        if (this.settings['databaseType'].value === DataBaseType.POSTGRES) {
            this.settings['alarms_count'].value = 0;
            this.settings['tags_count'].value = 0;
        }
        this.dynamicInputStartPosition = this.pointNameInput + 1;
        this.changeAlarmsCount(this.settings['alarms_count'].value);
        this.renameAlarmInputs(configSettings);
        this.changeTagsCount(this.settings['tags_count'].value);
        if (save) {
            this.persistProperties(true, false, true, false);
        }
    }
    storeLogEntry(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (input == null)
                return;
            const storageLimit = utils_1.default.clamp(this.settings['storage-limit'].value, 0, 50);
            const minuteRound = utils_1.default.clamp(this.settings['minuteRoundValue'].value, 0, 60);
            const now = minuteRound ? time_utils_1.default.nearestFutureMinutes(minuteRound, moment()) : moment();
            const msg = {
                payload: input,
                timestamp: now.toISOString(),
            };
            for (let i = this.dynamicInputStartPosition; i < this.dynamicInputStartPosition + this.alarmCount; i++) {
                let alarmNum = i - this.dynamicInputStartPosition + 1;
                let alarmName = this.settings['alarm' + alarmNum].value || 'alarm' + alarmNum;
                msg[alarmName] = this.getInputData(i) || 'null';
            }
            const tags = [];
            let j = 1;
            while (j <= this.tagCount) {
                if (this.settings['tag' + j].value)
                    tags.push(this.settings['tag' + j].value);
                j++;
            }
            msg['tags'] = tags;
            this.properties['obj'].push(msg);
            while (this.properties['obj'].length > storageLimit) {
                this.properties['obj'].shift();
            }
            this.properties['lastHistoryValue'] = input;
            this.persistProperties(false, true, false, false);
            this.updateHistoryCountOutput();
        });
    }
    checkTriggered() {
        return (this.settings['historyMode'].value === HistoryMode.TRIGGER_ONLY &&
            this.getInputData(this.histTriggerInput) &&
            this.inputs[this.histTriggerInput].updated);
    }
    checkCOV(input) {
        if (this.settings['historyMode'].value === HistoryMode.COV) {
            const threshold = this.settings['threshold'].value;
            if (!isNaN(input) && !isNaN(this.properties['lastHistoryValue'])) {
                return Math.abs(Number(input) - Number(this.properties['lastHistoryValue'])) >= threshold;
            }
            else {
                return input !== this.properties['lastHistoryValue'];
            }
        }
        return false;
    }
    doPeriodicHistoryFunctions() {
        if (this.side !== container_1.Side.server)
            return;
        const enable = this.settings['enable'].value;
        const isPeriodic = this.settings['historyMode'].value === HistoryMode.PERIODIC;
        if (!enable || !isPeriodic) {
            if (this.timeoutFunc) {
                this.interval = -1;
                clearInterval(this.timeoutFunc);
                this.debugInfo('Clearing Periodic interval data insertion...');
            }
        }
        if (enable && isPeriodic) {
            const interval = time_utils_1.default.timeConvert(this.settings['period'].value, this.settings['periodUnits'].value);
            if (this.interval !== interval) {
                clearInterval(this.timeoutFunc);
                this.timeoutFunc = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    let input = null;
                    if (this.takeValueFromInput)
                        input = this.getInputData(this.valueInput);
                    else
                        input = this.outputs[this.valueInput].data;
                    yield this.storeLogEntry(input);
                    if (this.properties['obj'].length > 0)
                        yield this.trySendStoredData();
                }), interval);
                this.interval = interval;
                this.debugInfo(`Setting Periodic Period of: ${interval} ms`);
            }
        }
    }
    changeAlarmsCount(targetCount) {
        targetCount = utils_1.default.clamp(targetCount, 0, 10);
        this.settings['alarms_count'].value = targetCount;
        let diff = targetCount - this.alarmCount;
        if (diff == 0)
            return;
        this.changeInputsCount(targetCount + this.dynamicInputStartPosition, node_1.Type.STRING);
        const alarmsToAdd = {};
        if (diff > 0) {
            for (let i = this.alarmCount + 1; i <= targetCount; i++) {
                alarmsToAdd['alarm' + i] = {
                    description: 'Alarm ' + i,
                    value: '',
                    type: node_1.SettingType.STRING,
                };
            }
            this.settings = setting_utils_1.default.insertIntoObjectAtPosition(this.settings, alarmsToAdd, this.alarmCount == 0 ? 'alarms_count' : 'alarm' + this.alarmCount);
        }
        else if (diff < 0) {
            for (let i = this.alarmCount; i > targetCount; i--) {
                delete this.settings['alarm' + i];
            }
        }
        this.alarmCount = targetCount;
    }
    renameAlarmInputs(configSettings) {
        for (let i = 1; i <= this.alarmCount; i++) {
            let alarm = this.settings['alarm' + i].value;
            if (!alarm && configSettings) {
                alarm = (configSettings['alarm' + i] && configSettings['alarm' + i].value) || '';
            }
            if (alarm.length > 20)
                alarm = '...' + alarm.substr(alarm.length - 20, 20);
            this.inputs[this.dynamicInputStartPosition + i - 1].name = 'alarm' + i + ' | ' + alarm;
        }
    }
    changeTagsCount(targetCount) {
        targetCount = utils_1.default.clamp(targetCount, 0, 10);
        this.settings['tags_count'].value = targetCount;
        let diff = targetCount - this.tagCount;
        if (diff == 0)
            return;
        const tagsToAdd = {};
        if (diff > 0) {
            for (let i = this.tagCount + 1; i <= targetCount; i++) {
                tagsToAdd['tag' + i] = {
                    description: 'Tag ' + i,
                    value: '',
                    type: node_1.SettingType.STRING,
                };
            }
            this.settings = setting_utils_1.default.insertIntoObjectAtPosition(this.settings, tagsToAdd, this.tagCount === 0 ? 'tags_count' : 'tag' + this.tagCount);
        }
        else if (diff < 0) {
            for (let i = this.tagCount; i > targetCount; i--) {
                delete this.settings['tag' + i];
            }
        }
        this.tagCount = targetCount;
    }
    updateHistoryCountOutput() {
        this.setOutputData(this.storedHistCountOutput, (this.properties['obj'] && this.properties['obj'].length) || 0);
    }
}
exports.default = HistoryBase;
//# sourceMappingURL=HistoryBase.js.map