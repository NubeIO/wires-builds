"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const fs = require("fs");
class SystemFileNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'File';
        this.description =
            'This node can read and write any file on the disk. <br/>' +
                'Send the file name to the input named File Name. The path can be omitted. <br/>' +
                'With logic inputs named Read, Write, Clear you can perform the requested operation. <br/>' +
                'The input named Text set a text value to be written to the file. <br/>' +
                'The contents of the file will be sent to the output.';
        this.addInput('file name', node_1.Type.STRING);
        this.addInput('text', node_1.Type.STRING);
        this.addInput('read', node_1.Type.BOOLEAN);
        this.addInput('write', node_1.Type.BOOLEAN);
        this.addInput('clear', node_1.Type.BOOLEAN);
        this.addOutput('text', node_1.Type.STRING);
    }
    onInputUpdated() {
        if (this.inputs[2].updated && this.inputs[2].data) {
            let fileName = this.getInputData(0);
            if (fileName == null)
                return this.debugWarn('Cant read file. File name is not defined');
            fs.readFile(fileName, (err, buff) => {
                if (err)
                    return this.debugErr(err);
                let text = buff.toString('utf8');
                this.setOutputData(0, text);
            });
        }
        if (this.inputs[3].updated && this.inputs[3].data) {
            let fileName = this.getInputData(0);
            if (fileName == null)
                return this.debugWarn('Cant write file. File name is not defined');
            let text = this.getInputData(1);
            fs.writeFile(fileName, text, err => {
                if (err)
                    return this.debugErr(err);
                this.debugInfo('The file ' + fileName + ' was saved!');
            });
        }
        if (this.inputs[4].updated && this.inputs[4].data) {
            let fileName = this.getInputData(0);
            if (fileName == null)
                return this.debugWarn('Cant write file. File name is not defined');
            fs.writeFile(fileName, '', err => {
                if (err)
                    return this.debugErr(err);
                this.debugInfo('The file ' + fileName + ' was saved!');
            });
        }
    }
}
exports.SystemFileNode = SystemFileNode;
container_1.Container.registerNodeType('system/file', SystemFileNode);
//# sourceMappingURL=file.js.map