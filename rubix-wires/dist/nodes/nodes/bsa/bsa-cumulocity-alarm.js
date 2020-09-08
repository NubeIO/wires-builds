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
const _ = require("lodash");
const container_1 = require("../../container");
const node_1 = require("../../node");
const node_io_1 = require("../../node-io");
const bsa_client_config_1 = require("./bsa-client-config");
let moment = require('moment-timezone');
var ALARM_TYPE;
(function (ALARM_TYPE) {
    ALARM_TYPE["WARNING"] = "WARNING";
    ALARM_TYPE["MINOR"] = "MINOR";
    ALARM_TYPE["MAJOR"] = "MAJOR";
    ALARM_TYPE["CRITICAL"] = "CRITICAL";
})(ALARM_TYPE || (ALARM_TYPE = {}));
const alarmConfig = {
    items: [
        { value: ALARM_TYPE.WARNING, text: ALARM_TYPE.WARNING },
        { value: ALARM_TYPE.MINOR, text: ALARM_TYPE.MINOR },
        { value: ALARM_TYPE.MAJOR, text: ALARM_TYPE.MAJOR },
        { value: ALARM_TYPE.CRITICAL, text: ALARM_TYPE.CRITICAL },
    ],
};
class BSACumulocityAlarmNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'BSA Cumulocity Alarm';
        this.description = '';
        this.addInput('alarmInput', node_io_1.Type.BOOLEAN);
        this.addInputWithSettings('alarmText', node_io_1.Type.STRING, 'No Alarm Message Available', 'Enter Alarm Message');
        this.addInputWithSettings('alarmClass', node_io_1.Type.DROPDOWN, ALARM_TYPE.WARNING, 'Alarm Class', false, alarmConfig);
        this.addOutput('status', node_io_1.Type.BOOLEAN);
        this.addOutput('error', node_io_1.Type.STRING);
        this.settings['enable'] = {
            description: 'Alarm Enable',
            value: true,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['CumulocityDeviceID'] = {
            description: 'Cumulocity Device ID (Number)',
            value: '',
            type: node_1.SettingType.STRING,
        };
        this.settings['CumulocityAlarmName'] = {
            description: 'Alarm Name',
            value: '',
            type: node_1.SettingType.STRING,
        };
    }
    onCreated() {
        if (_.isEmpty(this.properties['alarmRegistry']))
            this.properties['alarmRegistry'] = {};
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            if (!this.settings['enable'].value)
                return;
            if (this.inputs[0].updated)
                yield this.postAlarm(this.getInputData(0));
        });
    }
    onAfterSettingsChange() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onInputUpdated();
        });
    }
    postAlarm(alarmInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let alarmName = this.settings['CumulocityAlarmName'].value || 'c8y_unknownAlarm';
            if (!alarmName.startsWith('c8y_'))
                alarmName = 'c8y_' + alarmName;
            let cfg = bsa_client_config_1.bsaClientConfig('alarm');
            if (alarmInput) {
                cfg = Object.assign(Object.assign({}, cfg), { method: 'POST', data: {
                        source: {
                            id: this.settings['CumulocityDeviceID'].value,
                        },
                        text: this.getInputData(1),
                        time: moment().toISOString(),
                        type: alarmName,
                        status: 'ACTIVE',
                        severity: this.getInputData(2),
                    } });
                try {
                    const response = yield axios_1.default(cfg);
                    this.setOutputData(0, true);
                    this.setOutputData(1, false);
                    this.properties['alarmRegistry'][alarmName] = response.data.id;
                    this.debugInfo(`ALARM_REGISTRY ${JSON.stringify(this.properties['alarmRegistry'])}`);
                }
                catch (error) {
                    this.debugErr(error);
                    this.setOutputData(0, false);
                    this.setOutputData(1, error);
                }
            }
            else if (!alarmInput) {
                const alarmID = this.properties['alarmRegistry'][alarmName];
                if (!alarmID)
                    return;
                cfg = Object.assign(Object.assign({}, cfg), { method: 'PUT', url: `alarm/alarms/${alarmID}`, data: { status: 'CLEARED' } });
                try {
                    yield axios_1.default(cfg);
                    this.setOutputData(0, false);
                    this.setOutputData(1, false);
                    delete this.properties['alarmRegistry'][alarmName];
                    this.debugInfo(`Cleared alarm ${alarmName}`);
                    this.debugInfo(`ALARM_REGISTRY ${JSON.stringify(this.properties['alarmRegistry'])}`);
                }
                catch (error) {
                    this.debugErr(`ERROR ${error}`);
                    this.setOutputData(0, false);
                    this.setOutputData(1, error);
                }
            }
            this.persistProperties(false, true);
        });
    }
}
container_1.Container.registerNodeType('bsa/bsa-cumulocity-alarm', BSACumulocityAlarmNode);
//# sourceMappingURL=bsa-cumulocity-alarm.js.map