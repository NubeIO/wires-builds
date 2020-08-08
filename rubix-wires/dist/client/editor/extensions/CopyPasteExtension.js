"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_importer_1 = require("../../../nodes/node-importer");
const node_exporter_1 = require("../../../nodes/node-exporter");
class CopyPasteExtension {
    constructor(renderer) {
        this.ctrlDown = false;
        this.shiftDown = false;
        this.renderer = renderer;
        this.editor = renderer.editor;
    }
    onCopyNodes(selectedNodes) {
        node_exporter_1.default.exportNodes(selectedNodes, this.editor).then(({ hasNonCloneable }) => {
            this.editor.displayMessage(`Clipboard Copy Successful.${hasNonCloneable ? ' Ignoring non cloneable.' : ''}`);
        }, e => {
            this.editor.displayMessage(e);
        });
    }
    onCloneNodes(selectedNodes = {}) {
        const pos = this.getCurrentMousePosition();
        const cid = String(this.renderer.container.id);
        node_exporter_1.default.exportNodes(selectedNodes, this.editor).then(({ hasNonCloneable, text }) => {
            node_importer_1.default.importNodes(cid, text, pos).then(() => {
                this.editor.displayMessage(`Cloned successfully.${hasNonCloneable ? ' Ignoring non cloneable.' : ''}`);
            }, err => this.editor.displayMessage(err.toString()));
        }, e => {
            this.editor.displayMessage(e);
        });
    }
    onImportNodes(cid, text, pos) {
        node_importer_1.default.importNodes(cid, text, pos).then(() => {
            this.editor.displayMessage('Node Imported');
        }, err => this.editor.displayMessage(err.toString()));
    }
    onPasteNodes() {
        const pos = this.getCurrentMousePosition();
        if (!navigator.clipboard) {
            this.editor.displayMessage("Insecure origin. Can't read from clipboard.");
            this.editor.popUpImport(pos);
            return;
        }
        navigator.clipboard
            .readText()
            .then(text => {
            this.onImportNodes(String(this.renderer.container.id), text, pos);
        })
            .catch(err => {
            this.editor.displayMessage('Failed to read clipboard contents: ' + err.toString());
            this.editor.popUpImport(pos);
        });
    }
    getCurrentMousePosition() {
        return this.renderer.convertOffsetToCanvas(this.renderer.last_mouse);
    }
    clear() {
        this.ctrlDown = false;
    }
    process(e) {
        const vKey = 86, cKey = 67, dKey = 68, shiftKey = 16;
        if (e.type == 'keydown') {
            if (e.ctrlKey || e.metaKey) {
                this.ctrlDown = true;
            }
            if (e.keyCode == shiftKey || e.shiftKey) {
                this.shiftDown = true;
            }
            if (this.ctrlDown && this.shiftDown && e.keyCode == dKey) {
                this.onCloneNodes(this.renderer.selected_nodes);
                return true;
            }
            else if (this.ctrlDown && e.keyCode == cKey) {
                this.onCopyNodes(this.renderer.selected_nodes);
                return true;
            }
            if (this.ctrlDown && e.keyCode == vKey) {
                this.onPasteNodes();
                return true;
            }
        }
        else if (e.type == 'keyup') {
            this.ctrlDown = false;
            this.shiftDown = false;
        }
        return false;
    }
}
exports.CopyPasteExtension = CopyPasteExtension;
//# sourceMappingURL=CopyPasteExtension.js.map