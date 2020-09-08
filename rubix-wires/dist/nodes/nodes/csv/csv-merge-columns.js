"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
let moment = require('moment-timezone');
class CSVMergeColumnsNode extends node_1.Node {
    constructor() {
        super();
        this.obj = [];
        this.title = 'CSV Merge Columns';
        this.description =
            'This node merges the columns of properly formatted CSV strings.  ‘merge’ CSV string will be joined with the ‘original’ CSV string.  The ‘merge’ CSV columns will be added to the right of the ‘original’ CSV columns.  ‘null’ will be added to rows where no value exists for that column.  No error checking.';
        this.addInput('original', node_io_1.Type.STRING);
        this.addInput('merge', node_io_1.Type.STRING);
        this.addOutput('output', node_io_1.Type.STRING);
    }
    onAdded() {
        this.setOutputData(0, '');
        this.setOutputData(1, '');
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        if (!this.getInputData(0) || !this.getInputData(1))
            return;
        let originalColumnsArray = this.getInputData(0).split('\n');
        let mergeColumnsArray = this.getInputData(1).split('\n');
        let outputCSV = '';
        const originalColumnsCount = originalColumnsArray[0].split(',').length;
        const mergeColumnsCount = mergeColumnsArray[0].split(',').length;
        var i = 0;
        for (i = 0; i < Math.min(mergeColumnsArray.length, originalColumnsArray.length) - 1; i++) {
            outputCSV += originalColumnsArray[i] + ', ' + mergeColumnsArray[i] + '\n';
        }
        var x = 0;
        while (i < originalColumnsArray.length - 1) {
            outputCSV += originalColumnsArray[i];
            x = originalColumnsCount;
            while (x < originalColumnsCount + mergeColumnsCount) {
                outputCSV += ', ';
                x++;
            }
            outputCSV += '\n';
            i++;
        }
        while (i < mergeColumnsArray.length - 1) {
            x = mergeColumnsCount;
            while (x < originalColumnsCount + mergeColumnsCount) {
                outputCSV += ', ';
                x++;
            }
            outputCSV += mergeColumnsArray[i];
            outputCSV += '\n';
            i++;
        }
        this.setOutputData(0, outputCSV);
    }
}
container_1.Container.registerNodeType('csv/csv-merge-columns', CSVMergeColumnsNode);
//# sourceMappingURL=csv-merge-columns.js.map