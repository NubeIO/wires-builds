"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class DateNode extends node_1.Node {
    constructor() {
        super();
        this.interval = 5000;
        this.title = 'Date';
        this.description =
            "Outputs various date information based on the system time.  String 'dateString' is the current date.  String 'dayString' is the current day of the week. Numeric 'dayOfWeek' is an integer between 0 and 6 corresponding to Sunday(0) through Saturday(6).  Numeric 'date' is and integer of the current date.  Numeric 'month' is an integer of the current month Jan(0) - Dec(12).  Numeric 'year' is an integer of the current year.";
        this.addOutput('dateString', node_1.Type.STRING);
        this.addOutput('dayString', node_1.Type.STRING);
        this.addOutput('dayOfWeek', node_1.Type.NUMBER);
        this.addOutput('date', node_1.Type.NUMBER);
        this.addOutput('month', node_1.Type.NUMBER);
        this.addOutput('year', node_1.Type.NUMBER);
    }
    onAdded() {
        clearInterval(this.timeoutFunc);
        this.timeoutFunc = setInterval(() => {
            this.recalculate();
        }, this.interval);
        this.recalculate();
    }
    recalculate() {
        let now = new Date();
        const day = now.getDay();
        let dayString = null;
        switch (day) {
            case 0:
                dayString = 'Sunday';
                break;
            case 1:
                dayString = 'Monday';
                break;
            case 2:
                dayString = 'Tuesday';
                break;
            case 3:
                dayString = 'Wednesday';
                break;
            case 4:
                dayString = 'Thursday';
                break;
            case 5:
                dayString = 'Friday';
                break;
            case 6:
                dayString = 'Saturday';
                break;
        }
        this.setOutputData(0, now.toLocaleDateString(), true);
        this.setOutputData(1, dayString, true);
        this.setOutputData(2, day, true);
        this.setOutputData(3, now.getDate(), true);
        this.setOutputData(4, now.getMonth() + 1, true);
        this.setOutputData(5, now.getFullYear(), true);
    }
}
exports.DateNode = DateNode;
container_1.Container.registerNodeType('time/date', DateNode);
//# sourceMappingURL=date.js.map