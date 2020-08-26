"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const CronJob = require('cron').CronJob;
const jsonata = require('jsonata');
const construe = require('cronstrue');
const cronValidator = require('cron-validator');
class CronExpressionNode extends node_1.Node {
    constructor() {
        super();
        this.job = null;
        this.jobCronExp = '';
        this.title = 'Cron Expression';
        this.description =
            "This node triggers 'output' to transition from 'false' to 'true' for 500 milliseconds at times triggered by the 'input' CRON expression. 'info' will show information about the status of the node. 'cronDescription' represents the configured scheduled timings in plain english. 'nextExecution' is a String output representing the datetime that the next 'message' will be sent from 'output'. For more information on Cron Expressions see: (https://www.freeformatter.com/cron-expression-generator-quartz.html)";
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, true, 'Enable', false);
        this.addInputWithSettings('cronExpression', node_1.Type.STRING, '', 'Cron Expression');
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.addOutput('info', node_1.Type.STRING);
        this.addOutput('cronDescription', node_1.Type.STRING);
        this.addOutput('nextExecution', node_1.Type.STRING);
        this.settings['timezone'] = {
            description: 'Enter the cron time zone',
            value: 'Australia/Sydney',
            type: node_1.SettingType.STRING,
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
        const cronExp = this.getInputData(1);
        const valid = cronValidator.isValidCron(cronExp);
        console.log('valid?', valid);
        if (!enable || !valid) {
            if (!valid) {
                this.setOutputData(1, 'invalid CRON Expression');
                console.log('I set the info');
            }
            else
                this.setOutputData(1, 'CRON job stopped');
            try {
                if (this.job)
                    this.job.stop();
            }
            catch (err) {
                console.log('err', err);
                this.setOutputData(1, err);
            }
            this.job = null;
            this.jobCronExp = '';
            this.setOutputData(0, false, true);
            this.setOutputData(2, null, true);
            this.setOutputData(3, null, true);
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
            this.setOutputData(2, construe.toString(cronExp));
            this.job = new CronJob(cronExp, () => {
                this.setOutputData(0, true);
                this.timeoutFunc = setTimeout(() => {
                    this.setOutputData(0, false);
                }, 500);
                let nextJobs = this.job.nextDates(1);
                this.setOutputData(3, this.jsonataQuery(nextJobs));
            }, null, null, timezone);
            setTimeout(function () { }, 500);
            this.setOutputData(1, 'CRON job started');
            this.job.start();
            let nextJobs = this.job.nextDates(1);
            this.setOutputData(3, this.jsonataQuery(nextJobs));
        }
        catch (err) {
            this.setOutputData(1, err);
        }
    }
}
exports.CronExpressionNode = CronExpressionNode;
container_1.Container.registerNodeType('time/cron-expression', CronExpressionNode);
//# sourceMappingURL=cron-expression.js.map