"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const CronJob = require('cron').CronJob;
const jsonata = require('jsonata');
const construe = require('cronstrue');
class CronIntervalNode extends node_1.Node {
    constructor() {
        super();
        this.job = null;
        this.jobCronExp = '';
        this.title = 'Cron Interval';
        this.description =
            "This node triggers 'output' to transition from 'false' to 'true' for 500 milliseconds at a selected times/intervals, configured in settings.  'info' will show information about the status of the node. 'cronExpression' represents the configured scheduled timings in Cron notation. 'cronDescription' represents the configured scheduled timings in plain english. 'nextExecution' is a String output representing the datetime that the next 'message' will be sent from 'output'. For more information on Cron Expressions see: (https://www.freeformatter.com/cron-expression-generator-quartz.html)";
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, false, 'Enable', false);
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.addOutput('info', node_1.Type.STRING);
        this.addOutput('cronExpression', node_1.Type.STRING);
        this.addOutput('cronDescription', node_1.Type.STRING);
        this.addOutput('nextExecution', node_1.Type.STRING);
        this.settings['timezone'] = {
            description: 'Enter the cron time zone',
            value: 'Australia/Sydney',
            type: node_1.SettingType.STRING,
        };
        this.settings['cron-type'] = {
            description: 'Cron Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'Every Minutes (At every xth minute)' },
                    { value: 1, text: 'Every Hours (At minute x past every xth hour.)' },
                    { value: 2, text: 'Every Days (At x:xx every x days)' },
                    { value: 8, text: 'Every Day At Time (x:xx)' },
                    { value: 3, text: 'Every Month (Start of every month)' },
                    { value: 4, text: 'Every Month On (On x Day at x:xx)' },
                    { value: 5, text: 'Every Year (Start of every year)' },
                    { value: 6, text: 'Every Year On (On x month x day at x:xx)' },
                    { value: 7, text: 'Between Days (At x:xx between x and x day of the month)' },
                ],
            },
            value: 0,
        };
        this.settings['min'] = {
            description: 'Set minute',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['hour'] = {
            description: 'Set hour',
            value: 13,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['day'] = {
            description: 'Set day',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['dayBetweenStart'] = {
            description: 'Day Range Start',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['dayBetweenEnd'] = {
            description: 'Day Range End',
            value: 15,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['month'] = {
            description: 'Set month',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.setSettingsConfig({
            groups: [{ dayBetweenStart: {}, dayBetweenEnd: {} }],
            conditions: {
                min: setting => {
                    const cronSetting = setting['cron-type'].value;
                    return (cronSetting == 0 ||
                        cronSetting == 1 ||
                        cronSetting == 2 ||
                        cronSetting == 4 ||
                        cronSetting == 6 ||
                        cronSetting == 7 ||
                        cronSetting == 8);
                },
                hour: setting => {
                    const cronSetting = setting['cron-type'].value;
                    return (cronSetting == 1 ||
                        cronSetting == 2 ||
                        cronSetting == 4 ||
                        cronSetting == 6 ||
                        cronSetting == 7 ||
                        cronSetting == 8);
                },
                day: setting => {
                    const cronSetting = setting['cron-type'].value;
                    return cronSetting == 2 || cronSetting == 4 || cronSetting == 6 || cronSetting == 7;
                },
                dayBetweenStart: setting => {
                    const cronSetting = setting['cron-type'].value;
                    return cronSetting == 7;
                },
                dayBetweenEnd: setting => {
                    const cronSetting = setting['cron-type'].value;
                    return cronSetting == 7;
                },
                month: setting => {
                    const cronSetting = setting['cron-type'].value;
                    return cronSetting == 6;
                },
            },
        });
    }
    onAdded() {
        clearInterval(this.timeoutFunc);
        this.setOutputData(0, false);
        this.onAfterSettingsChange();
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
    onRemoved() {
        if (this.job)
            this.job.stop();
    }
    jsonataQuery(nextJobs) {
        let expression = jsonata('_d');
        return expression.evaluate(nextJobs);
    }
    onInputUpdated() {
        const enable = this.getInputData(0);
        const minute = parseInt(this.settings['min'].value);
        const hour = parseInt(this.settings['hour'].value);
        const day = parseInt(this.settings['day'].value);
        const dayBetweenStart = parseInt(this.settings['dayBetweenStart'].value);
        const dayBetweenEnd = parseInt(this.settings['dayBetweenEnd'].value);
        const month = parseInt(this.settings['month'].value);
        const timezone = this.settings['timezone'].value;
        const cronType = this.settings['cron-type'].value;
        let cronExp = null;
        if (enable) {
            cronExp = 'invalid';
            if (cronType == 0 && minute >= 0 && minute < 60) {
                cronExp = '*/' + minute + ' * * * *';
            }
            else if (cronType == 1 && minute >= 0 && minute < 60 && hour >= 0 && hour < 24) {
                cronExp = minute + ' */' + hour + ' * * *';
            }
            else if (cronType == 2 && minute >= 0 && minute < 60 && hour >= 0 && hour < 24 && day > 0 && day <= 31) {
                cronExp = minute + ' ' + hour + ' */' + day + ' * *';
            }
            else if (cronType == 3) {
                cronExp = '0 0 1 * *';
            }
            else if (cronType == 4 && minute >= 0 && minute < 60 && hour >= 0 && hour < 24 && day > 0 && day <= 31) {
                cronExp = minute + ' ' + hour + ' ' + day + ' * *';
            }
            else if (cronType == 5) {
                cronExp = '0 0 1 1 *';
            }
            else if (cronType == 6 &&
                minute >= 0 &&
                minute < 60 &&
                hour >= 0 &&
                hour < 24 &&
                day > 0 &&
                day <= 31 &&
                month >= 0 &&
                month <= 12) {
                cronExp = minute + ' ' + hour + ' ' + day + ' ' + month + ' *';
            }
            else if (cronType == 7 &&
                minute >= 0 &&
                minute < 60 &&
                hour >= 0 &&
                hour < 24 &&
                dayBetweenStart < dayBetweenEnd &&
                dayBetweenStart >= 1 &&
                dayBetweenStart <= 30 &&
                dayBetweenEnd >= 2 &&
                dayBetweenEnd <= 31) {
                cronExp = minute + ' ' + hour + ' ' + dayBetweenStart + '-' + dayBetweenEnd + ' * *';
            }
            else if (cronType == 8 && minute >= 0 && minute < 60 && hour >= 0 && hour < 24) {
                cronExp = minute + ' ' + hour + ' * * *';
            }
        }
        if (!enable || cronExp == null || cronExp === 'invalid') {
            if (cronExp === 'invalid')
                this.setOutputData(1, 'invalid configuration');
            else
                this.setOutputData(1, 'CRON job stopped');
            try {
                if (this.job)
                    this.job.stop();
            }
            catch (err) {
                this.setOutputData(1, err);
            }
            this.job = null;
            this.jobCronExp = '';
            this.setOutputData(0, false, true);
            this.setOutputData(2, null, true);
            this.setOutputData(3, null, true);
            this.setOutputData(4, null, true);
            return;
        }
        if (this.job && cronExp !== this.jobCronExp) {
            this.setOutputData(1, 'CRON job stopped');
            this.job.stop();
            this.job = null;
            this.jobCronExp = '';
        }
        try {
            this.jobCronExp = cronExp;
            this.setOutputData(2, cronExp);
            this.setOutputData(3, construe.toString(cronExp));
            this.job = new CronJob(cronExp, () => {
                this.setOutputData(0, true);
                this.timeoutFunc = setTimeout(() => {
                    this.setOutputData(0, false);
                }, 500);
                let nextJobs = this.job.nextDates(1);
                this.setOutputData(4, this.jsonataQuery(nextJobs));
            }, null, null, timezone);
            setTimeout(function () { }, 500);
            this.setOutputData(1, 'CRON job started');
            this.job.start();
            let nextJobs = this.job.nextDates(1);
            this.setOutputData(4, this.jsonataQuery(nextJobs));
        }
        catch (err) {
            this.setOutputData(1, err);
        }
    }
}
exports.CronIntervalNode = CronIntervalNode;
container_1.Container.registerNodeType('time/cron-interval', CronIntervalNode);
//# sourceMappingURL=cron-interval.js.map