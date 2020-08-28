"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const time_utils_1 = require("../../utils/time-utils");
class ScheduleAfterhoursOffWidgetNode extends node_1.Node {
    constructor() {
        super();
        this.currentMode = 'SCHEDULE';
        this.remainingRuntime = 0;
        this.updateInterval = 5000;
        this.title = 'Schedule-Afterhours-Off Widget';
        this.description =
            "This node works with a multi-select cloud dashboard widget to perform the logic to output 'enable' and 'remaining runtime'.  Widget Example:  " +
                `{"new":false,"widgetType":"MultiSwitch","dataSource":"Ditto","tableSelectionMode":"Tabular","cellWidthAuto":true,"numCharts":1,"timeSeriesData":true,"valuePrecision":3,"trimTableHeaders":0,"enableTooltip":true,"enableLegend":true,"enableZoomSlider":true,"syncTime":60,"chartSettings":[{"xAxisSplits":3,"yAxisSplits":5}],"graphType":"LineChart","fontSize":35,"statusImageName":"Light","trueStatus":1,"falseStatus":0,"priority":16,"sliderMin":10,"sliderMax":30,"sliderStep":0.1,"min":0,"max":100,"gaugeSplits":6,"maximum":0,"unit":"°C","steps":0,"reverseGradient":true,"lowerBound":0,"upperBound":100,"cellWidth":150,"tickCount":100,"theme":"nube","titleColor":"#333333","gateway":"/api/ditto","query":"/api/2/things/com.nubeio:97768707-4a17-4d36-baa5-e1f95cbd74d4/features/points/properties/CHAPEL_Mode","units":"%","title":"AC Control","containerHeight":150,"icon":"None","topicIcon":"None","subTopicIcon":"None","layouts":{"lg":{"w":6,"h":4,"x":0,"y":7,"moved":false,"static":false},"md":{"x":0,"y":144,"w":6,"h":8},"sm":{"x":0,"y":104,"w":6,"h":8},"xs":{"x":0,"y":8,"w":4,"h":8},"xxs":{"x":0,"y":8,"w":2,"h":8}},"numButtons":3,"buttonSettings":[{"name":"SCHEDULE","value":"SCHEDULE"},{"name":"AFTERHOURS","value":"AFTERHOURS"},{"name":"OFF","value":"OFF"}],"dataType":"Global","enableBackground":false,"isSelect":false,"fontWeight":"bold","fontColor":"","overriddenFields":[],"isTransparent":false,"isSelectedDitto":true,"showValue":true,"dataEditorCode":""}`;
        this.addInput('modeInput', node_1.Type.STRING);
        this.addInput('scheduleInput', node_1.Type.BOOLEAN);
        this.addInput('scheduleNextStop', node_1.Type.NUMBER);
        this.addInputWithSettings('AH duration (mins)', node_1.Type.NUMBER, 120, 'Afterhours Duration (minutes)');
        this.addOutput('modeOutput', node_1.Type.STRING);
        this.addOutput('enableOutput', node_1.Type.BOOLEAN);
        this.addOutput('remainingRuntime (ms)', node_1.Type.NUMBER);
        this.AHRuntime = time_utils_1.default.timeConvert(120, 'minutes');
    }
    onCreated() {
        this.currentMode = 'OFF';
        this.onInputUpdated();
    }
    onAdded() {
        this.currentMode = 'OFF';
        this.onInputUpdated();
    }
    onInputUpdated() {
        const modeInput = this.getInputData(0);
        if (modeInput == null) {
            this.currentMode = null;
            this.setOutputData(0, '');
            this.setOutputData(1, null);
            if (this.timeoutFunc)
                clearInterval(this.timeoutFunc);
            this.remainingRuntime = 0;
            this.setOutputData(2, null, true);
            return;
        }
        else if (modeInput == 'OFF') {
            this.currentMode = 'OFF';
            this.setOutputData(0, 'OFF');
            this.setOutputData(1, false);
            if (this.timeoutFunc)
                clearInterval(this.timeoutFunc);
            this.remainingRuntime = 0;
            this.setOutputData(2, 0, true);
            return;
        }
        else if (modeInput == 'SCHEDULE' && this.currentMode !== modeInput) {
            this.currentMode = 'SCHEDULE';
            this.setOutputData(0, 'SCHEDULE');
            if (this.getInputData(1))
                this.startSchedule();
            else {
                if (this.timeoutFunc)
                    clearInterval(this.timeoutFunc);
                this.setOutputData(1, false);
                this.setOutputData(2, 0);
            }
        }
        else if (modeInput == 'AFTERHOURS' && this.currentMode !== modeInput) {
            this.startAfterhours();
        }
        if (this.currentMode === 'SCHEDULE') {
            const schedInput = this.getInputData(1);
            if (!schedInput)
                this.setOutputData(2, 0);
            if (this.inputs[1].updated) {
                if (schedInput) {
                    this.setOutputData(1, true);
                    this.startSchedule();
                }
                else {
                    this.setOutputData(1, false, true);
                    if (this.timeoutFunc)
                        clearInterval(this.timeoutFunc);
                    this.setOutputData(2, 0);
                }
            }
            if (this.getInputData(2) == null)
                this.setOutputData(2, null);
            else if (this.inputs[2].updated) {
                const nextStop = this.getInputData(2);
                if (nextStop)
                    this.setOutputData(2, nextStop - Date.now());
            }
        }
        else if (time_utils_1.default.timeConvert(this.getInputData(3), 'minutes') !== this.AHRuntime &&
            this.currentMode === 'AFTERHOURS') {
            this.startAfterhours();
        }
    }
    startSchedule() {
        if (this.timeoutFunc)
            clearInterval(this.timeoutFunc);
        const nextStop = this.getInputData(2);
        if (nextStop) {
            this.remainingRuntime = nextStop - Date.now();
            this.setOutputData(2, this.remainingRuntime);
            this.timeoutFunc = setInterval(() => {
                this.remainingRuntime -= this.updateInterval;
                this.setOutputData(2, this.remainingRuntime);
            }, this.updateInterval);
        }
        else
            this.setOutputData(2, null);
        this.setOutputData(1, true);
    }
    startAfterhours() {
        this.currentMode = 'AFTERHOURS';
        this.setOutputData(0, 'AFTERHOURS');
        this.setOutputData(1, true);
        clearInterval(this.timeoutFunc);
        const AHDuration = time_utils_1.default.timeConvert(this.getInputData(3) || 120, 'minutes');
        this.AHRuntime = AHDuration;
        this.remainingRuntime = AHDuration;
        this.setOutputData(2, AHDuration);
        this.timeoutFunc = setInterval(() => {
            this.remainingRuntime -= this.updateInterval;
            if (this.remainingRuntime <= 0) {
                this.setOutputData(1, false);
                this.setOutputData(2, 0);
                this.currentMode = 'SCHEDULE';
                this.setOutputData(0, 'SCHEDULE');
                clearInterval(this.timeoutFunc);
                if (this.getInputData(1))
                    this.startSchedule();
                return;
            }
            this.setOutputData(2, this.remainingRuntime);
        }, this.updateInterval);
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('widget/schedule-afterhours-off', ScheduleAfterhoursOffWidgetNode);
//# sourceMappingURL=schedule-afterhours-off.js.map