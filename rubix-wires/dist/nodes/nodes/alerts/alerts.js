"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const node_1 = require("../../node");
const utils_1 = require("../../utils");
const request_1 = require("../../utils/axios/request");
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
class AlertsNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Alerts';
        this.description = '';
        this.addInput('in', node_1.Type.BOOLEAN);
        this.addInputWithSettings('alarmClass', node_1.Type.DROPDOWN, ALARM_TYPE.WARNING, 'Alarm Class', false, alarmConfig);
        this.addOutput('out', node_1.Type.BOOLEAN);
    }
    getAlert(url) {
        return request_1.default.get(url);
    }
    onInputUpdated() {
        const url = `${utils_1.default.buildUrl('0.0.0.0', 3030)}/api/endpoint1`;
        this.getAlert(url).then((response) => {
            console.log(response);
        }).catch((err) => console.log(err));
        let input = this.getInputData(1);
        console.log(input);
    }
}
container_1.Container.registerNodeType('alerts/alert', AlertsNode);
//# sourceMappingURL=alerts.js.map