"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const utils_1 = require("../../utils");
const helper_1 = require("../../../utils/helper");
const point_ref_utils_1 = require("../../utils/points/point-ref-utils");
class StringCaseAcronymsNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'String Case Acronyms';
        this.description =
            "This node will upper case any common HVAC Acronyms, For example it will Upper Fcu to FCU";
        this.addInput('input', node_io_1.Type.STRING);
        this.addOutput('output', node_io_1.Type.STRING);
    }
    onAdded() {
        this.onInputUpdated();
    }
    onInputUpdated() {
        const input = this.getInputData(0);
        if (!utils_1.default.hasInput(input)) {
            this.setOutputData(0, null, true);
            return;
        }
        if (helper_1.isNull(input))
            return;
        let result;
        let obj = point_ref_utils_1.default.acronyms;
        if (helper_1.isString(input)) {
            for (let key in obj) {
                if (obj[key].toLowerCase() === input.toLowerCase()) {
                    result = obj[key].toUpperCase();
                }
            }
            ;
            this.setOutputData(0, result, true);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('string/string-acronyms', StringCaseAcronymsNode);
//# sourceMappingURL=string-acronyms.js.map