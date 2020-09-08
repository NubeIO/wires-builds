"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const fs = require("fs");
const node_io_1 = require("../../node-io");
class SystemJsonFileNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Json file';
        this.description =
            'This node can read and write Json file on the disk. <br/>' +
                'Send the file name To the input named File Name. The path can be omitted. <br/>' +
                'With logic inputs named Read, Write, Delete File you can perform the requested operation. <br/>' +
                'Specify the key that you want to read/write. <br/>' +
                'The value that you want to write, send to Value input. <br/>' +
                'Read value will be sent to the output.';
        this.addInput('file name', node_io_1.Type.STRING);
        this.addInput('key', node_io_1.Type.STRING);
        this.addInput('value', node_io_1.Type.STRING);
        this.addInput('read', node_io_1.Type.BOOLEAN);
        this.addInput('write', node_io_1.Type.BOOLEAN);
        this.addInput('delete', node_io_1.Type.BOOLEAN);
        this.addOutput('value', node_io_1.Type.STRING);
    }
    onInputUpdated() {
        if (this.inputs[3].updated && this.inputs[3].data) {
            let fileName = this.getInputData(0);
            if (fileName == null)
                return this.debugWarn('Cant read file. File name is not defined');
            let key = this.getInputData(1);
            fs.readFile(fileName, 'utf8', (err, data) => {
                if (err)
                    return this.debugErr(err);
                let obj = JSON.parse(data);
                let val = obj[key];
                this.setOutputData(0, val);
            });
        }
        if (this.inputs[4].updated && this.inputs[4].data) {
            let fileName = this.getInputData(0);
            if (fileName == null)
                return this.debugWarn('Cant write file. File name is not defined');
            let key = this.getInputData(1);
            let value = this.getInputData(2);
            fs.readFile(fileName, 'utf8', (err, data) => {
                let obj = {};
                if (data)
                    obj = JSON.parse(data);
                obj[key] = value;
                let json = JSON.stringify(obj);
                fs.writeFile(fileName, json, 'utf8', err => {
                    if (err)
                        return this.debugErr(err);
                    this.debugInfo('The file ' + fileName + ' was saved!');
                });
            });
        }
        if (this.inputs[5].updated && this.inputs[5].data) {
            let fileName = this.getInputData(0);
            if (fileName == null)
                return this.debugWarn('Cant delete file. File name is not defined');
            fs.unlink(fileName, err => {
                if (err)
                    return this.debugErr(err);
                this.debugInfo('The file ' + fileName + ' was deleted!');
            });
        }
    }
}
container_1.Container.registerNodeType('system/json-file', SystemJsonFileNode);
//# sourceMappingURL=json-file.js.map