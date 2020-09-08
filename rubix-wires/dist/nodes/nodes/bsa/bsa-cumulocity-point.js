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
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
const time_utils_1 = require("../../utils/time-utils");
const axios_1 = require("axios");
const container_1 = require("../../container");
const bsa_client_config_1 = require("./bsa-client-config");
var HistoryMode;
(function (HistoryMode) {
    HistoryMode[HistoryMode["COV"] = 0] = "COV";
    HistoryMode[HistoryMode["PERIODIC"] = 1] = "PERIODIC";
    HistoryMode[HistoryMode["TRIGGER_ONLY"] = 2] = "TRIGGER_ONLY";
})(HistoryMode || (HistoryMode = {}));
class BSACumulocityNode extends node_1.Node {
    constructor() {
        super();
        this.valueInput = 0;
        this.interval = -1;
        this.title = 'BSA Cumulocity Point (History)';
        this.description = '';
        this.addInput('input', node_io_1.Type.ANY);
    }
    addHistoryConfiguration() {
        this.addInput('histTrigger', node_io_1.Type.BOOLEAN);
        this.addInput('clearStoredHis', node_io_1.Type.BOOLEAN);
        this.addOutput('histError', node_io_1.Type.ANY);
        this.addOutput('storedHistCount', node_io_1.Type.NUMBER);
        this.addOutput('lastHistExport', node_io_1.Type.STRING);
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
                    { value: node_io_1.Type.NUMBER, text: 'Number' },
                    { value: node_io_1.Type.BOOLEAN, text: 'Boolean' },
                    { value: node_io_1.Type.STRING, text: 'String' },
                ],
            },
            value: node_io_1.Type.NUMBER,
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
        this.settings['units'] = {
            description: 'Units',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.properties['obj'] = [];
    }
    setup() {
        this.addHistoryConfiguration();
    }
    init() {
        this.assignInputsOutputs();
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
            yield this.doNonPeriodicHistoryFunctions();
            this.doPeriodicHistoryFunctions();
        });
    }
    onRemoved() {
        clearInterval(this.timeoutFunc);
    }
    assignInputsOutputs() {
        for (let input in this.inputs) {
            if (this.inputs.hasOwnProperty(input)) {
                if (this.inputs[input].name == 'histTrigger')
                    this.histTriggerInput = Number(input);
                if (this.inputs[input].name == 'clearStoredHis')
                    this.clearStoredHisInput = Number(input);
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
    resetOutputs() {
        this.updateHistoryCountOutput();
    }
    doNonPeriodicHistoryFunctions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            if (!this.settings['enable'].value)
                return;
            const input = this.getInputData(this.valueInput);
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
            const multiPointPost = [];
            let measurementName = this.settings['CumulocityPointName'].value || 'c8y_unknownPoint';
            if (!measurementName.startsWith('c8y_'))
                measurementName = 'c8y_' + measurementName;
            let measurementType = this.settings['CumulocityPointType'].value || 'c8y_unknownType';
            if (!measurementType.startsWith('c8y_'))
                measurementType = 'c8y_' + measurementType;
            const seriesName = this.settings['CumulocitySeries'].value || 'unknownSeries';
            this.properties['obj'].forEach(log => {
                const dataType = this.settings['dataType'].value;
                log.payload = this.convertInput(log.payload, dataType, decimals);
                multiPointPost.push({
                    source: {
                        id: this.settings['CumulocityDeviceID'].value,
                    },
                    time: log.timestamp,
                    type: measurementType,
                    [measurementName]: {
                        [seriesName]: {
                            value: log.payload,
                            unit: String(this.settings['units'].value) || 'undefined',
                        },
                    },
                });
            });
            this.debugInfo(`SENDING DATA: ${JSON.stringify(multiPointPost)}`);
            let cfg = bsa_client_config_1.bsaClientConfig('measurement');
            cfg = Object.assign(Object.assign({}, cfg), { method: 'POST', data: { measurements: multiPointPost } });
            try {
                const response = yield axios_1.default(cfg);
                this.debugInfo(`RESPONSE FROM SERVER: ${JSON.stringify(response.data)}`);
                this.properties['obj'] = [];
                this.persistProperties(false, true);
                this.setOutputData(this.histErrorOutput, '');
                this.settings['timeAsString'].value
                    ? this.setOutputData(this.lastHistExportOutput, moment().format(), true)
                    : this.setOutputData(this.lastHistExportOutput, moment().valueOf(), true);
                this.updateHistoryCountOutput();
            }
            catch (e) {
                this.debugErr(`ERROR: ${e}`);
                this.setOutputData(this.histErrorOutput, e);
            }
        });
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
            this.properties['obj'].push(msg);
            while (this.properties['obj'].length > storageLimit) {
                this.properties['obj'].shift();
            }
            this.properties['lastHistoryValue'] = input;
            this.persistProperties(false, true);
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
                    const input = this.getInputData(this.valueInput);
                    yield this.storeLogEntry(input);
                    if (this.properties['obj'].length > 0)
                        yield this.trySendStoredData();
                }), interval);
                this.interval = interval;
                this.debugInfo(`Setting Periodic Period of: ${interval} ms`);
            }
        }
    }
    updateHistoryCountOutput() {
        this.setOutputData(this.storedHistCountOutput, (this.properties['obj'] && this.properties['obj'].length) || 0);
    }
}
container_1.Container.registerNodeType('bsa/bsa-cumulocity-point', BSACumulocityNode);
//# sourceMappingURL=bsa-cumulocity-point.js.map