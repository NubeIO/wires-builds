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
const time_utils_1 = require("../time-utils");
const setting_utils_1 = require("../setting-utils");
const crypto_utils_1 = require("../crypto-utils");
const node_utils_1 = require("../../utils/node-utils");
const axios_1 = require("axios");
const config_1 = require("../../../config");
const Influx = require('influx');
const moment = require('moment-timezone');
class HistoryConfig {
    static addHistorySettings(self) {
        self.addInput('histTrigger', node_1.Type.BOOLEAN);
        self.addOutput('histError', node_1.Type.ANY);
        self.addOutput('storedHistCount', node_1.Type.NUMBER);
        self.addOutput('lastHistExport', node_1.Type.STRING);
        for (let input in self.inputs) {
            if (self.inputs.hasOwnProperty(input)) {
                if (self.inputs[input].name == 'histTrigger')
                    self.histTriggerInput = input;
            }
        }
        for (let output in self.outputs) {
            if (self.outputs.hasOwnProperty(output)) {
                if (self.outputs[output].name == 'histError')
                    self.histErrorOutput = output;
                else if (self.outputs[output].name == 'storedHistCount')
                    self.storedHistCountOutput = output;
                else if (self.outputs[output].name == 'lastHistExport')
                    self.lastHistExportOutput = output;
            }
        }
        self.settings['history_group'] = {
            description: 'History Settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        self.settings['databaseType'] = {
            description: 'Database Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'Nube DB (Postgres)' },
                    { value: 1, text: 'InfluxDB' },
                ],
            },
            value: 0,
        };
        self.settings['enable'] = {
            description: 'History Enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['host'] = { description: 'Host', value: '', type: node_1.SettingType.STRING };
        self.settings['port'] = { description: 'Port', value: '', type: node_1.SettingType.STRING };
        self.settings['authentication'] = {
            description: 'Use Authentication',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        self.settings['user'] = { description: 'Username', value: '', type: node_1.SettingType.STRING };
        self.settings['password'] = { description: 'Password', value: '', type: node_1.SettingType.STRING };
        self.settings['databaseName'] = {
            description: 'Database Name',
            value: '',
            type: node_1.SettingType.STRING,
        };
        self.settings['tableName'] = {
            description: 'Measurement Name',
            value: '',
            type: node_1.SettingType.STRING,
        };
        self.settings['pointName'] = {
            description: 'Point Name',
            value: '',
            type: node_1.SettingType.STRING,
        };
        self.settings['historyMode'] = {
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
        self.settings['threshold'] = {
            description: 'COV Threshold',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        self.settings['period'] = {
            description: 'Logging Interval',
            value: 15,
            type: node_1.SettingType.NUMBER,
        };
        self.settings['periodUnits'] = {
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
        self.settings['storage-limit'] = {
            description: 'Local Storage Limit (Max 50)',
            value: 25,
            type: node_1.SettingType.NUMBER,
        };
        self.settings['minuteRoundValue'] = {
            description: 'Round minutes up in increments of',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        self.settings['decimals'] = {
            description: 'Decimal Places (Limit 5)',
            value: 3,
            type: node_1.SettingType.NUMBER,
        };
        self.settings['timeAsString'] = {
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
        self.settings['alarm_group'] = {
            description: 'Alarm Settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        self.settings['alarms_count'] = {
            description: 'Alarms Count (Max 10)',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        self.settings['tags_group'] = {
            description: 'Tag Settings',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        self.settings['tags_count'] = {
            description: 'Tag Count (Max 10)',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
    }
    static addHistorySettingsConfig(self, valueInput = 0, isOutput = true) {
        if (!self.settingConfigs.hasOwnProperty('groups') && !self.settingConfigs.hasOwnProperty('conditions'))
            self.setSettingsConfig({ groups: [], conditions: {} });
        self.settingConfigs.groups.push({ history_group: {} });
        self.settingConfigs.groups.push({ databaseType: {} });
        self.settingConfigs.groups.push({ host: { weight: 3 }, port: { weight: 1 } });
        self.settingConfigs.groups.push({ user: {}, password: {} });
        self.settingConfigs.groups.push({ period: { weight: 2 }, periodUnits: {} });
        self.settingConfigs.conditions['authentication'] = setting => {
            return setting['databaseType'].value == 1;
        };
        self.settingConfigs.conditions['host'] = setting => {
            return setting['databaseType'].value == 1;
        };
        self.settingConfigs.conditions['port'] = setting => {
            return setting['databaseType'].value == 1;
        };
        self.settingConfigs.conditions['databaseName'] = setting => {
            return setting['databaseType'].value == 1;
        };
        self.settingConfigs.conditions['tableName'] = setting => {
            return setting['databaseType'].value == 1;
        };
        self.settingConfigs.conditions['user'] = setting => {
            return !!setting['authentication'].value && setting['databaseType'].value == 1;
        };
        self.settingConfigs.conditions['password'] = setting => {
            return !!setting['authentication'].value && setting['databaseType'].value == 1;
        };
        self.settingConfigs.conditions['threshold'] = setting => {
            return !setting['historyMode'].value;
        };
        self.settingConfigs.conditions['period'] = setting => {
            return setting['historyMode'].value == 1;
        };
        self.settingConfigs.conditions['periodUnits'] = setting => {
            return setting['historyMode'].value == 1;
        };
        self.settingConfigs.conditions['alarm_group'] = setting => {
            return setting['databaseType'].value == 1;
        };
        self.settingConfigs.conditions['alarms_count'] = setting => {
            return setting['databaseType'].value == 1;
        };
        self.settingConfigs.conditions['tags_group'] = setting => {
            return setting['databaseType'].value == 1;
        };
        self.settingConfigs.conditions['tags_count'] = setting => {
            return setting['databaseType'].value == 1;
        };
        if (self.settings['authentication']) {
            self.settingConfigs.groups.push({ host: { weight: 3 }, port: { weight: 1 } });
            self.settingConfigs.groups.push({ user: {}, password: {} });
            self.settingConfigs.conditions['user'] = setting => {
                return !!setting['authentication'].value;
            };
            self.settingConfigs.conditions['password'] = setting => {
                return !!setting['authentication'].value;
            };
        }
        self.properties['alarmsCount'] = self.settings['alarms_count'].value;
        self.properties['tagsCount'] = self.settings['tags_count'].value;
        self.properties['valueInput'] = valueInput || 0;
        self.properties['isOutput'] = isOutput;
    }
    static historyOnCreated(self) {
        self.useInterval = false;
        self.properties['alarmsCount'] = 0;
        self.properties['tagsCount'] = 0;
        self.properties['valueInput'] = 0;
        self.properties['isOutput'] = true;
        self.properties['pointName'] = 'undefined';
        self.properties['obj'] = [];
        self.properties['lastHistoryValue'] = null;
        self.properties['dynamicInputStartPosition'] = 2;
    }
    static doHistoryFunctions(self) {
        return __awaiter(this, void 0, void 0, function* () {
            let input = null;
            if (self.properties['isOutput'])
                input = self.getInputData(self.properties['valueInput']);
            else
                input = self.outputs[self.properties['valueInput']].data;
            if (self.getInputData(self.histTriggerInput) && self.inputs[self.histTriggerInput].updated)
                yield HistoryConfig.storeLogEntry(self, input);
            else if (input != null && (yield HistoryConfig.checkCOV(self, input))) {
                yield HistoryConfig.storeLogEntry(self, input);
            }
            if (self.properties['obj'].length > 0)
                yield HistoryConfig.trySendStoredData(self);
            self.setOutputData(self.storedHistCountOutput, self.properties['obj'].length);
        });
    }
    static trySendStoredData(self) {
        return __awaiter(this, void 0, void 0, function* () {
            let decimals = self.settings['decimals'].value;
            if (decimals > 5)
                decimals = 5;
            var points = [];
            self.properties['obj'].forEach(log => {
                if (typeof log.payload == 'number')
                    log.payload = log.payload.toFixed(decimals);
                var tagList = {};
                tagList['point'] = self.properties['pointName'] || 'undefined';
                for (var j = 2; j < Object.keys(log).length - 1; j++) {
                    var key = Object.keys(log)[j];
                    tagList[key] = log[key];
                }
                for (var i = 0; i < 10; i++) {
                    tagList['tag' + (i + 1)] = log['tags'][i] || null;
                }
                points.push({
                    measurement: self.getInputData(2),
                    fields: {
                        val: log.payload,
                    },
                    tags: tagList,
                    time: log.timestamp,
                });
            });
            var errorFlag = false;
            if (self.settings['databaseType'].value == 0) {
                var multiPointPost = [];
                const clientIDfromPlat = yield HistoryConfig.getClientID(self);
                const deviceIDfromPlat = yield HistoryConfig.getDeviceID(self);
                let foundDeviceID = false;
                let foundClientID = false;
                typeof deviceIDfromPlat == 'string' ? (foundDeviceID = true) : null;
                typeof deviceIDfromPlat == 'string' ? (foundClientID = true) : null;
                var inputVal;
                var typeOfVal;
                var valAsNum;
                const pgUrl = config_1.default.pg.baseURL;
                points.forEach(point => {
                    inputVal = point['fields']['val'];
                    typeOfVal = typeof inputVal;
                    if (typeOfVal === 'string' || typeOfVal === 'boolean')
                        valAsNum = Number(point['fields']['val']);
                    else
                        valAsNum = inputVal;
                    multiPointPost.push({
                        deviceid: foundDeviceID ? deviceIDfromPlat : 'unknownDeviceID',
                        clientid: foundClientID ? clientIDfromPlat : 'unknownClientID',
                        val: valAsNum,
                        point: point['tags']['point'],
                        ts: moment(point['time'])._d,
                    });
                });
                axios_1.default({
                    method: 'post',
                    url: pgUrl,
                    data: multiPointPost,
                })
                    .then(function () { })
                    .catch(function (error) {
                    self.setOutputData(self.histErrorOutput, String(error));
                    errorFlag = true;
                });
            }
            if (self.settings['databaseType'].value == 1) {
                const host = self.settings['host'].value || 'localhost';
                const port = self.settings['port'].value || 8086;
                var writeOptions = {};
                var client = new Influx.InfluxDB({
                    host: self.settings['host'].value || 'localhost',
                    port: self.settings['port'].value || 8086,
                    protocol: 'http',
                    database: self.settings['databaseName'].value || 'undefined',
                    username: self.settings['authentication'].value ? self.settings['user'].value : '',
                    password: self.settings['authentication'].value ? crypto_utils_1.default.decrypt(self.settings['password'].value) : '',
                });
                yield client.writePoints(points, writeOptions).catch(err => {
                    self.setOutputData(self.histErrorOutput, String(err.code));
                    errorFlag = true;
                });
            }
            if (!errorFlag) {
                self.properties['obj'] = [];
                self.setOutputData(self.histErrorOutput, '');
                self.settings['timeAsString'].value
                    ? self.setOutputData(self.lastHistExportOutput, moment().format(), true)
                    : self.setOutputData(self.lastHistExportOutput, moment().valueOf(), true);
            }
        });
    }
    static historyFunctionsForAfterSettingsChange(self, pointName, save = true) {
        self.properties['pointName'] = pointName;
        if (self.settings['databaseType'].value == 0) {
            self.settings['alarms_count'].value = 0;
            self.settings['tags_count'].value = 0;
        }
        HistoryConfig.changeAlarmsCount(self, self.settings['alarms_count'].value);
        setTimeout(() => {
            HistoryConfig.renameAlarmInputs(self);
        }, 100);
        HistoryConfig.changeTagsCount(self, self.settings['tags_count'].value);
        HistoryConfig.setPeriodicLogging(self);
        if (save) {
            node_utils_1.default.persistProperties(self, true, true, true);
        }
        if (self.properties['isOutput'])
            self.onInputUpdated();
    }
    static storeLogEntry(self, input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (input == null)
                return -1;
            const storageLimit = utils_1.default.clamp(self.settings['storage-limit'].value, 0, 50);
            const minuteRound = utils_1.default.clamp(self.settings['minuteRoundValue'].value, 0, 60);
            const now = minuteRound ? yield self.nearestFutureMinutes(minuteRound, moment()) : moment();
            let msg = {
                payload: input,
                timestamp: now._d,
            };
            for (var i = self.properties['dynamicInputStartPosition']; i < self.properties['dynamicInputStartPosition'] + Number(self.properties['alarmsCount']); i++) {
                let alarmNum = i - self.properties['dynamicInputStartPosition'] + 1;
                let alarmName = self.settings['alarm' + alarmNum].value || 'alarm' + alarmNum;
                msg[alarmName] = self.getInputData(i) || 'null';
            }
            var tags = [];
            var j = 1;
            while (j <= Number(self.properties['tagsCount'])) {
                if (self.settings['tag' + j].value)
                    tags.push(self.settings['tag' + j].value);
                j++;
            }
            msg['tags'] = tags;
            self.properties['obj'].push(msg);
            while (self.properties['obj'].length > storageLimit) {
                self.properties['obj'].shift();
            }
            self.properties['lastHistoryValue'] = input;
            node_utils_1.default.persistProperties(self, true, true, true);
            return self.properties['obj'].length;
        });
    }
    static checkCOV(self, input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!self.settings['historyMode'].value) {
                const threshold = self.settings['threshold'].value;
                if (threshold === 0 && input !== self.properties['lastHistoryValue'])
                    return true;
                const isNumber = typeof input === 'number';
                if (input !== self.properties['lastHistoryValue']) {
                    if (typeof self.properties['lastHistoryValue'] !== 'number' ||
                        !isNumber ||
                        (isNumber && Math.abs(input - self.properties['lastHistoryValue']) >= self.settings['threshold'].value))
                        return true;
                }
            }
            return false;
        });
    }
    static setPeriodicLogging(self) {
        if (self.settings['historyMode'].value == 1 && !self.useInterval) {
            self.useInterval = true;
            let interval = self.settings['period'].value;
            interval = time_utils_1.default.timeConvert(interval, self.settings['periodUnits'].value);
            self.timeoutFunc = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                let input = null;
                if (self.properties['isOutput'])
                    input = self.getInputData(self.properties['valueInput']);
                else
                    input = self.outputs[self.properties['valueInput']].data;
                yield HistoryConfig.storeLogEntry(self, input);
                if (self.properties['obj'].length > 0)
                    yield HistoryConfig.trySendStoredData(self);
                self.setOutputData(self.storedHistCountOutput, self.properties['obj'].length);
            }), interval);
        }
        else if (self.settings['historyMode'].value != 1 && self.useInterval) {
            self.useInterval = false;
            clearInterval(self.timeoutFunc);
        }
    }
    static nearestFutureMinutes(interval, someMoment) {
        const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval;
        return someMoment
            .clone()
            .minute(roundedMinutes)
            .second(0);
    }
    static changeAlarmsCount(self, target_count) {
        if (target_count > 10) {
            target_count = 10;
            self.settings['alarms_count'].value = 10;
        }
        else if (target_count < 0) {
            target_count = 0;
            self.settings['alarms_count'].value = 0;
        }
        self.properties['alarmsCount'] = Number(self.properties['alarmsCount']);
        let diff = target_count - self.properties['alarmsCount'];
        if (diff == 0)
            return;
        self.changeInputsCount(target_count + self.properties['dynamicInputStartPosition'], node_1.Type.STRING);
        var alarmsToAdd = {};
        if (diff > 0) {
            for (let i = self.properties['alarmsCount'] + 1; i <= target_count; i++) {
                alarmsToAdd['alarm' + i] = {
                    description: 'Alarm ' + i,
                    value: '',
                    type: node_1.SettingType.STRING,
                };
            }
            if (self.properties['alarmsCount'] <= 0)
                self.settings = setting_utils_1.default.insertIntoObjectAtPosition(self.settings, alarmsToAdd, 'alarms_count');
            else
                self.settings = setting_utils_1.default.insertIntoObjectAtPosition(self.settings, alarmsToAdd, 'alarm' + self.properties['alarmsCount']);
        }
        else if (diff < 0) {
            for (let i = self.properties['alarmsCount']; i > target_count; i--) {
                delete self.settings['alarm' + i];
            }
        }
        self.properties['alarmsCount'] = target_count;
    }
    static renameAlarmInputs(self) {
        for (let i = 1; i <= self.properties['alarmsCount']; i++) {
            let alarm = self.settings['alarm' + i].value;
            if (alarm.length > 20)
                alarm = '...' + alarm.substr(alarm.length - 20, 20);
            self.inputs[self.properties['dynamicInputStartPosition'] + i - 1].name = 'alarm' + i + ' | ' + alarm;
        }
        if (self.side == container_1.Side.editor) {
            for (let i = 1; i <= self.properties['alarmsCount']; i++) {
                self.inputs[self.properties['dynamicInputStartPosition'] + i - 1].label =
                    self.inputs[self.properties['dynamicInputStartPosition'] + i - 1].name;
            }
            self.setDirtyCanvas(true, true);
        }
    }
    static changeTagsCount(self, target_count) {
        if (target_count > 10) {
            target_count = 10;
            self.settings['tags_count'].value = 10;
        }
        else if (target_count < 0) {
            target_count = 0;
            self.settings['tags_count'].value = 0;
        }
        self.properties['tagsCount'] = Number(self.properties['tagsCount']);
        let diff = target_count - self.properties['tagsCount'];
        if (diff == 0)
            return;
        var tagsToAdd = {};
        if (diff > 0) {
            for (let i = self.properties['tagsCount'] + 1; i <= target_count; i++) {
                tagsToAdd['tag' + i] = {
                    description: 'Tag ' + i,
                    value: '',
                    type: node_1.SettingType.STRING,
                };
            }
            if (self.properties['tagsCount'] == 0)
                self.settings = setting_utils_1.default.insertIntoObjectAtPosition(self.settings, tagsToAdd, 'tags_count');
            else
                self.settings = setting_utils_1.default.insertIntoObjectAtPosition(self.settings, tagsToAdd, 'tag' + self.properties['tagsCount']);
        }
        else if (diff < 0) {
            for (let i = self.properties['tagsCount']; i > target_count; i--) {
                delete self.settings['tag' + i];
            }
        }
        self.properties['tagsCount'] = target_count;
    }
    static getDeviceID(self) {
        return new Promise((resolve, reject) => {
            try {
                HistoryConfig.findMainContainer(self).db.getNodeType('system/platform', (err, docs) => {
                    if (!err) {
                        let output = [];
                        output.push(docs);
                        if (output[0] && output[0][0] && output[0][0].properties) {
                            resolve(output[0][0].properties['deviceID'].trim());
                            return output[0][0].properties['deviceID'].trim();
                        }
                        else {
                        }
                        resolve(output);
                        return output;
                    }
                    else {
                        console.log(err);
                        reject(err);
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getClientID(self) {
        return new Promise((resolve, reject) => {
            try {
                HistoryConfig.findMainContainer(self).db.getNodeType('system/platform', (err, docs) => {
                    if (!err) {
                        let output = [];
                        output.push(docs);
                        if (output[0] && output[0][0] && output[0][0].settings) {
                            resolve(output[0][0].settings['clientID'].value.trim());
                            return output[0][0].settings['clientID'].value.trim();
                        }
                        else {
                        }
                        resolve(output);
                        return output;
                    }
                    else {
                        console.log(err);
                        reject(err);
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static findMainContainer(self) {
        if (self.hasOwnProperty('container'))
            return HistoryConfig.findMainContainer(self.container);
        else
            return self;
    }
    static persistProperties(self) {
        if (!self.container.db)
            return;
        self.container.db.updateNode(self.id, self.container.id, {
            $set: {
                properties: self.properties,
                inputs: self.inputs,
                settings: self.settings,
            },
        });
    }
}
exports.default = HistoryConfig;
//# sourceMappingURL=history-config.js.map