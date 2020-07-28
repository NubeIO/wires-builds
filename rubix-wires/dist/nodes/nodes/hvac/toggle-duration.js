"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const time_utils_1 = require("../../utils/time-utils");
class ToggleDurationNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Toggle Duration';
        this.description =
            "This node accepts a 'pushButton' input which triggers 'output' to 'true' for the 'runtime', or until 'pushButton' transitions from 'false' to 'true' within the 'runtime' period";
        this.addInput('pushButton', node_1.Type.BOOLEAN);
        this.addInputWithSettings('runtime', node_1.Type.NUMBER, 120, 'Runtime');
        this.addOutput('output', node_1.Type.BOOLEAN);
        this.addOutput('remainingRuntime', node_1.Type.NUMBER);
        this.settings['time'] = {
            description: 'Units',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'seconds', text: 'Seconds' },
                    { value: 'minutes', text: 'Minutes' },
                    { value: 'hours', text: 'Hours' },
                ],
            },
            value: 'minutes',
        };
        this.setSettingsConfig({
            groups: [{ runtime: { weight: 2 }, time: {} }],
        });
    }
    onCreated() {
        this.setOutputData(0, false);
        this.lastTrigger = false;
        this.onAfterSettingsChange();
    }
    onAdded() {
        this.inputs[1]['name'] = `[runtime] (${this.settings['time'].value})`;
        this.EXECUTE_INTERVAL = 10000;
        this.onAfterSettingsChange();
    }
    onExecute() {
        if (this.runState) {
            const remainingMins = (this.runtimeVal - (new Date().valueOf() - this.startTime)) * 1.6667e-5;
            this.setOutputData(1, remainingMins.toFixed(1));
            if (remainingMins <= 0)
                this.stop();
        }
    }
    onInputUpdated() {
        let trigger = this.getInputData(0);
        if (trigger == null)
            this.lastTrigger = false;
        else if (trigger && !this.lastTrigger) {
            let runtime = this.getInputData(1);
            runtime = time_utils_1.default.timeConvert(runtime, this.settings['time'].value);
            if (this.runState)
                this.stop();
            else
                this.start(runtime);
        }
        this.lastTrigger = trigger;
    }
    start(runtime) {
        this.runState = true;
        this.runtimeVal = runtime;
        this.EXECUTE_INTERVAL = Math.max(Math.min(10000, runtime / 10), 250);
        this.startTime = new Date().valueOf();
        this.setOutputData(0, true);
        this.onExecute();
    }
    stop() {
        this.runState = false;
        this.setOutputData(0, false);
        this.setOutputData(1, 0);
    }
    onAfterSettingsChange() {
        this.inputs[1]['name'] = `[runtime] (${this.settings['time'].value})`;
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('hvac/toggle-duration', ToggleDurationNode);
//# sourceMappingURL=toggle-duration.js.map