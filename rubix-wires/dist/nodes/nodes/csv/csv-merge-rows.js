"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
let moment = require('moment-timezone');
class CSVMergeRowsNode extends node_1.Node {
    constructor() {
        super();
        this.obj = [];
        this.title = 'CSV Merge Rows';
        this.description =
            'This node merges the rows of properly formatted CSV strings.  ‘merge’ CSV string will be joined with the ‘original’ CSV string.  The ‘merge’ CSV rows will be added below the ‘original’ CSV rows.  Only the ‘original’ header titles will be kept.  No error checking.';
        this.addInput('original', node_io_1.Type.STRING);
        this.addInput('merge', node_io_1.Type.STRING);
        this.addOutput('output', node_io_1.Type.STRING);
    }
    onAdded() {
        this.setOutputData(0, '');
        this.onInputUpdated();
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        if (!this.getInputData(0) || !this.getInputData(1))
            return;
        let outputCSV = this.getInputData(0).slice(0, this.getInputData(0).length - 1);
        let addCSV = this.getInputData(1);
        addCSV = addCSV.slice(addCSV.indexOf('\n'), addCSV.length - 1);
        outputCSV += addCSV;
        this.setOutputData(0, outputCSV);
    }
}
container_1.Container.registerNodeType('csv/csv-merge-rows', CSVMergeRowsNode);
//# sourceMappingURL=csv-merge-rows.js.map