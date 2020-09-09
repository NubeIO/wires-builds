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
const node_io_1 = require("../../node-io");
const helper_1 = require("../../../utils/helper");
let moment = require('moment-timezone');
const Influx = require('influx');
const config_1 = require("../../../config");
class InfluxDBNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Influx-DB';
        this.description = 'A node for sending data to influxDB';
        this.addInput('[name]', node_io_1.Type.STRING);
        this.addInput('json-input', node_io_1.Type.JSON);
        this.addOutput('error', node_io_1.Type.BOOLEAN);
        this.addOutput('lastExport', node_io_1.Type.STRING);
        this.settings['enable'] = { description: 'Enable', value: false, type: node_1.SettingType.BOOLEAN };
        this.settings['useEnv'] = { description: 'Dont use env settings', value: false, type: node_1.SettingType.BOOLEAN };
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
        this.setSettingsConfig({
            groups: [
                { host: { weight: 3 }, port: { weight: 1 } },
                { user: {}, password: {} },
                { period: { weight: 2 }, periodUnits: {} },
            ],
            conditions: {
                host: setting => {
                    return !!setting['useEnv'].value;
                },
                port: setting => {
                    return !!setting['useEnv'].value;
                },
                authentication: setting => {
                    return !!setting['useEnv'].value;
                },
                databaseName: setting => {
                    return !!setting['useEnv'].value;
                },
                user: setting => {
                    return !!setting['authentication'].value;
                },
                password: setting => {
                    return !!setting['authentication'].value;
                },
            },
        });
    }
    onAdded() {
        this.createClient();
    }
    createClient() {
        return __awaiter(this, void 0, void 0, function* () {
            let { protocol, host, port, databaseName, username, password } = config_1.default.influxDb;
            if (this.settings['useEnv'].value) {
                host = this.settings['host'].value;
                port = this.settings['port'].value;
                this.client = new Influx.InfluxDB({
                    host: this.settings['host'].value || 'localhost',
                    port: this.settings['port'].value || 8086,
                    protocol: 'http',
                    database: this.settings['databaseName'].value || 'undefined',
                    username: this.settings['authentication'].value ? this.settings['user'].value : '',
                    password: this.settings['authentication'].value ? this.settings['password'].value : '',
                });
            }
            else {
                this.client = new Influx.InfluxDB({
                    host,
                    port,
                    protocol: protocol === 'https' ? 'https' : 'http',
                    database: databaseName,
                    username,
                    password,
                });
            }
        });
    }
    ;
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        if (!this.client)
            return;
        if (!this.settings['enable'].value)
            return;
        if (this.inputs[0].updated) {
            let nodeName = this.getInputData(0);
            if (!helper_1.isNull(nodeName)) {
                this.name = nodeName;
                this.broadcastNameToClients();
            }
            ;
        }
        const input = this.getInputData(1);
        if (helper_1.isNull(input))
            return;
        const measurementHas = input.hasOwnProperty('measurement');
        const measurementTags = input.hasOwnProperty('tags');
        const measurementFields = input.hasOwnProperty('fields');
        if (!input)
            return;
        if (input === !helper_1.isJSON) {
            this.debugInfo(`INFLUX-DB NODE: input isn't JSON`);
            return;
        }
        ;
        let tagObj;
        try {
            if (helper_1.isNull(input))
                return;
            tagObj = JSON.parse(input.tags);
        }
        catch (err) {
            this.debugInfo(`INFLUX-DB NODE: try/catch  json parse of tags, ${err}`);
        }
        ;
        if (helper_1.isNull(input))
            return;
        if (measurementHas && measurementTags && measurementFields) {
            this.setOutputData(0, false);
            this.setOutputData(1, moment().format());
            this.client.writePoints([
                {
                    measurement: input.measurement,
                    tags: tagObj,
                    fields: input.fields
                }
            ]).catch(err => {
                this.debugInfo(`INFLUX-DB NODE: error on influx write, ${err}`);
                this.setOutputData(0, true);
            });
        }
    }
    ;
    onAfterSettingsChange() {
        if (this.side !== container_1.Side.server)
            return;
        this.createClient();
        this.onInputUpdated();
    }
    ;
}
container_1.Container.registerNodeType('history/influx-db', InfluxDBNode);
//# sourceMappingURL=influx-db.js.map