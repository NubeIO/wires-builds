"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const child_process_1 = require("child_process");
const node_io_1 = require("../../node-io");
const pkg = require('../../../../package.json');
class WiresVersion extends node_1.Node {
    constructor() {
        super();
        this.title = 'Build Versions';
        this.description = "A node for return the build versions of wires and nodejs'";
        this.addInput('in1', node_io_1.Type.STRING);
        this.addOutput('wires-version', node_io_1.Type.STRING);
        this.addOutput('nodejs-version', node_io_1.Type.STRING);
        this.addOutput('npm-version', node_io_1.Type.STRING);
        this.addOutput('json out', node_io_1.Type.STRING);
        this.addOutput('error', node_io_1.Type.STRING);
    }
    getCurrentWiresVersion() {
        return new Promise(function (resolve) {
            return resolve({
                version: pkg.version,
            });
        });
    }
    getNodeJsVersion() {
        return new Promise((resolve, reject) => {
            child_process_1.exec('node -v', (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                    return;
                }
                else {
                    resolve({
                        stdout,
                    });
                }
            });
        });
    }
    getNPMVersion() {
        return new Promise((resolve, reject) => {
            child_process_1.exec('npm -v', (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                    return;
                }
                else {
                    resolve({
                        stdout,
                    });
                }
            });
        });
    }
    onInputUpdated() {
        let arr = [];
        this.getCurrentWiresVersion()
            .then(r => {
            r = JSON.stringify(r)
                .replace(/\\n/g, '')
                .split('version')
                .join('wires version');
            arr.push(r);
            this.setOutputData(0, r);
        })
            .catch(e => {
            this.setOutputData(4, e);
        });
        this.getNodeJsVersion()
            .then(r => {
            r = JSON.stringify(r)
                .replace(/\\n/g, '')
                .split('stdout')
                .join('nodejs version');
            arr.push(r);
            this.setOutputData(1, r);
        })
            .catch(e => {
            this.setOutputData(4, e);
        });
        this.getNPMVersion()
            .then(r => {
            r = JSON.stringify(r)
                .replace(/\\n/g, '')
                .split('stdout')
                .join('npm version');
            arr.push(r);
            this.setOutputData(3, arr);
            this.setOutputData(2, r);
        })
            .catch(e => {
            this.setOutputData(4, e);
        });
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('system/system-build-version', WiresVersion);
//# sourceMappingURL=wires-version.js.map