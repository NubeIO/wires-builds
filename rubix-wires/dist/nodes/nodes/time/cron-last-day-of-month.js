var CronJob = require('cron').CronJob;
var moment = require('moment');
var today = new Date();
var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
let job = new CronJob(lastDayOfMonth, function () {
    const d = new Date();
    console.log('Specific date:', date, ', onTick at:', d);
}, null, null, 'Australia/Brisbane');
console.log('After job instantiation');
let nextJobs = job.nextDates(1);
console.log(nextJobs);
job = new CronJob('0 00 16 28-31 * *', function () {
    if (isLastDayOfMonth()) {
        doSomeStuff();
    }
}, null, true, 'America/Los_Angeles');
let date = new Date();
function isLastDayOfMonth() {
    const currentDay = moment().format('YYYY-MM-DD');
    const lastDayOfCurrentMonth = moment(date)
        .endOf('month')
        .format('YYYY-MM-DD');
    if (currentDay === lastDayOfCurrentMonth) {
        return true;
    }
    else {
        return false;
    }
}
function doSomeStuff() {
}
//# sourceMappingURL=cron-last-day-of-month.js.map