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
const axios_1 = require("axios");
const container_1 = require("../../container");
const node_1 = require("../../node");
const utils_1 = require("../../utils");
const BACnet_enums_units_1 = require("../../utils/points/BACnet-enums-units");
const time_utils_1 = require("../../utils/time-utils");
const bsa_client_config_1 = require("./bsa-client-config");
let moment = require('moment-timezone');
class BSACumulocityNode extends node_1.Node {
    constructor() {
        super();
        this.inInput = 0;
        this.title = 'BSA Cumulocity Point (History)';
        this.description = '';
        this.addInput('input', node_1.Type.ANY);
        this.addInput('histTrigger', node_1.Type.BOOLEAN);
        this.addOutput('histError', node_1.Type.ANY);
        this.addOutput('storedHistCount', node_1.Type.NUMBER);
        this.addOutput('lastHistExport', node_1.Type.STRING);
        for (var input in this.inputs) {
            if (this.inputs[input].name == 'histTrigger')
                this.histTriggerInput = Number(input);
        }
        for (var output in this.outputs) {
            if (this.outputs[output].name == 'histError') {
                this.histErrorOutput = Number(output);
            }
            else if (this.outputs[output].name == 'storedHistCount') {
                this.storedHistCountOutput = Number(output);
            }
            else if (this.outputs[output].name == 'lastHistExport') {
                this.lastHistExportOutput = Number(output);
            }
        }
        this.settings['enable'] = {
            description: 'History Enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['CumulocityDeviceID'] = {
            description: 'Cumulocity Device ID (Number)',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['CumulocityPointName'] = {
            description: 'Measurement Name',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['CumulocityPointType'] = {
            description: 'Measurement Type',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['CumulocitySeries'] = {
            description: 'Series Name',
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
        this.settings['unitsType'] = {
            description: 'Units Category (save to get Units)',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: BACnet_enums_units_1.default.unitCategory,
            },
        };
        this.settings['units'] = {
            description: 'Units',
            value: BACnet_enums_units_1.default.COMMON_METRIC.NO_UNITS,
            type: node_1.SettingType.DROPDOWN,
        };
        this.setSettingsConfig({ groups: [{ unitsType: {}, units: {} }], conditions: {} });
        this.settingConfigs.groups.push({ period: { weight: 2 }, periodUnits: {} });
        this.settingConfigs.conditions['threshold'] = setting => {
            return !setting['historyMode'].value;
        };
        this.settingConfigs.conditions['period'] = setting => {
            return setting['historyMode'].value == 1;
        };
        this.settingConfigs.conditions['periodUnits'] = setting => {
            return setting['historyMode'].value == 1;
        };
        this.obj = [];
        this.timeoutFunc;
        this.useInterval = false;
        this.properties['lastHistoryValue'] = null;
        this.properties['dynamicInputStartPosition'] = this.getInputsCount();
        this.properties['valueInput'] = 0;
        this.properties['isOutput'] = true;
    }
    onAdded() {
        this.properties['pointName'] = this.settings['CumulocityPointName'].value || 'undefined';
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            let input = null;
            if (this.properties['isOutput']) {
                input = this.getInputData(this.properties['valueInput']);
            }
            else {
                input = this.outputs[this.properties['valueInput']].data;
            }
            if (this.getInputData(this.histTriggerInput) && this.inputs[this.histTriggerInput].updated) {
                yield this.storeLogEntry(input);
            }
            else if (input != null && (yield this.checkCOV(input))) {
                yield this.storeLogEntry(input);
            }
            if (this.obj.length > 0)
                yield this.trySendStoredData(this);
            this.setOutputData(this.storedHistCountOutput, this.obj.length);
        });
    }
    onAfterSettingsChange() {
        this.properties['pointName'] = this.settings['CumulocityPointName'].value;
        const unitsType = this.settings['unitsType'].value;
        this.settings['units'].config = {
            items: BACnet_enums_units_1.default.unitType(unitsType),
        };
        this.broadcastSettingsToClients();
        this.setPeriodicLogging();
        this.persistProperties();
        if (this.properties['isOutput'])
            this.onInputUpdated();
        if (this.side !== container_1.Side.server)
            return;
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
            for (var i = this.properties['dynamicInputStartPosition']; i < this.properties['dynamicInputStartPosition'] + Number(this.properties['alarmsCount']); i++) {
                let alarmNum = i - this.properties['dynamicInputStartPosition'] + 1;
                let alarmName = this.settings['alarm' + alarmNum].value || 'alarm' + alarmNum;
                msg[alarmName] = this.getInputData(i) || 'null';
            }
            var tags = [];
            var j = 1;
            while (j <= Number(this.properties['tagsCount'])) {
                if (this.settings['tag' + j].value)
                    tags.push(this.settings['tag' + j].value);
                j++;
            }
            msg['tags'] = tags;
            this.obj.push(msg);
            while (this.obj.length > storageLimit) {
                this.obj.shift();
            }
            this.properties['lastHistoryValue'] = input;
            this.persistProperties();
            return this.obj.length;
        });
    }
    trySendStoredData(self) {
        return __awaiter(this, void 0, void 0, function* () {
            let decimals = self.settings['decimals'].value;
            if (decimals > 5)
                decimals = 5;
            var errorFlag = false;
            var multiPointPost = [];
            this.obj.forEach(point => {
                var measurementName = self.settings['CumulocityPointName'].value || 'c8y_unknownPoint';
                if (!measurementName.startsWith('c8y_'))
                    measurementName = 'c8y_' + measurementName;
                var measurementType = self.settings['CumulocityPointType'].value || 'c8y_unknownType';
                if (!measurementType.startsWith('c8y_'))
                    measurementType = 'c8y_' + measurementType;
                const seriesName = this.settings['CumulocitySeries'].value || 'unknownSeries';
                multiPointPost.push({
                    source: {
                        id: self.settings['CumulocityDeviceID'].value,
                    },
                    time: moment(point.timestamp.valueOf())._d,
                    type: measurementType,
                    [measurementName]: {
                        [seriesName]: {
                            value: point.payload,
                            unit: String(this.settings['units'].value) || 'undefined',
                        },
                    },
                });
            });
            console.log('SEND DATA \n', multiPointPost);
            let cfg = bsa_client_config_1.bsaClientConfig('measurement');
            cfg['data'] = { measurements: multiPointPost };
            axios_1.default(cfg)
                .then(function (response) {
                console.log('RESPONSE', response);
            })
                .catch(function (error) {
                console.log('ERROR', error);
                self.setOutputData(this.histErrorOutput, String(error));
                errorFlag = true;
            });
            if (!errorFlag) {
                this.obj = [];
                this.setOutputData(this.histErrorOutput, '');
                this.settings['timeAsString'].value
                    ? this.setOutputData(this.lastHistExportOutput, moment().format(), true)
                    : this.setOutputData(this.lastHistExportOutput, moment().valueOf(), true);
            }
        });
    }
    checkCOV(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.settings['historyMode'].value) {
                const threshold = this.settings['threshold'].value;
                if (threshold === 0 && input !== this.properties['lastHistoryValue'])
                    return true;
                const isNumber = typeof input === 'number';
                if (input !== this.properties['lastHistoryValue']) {
                    if (typeof this.properties['lastHistoryValue'] !== 'number' ||
                        !isNumber ||
                        (isNumber &&
                            Math.abs(input - this.properties['lastHistoryValue']) >=
                                this.settings['threshold'].value)) {
                        return true;
                    }
                }
            }
            return false;
        });
    }
    setPeriodicLogging() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.settings['historyMode'].value == 1 && !this.useInterval) {
                this.useInterval = true;
                let interval = this.settings['period'].value;
                interval = time_utils_1.default.timeConvert(interval, this.settings['periodUnits'].value);
                this.timeoutFunc = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    let input = null;
                    if (this.properties['isOutput']) {
                        input = this.getInputData(this.properties['valueInput']);
                    }
                    else {
                        input = this.outputs[this.properties['valueInput']].data;
                    }
                    yield this.storeLogEntry(input);
                    if (this.obj.length > 0)
                        yield this.trySendStoredData(this);
                    this.setOutputData(this.storedHistCountOutput, this.obj.length);
                }), interval);
            }
            else if (this.settings['historyMode'].value != 1 && this.useInterval) {
                this.useInterval = false;
                clearInterval(this.timeoutFunc);
            }
        });
    }
    nearestFutureMinutes(interval, someMoment) {
        const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval;
        return someMoment
            .clone()
            .minute(roundedMinutes)
            .second(0);
    }
    persistProperties() {
        if (!this.container.db)
            return;
        this.container.db.updateNode(this.id, this.container.id, {
            $set: {
                properties: this.properties,
                inputs: this.inputs,
                settings: this.settings,
            },
        });
    }
    getDeviceID() {
        return new Promise((resolve, reject) => {
            try {
                this.findMainContainer(this).db.getNodeType('system/platform', (err, docs) => {
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
                        reject(err);
                    }
                });
            }
            catch (error) {
            }
        });
    }
    getClientID() {
        return new Promise((resolve, reject) => {
            try {
                this.findMainContainer(this).db.getNodeType('system/platform', (err, docs) => {
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
                        reject(err);
                    }
                });
            }
            catch (error) {
            }
        });
    }
    findMainContainer(search) {
        if (search.hasOwnProperty('container')) {
            return this.findMainContainer(search['container']);
        }
        else {
            return search;
        }
    }
}
container_1.Container.registerNodeType('bsa/bsa-cumulocity-point', BSACumulocityNode);
//# sourceMappingURL=bsa-cumulocity-point.js.map