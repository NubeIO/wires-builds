"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_io_1 = require("../../node-io");
const ui_node_1 = require("./ui-node");
const container_1 = require("../../container");
class UiSliderNode extends ui_node_1.UiNode {
    constructor(container, id, properties) {
        super('Slider', 'UiSliderNode', properties);
        this.description =
            "Dashboard node which displays an input slider bar on the dashboard.  The user can move the slider bar knob to adjust the output between 0 and 100.  The slider can be overridden by wiring a Numeric into the node 'input'. ";
        this.title = 'Slider';
        this.addInput('input', node_io_1.Type.NUMBER);
        this.addOutput('output', node_io_1.Type.NUMBER);
        this.UPDATE_INPUTS_INTERVAL = 100;
        this.setState(0);
    }
    onAdded() {
        super.onAdded();
        if (this.side == container_1.Side.server)
            this.setOutputData(0, this.getState());
    }
    onGetMessageToServerSide(data) {
        this.setValue(data.state);
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        this.setValue(val);
    }
    setValue(val) {
        if (val > 100)
            val = 100;
        if (val < 0)
            val = 0;
        this.setOutputData(0, val);
        this.sendIOValuesToEditor();
        this.isRecentlyActive = true;
        if (this.getState() != val)
            this.setState(val);
    }
}
exports.UiSliderNode = UiSliderNode;
container_1.Container.registerNodeType('dashboard/slider', UiSliderNode);
//# sourceMappingURL=slider.js.map