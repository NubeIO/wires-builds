"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const CronJob = require('cron').CronJob;
const jsonata = require('jsonata');
const construe = require('cronstrue');
class CronWeeklyNode extends node_1.Node {
    constructor() {
        super();
        this.job = null;
        this.jobCronExp = '';
        this.title = 'Cron Weekly';
        this.description =
            "This node triggers 'output' to transition from 'false' to 'true' for 500 milliseconds at a configured time on each selected day. Days and Times are set in settings. 'info' will show information about the status of the node. 'cronExpression' represents the configured scheduled timings in Cron notation. 'cronDescription' represents the configured scheduled timings in plain english. 'nextExecution' is a String output representing the datetime that the next 'message' will be sent from 'output'. For more information on Cron Expressions see: (https://www.freeformatter.com/cron-expression-generator-quartz.html)";
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
        this.settings['min'] = {
            description: 'Set minute',
            value: 0,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['hour'] = {
            description: 'Set hour',
            value: 6,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['sunday'] = {
            description: 'sunday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['monday'] = {
            description: 'monday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['tuesday'] = {
            description: 'tuesday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['wednesday'] = {
            description: 'wednesday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['thursday'] = {
            description: 'thursday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['friday'] = {
            description: 'friday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['saturday'] = {
            description: 'saturday',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
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
        let cronExp = null;
        if (enable) {
            cronExp = 'invalid';
            const minute = this.settings['min'].value;
            const hour = this.settings['hour'].value;
            if (minute >= 0 && minute <= 59 && hour >= 0 && hour < 24) {
                cronExp = minute + ' ' + hour + ' * * ';
                let daysArray = [];
                if (this.settings['sunday'].value)
                    daysArray.push('0');
                if (this.settings['monday'].value)
                    daysArray.push('1');
                if (this.settings['tuesday'].value)
                    daysArray.push('2');
                if (this.settings['wednesday'].value)
                    daysArray.push('3');
                if (this.settings['thursday'].value)
                    daysArray.push('4');
                if (this.settings['friday'].value)
                    daysArray.push('5');
                if (this.settings['saturday'].value)
                    daysArray.push('6');
                cronExp += daysArray.join(',');
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
        const timezone = this.settings['timezone'].value;
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
exports.CronWeeklyNode = CronWeeklyNode;
container_1.Container.registerNodeType('time/cron-weekly', CronWeeklyNode);
//# sourceMappingURL=cron-weekly.js.map