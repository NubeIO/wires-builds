"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const priority_config_1 = require("../../utils/points/priority-config");
const history_config_1 = require("../../utils/points/history-config");
class GenericNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Generic Point';
        this.description = 'This node is to test the generic point input types';
        priority_config_1.default.addPrioritySettings(this);
        history_config_1.default.addHistorySettings(this);
        this.setSettingsConfig({ groups: [], conditions: {} });
        priority_config_1.default.addPrioritySettingsConfig(this);
        history_config_1.default.addHistorySettingsConfig(this, 0, false);
    }
    onCreated() {
        priority_config_1.default.priorityOnCreated(this);
        history_config_1.default.historyOnCreated(this);
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        priority_config_1.default.doPriorityFunctions(this);
        if (this.side !== container_1.Side.server)
            return;
        history_config_1.default.doHistoryFunctions(this);
    }
    onAfterSettingsChange() {
        priority_config_1.default.priorityFunctionsForAfterSettingsChange(this);
        history_config_1.default.historyFunctionsForAfterSettingsChange(this, this.settings['pointName'].value);
        priority_config_1.default.doPriorityFunctions(this);
        if (this.side !== container_1.Side.server)
            return;
        history_config_1.default.doHistoryFunctions(this);
    }
}
container_1.Container.registerNodeType('point/generic-point', GenericNode);
//# sourceMappingURL=generic-point.js.map