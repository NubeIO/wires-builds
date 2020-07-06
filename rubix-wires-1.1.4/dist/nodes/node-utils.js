"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("./container");
const utils_1 = require("./utils");
class NodeUtils {
    static getNodesIOValues(cid) {
        let container = container_1.Container.containers[cid];
        if (!container || !container._nodes)
            return;
        let inputs_values = [];
        let outputs_values = [];
        for (let id in container._nodes) {
            let node = container._nodes[id];
            if (node.inputs) {
                for (let i in node.inputs) {
                    let data = node.getInputData(Number(i));
                    data = utils_1.default.formatAndTrimValue(data);
                    inputs_values.push({
                        nodeId: node.id,
                        inputId: i,
                        type: node.type,
                        data,
                    });
                }
            }
            if (node.outputs) {
                for (let o in node.outputs) {
                    let data = node.outputs[o].data;
                    data = utils_1.default.formatAndTrimValue(data);
                    outputs_values.push({
                        nodeId: node.id,
                        outputId: o,
                        type: node.type,
                        data,
                    });
                }
            }
        }
        return {
            cid: cid,
            inputs: inputs_values,
            outputs: outputs_values,
        };
    }
}
exports.default = NodeUtils;
//# sourceMappingURL=node-utils.js.map