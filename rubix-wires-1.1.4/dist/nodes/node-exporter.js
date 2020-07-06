"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class NodeExporter {
    static exportNodes(selectedNodes, editor) {
        return new Promise((resolve, reject) => {
            const ids = [];
            let hasNonCloneable = false;
            for (let n in selectedNodes) {
                const selectedNode = selectedNodes[n];
                if (selectedNode.clonable) {
                    ids.push(selectedNode.id);
                }
                else {
                    hasNonCloneable = true;
                }
            }
            if (!ids.length) {
                reject('No nodes selected');
            }
            else {
                editor.socket.sendExportNode(ids).then(res => {
                    const status = utils_1.default.copyToClipboard(JSON.stringify(res));
                    if (!status) {
                        utils_1.default.download('clipboard.json', JSON.stringify(res));
                        reject('Failure on copying on clipboard!');
                    }
                    else {
                        resolve({ hasNonCloneable, text: JSON.stringify(res) });
                    }
                }, err => {
                    reject(err.toString());
                });
            }
        });
    }
}
exports.default = NodeExporter;
//# sourceMappingURL=node-exporter.js.map