"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_validator_1 = require("./node-validator");
const AjaxRequest_1 = require("../client/helpers/AjaxRequest");
class NodeImporter {
    static importNodes(cid, text, pos) {
        return new Promise((resolve, reject) => {
            let parsed;
            try {
                parsed = JSON.parse(text);
            }
            catch (e) {
                reject(e);
                return;
            }
            const options = { allowUnknown: true };
            const output = node_validator_1.default.NodeArrayValidator().validate(parsed, options);
            if (output.error) {
                reject(output.error);
                return;
            }
            return AjaxRequest_1.default.ajax({
                url: `/api/editor/c/${cid}/import`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ ids: output.value, pos }),
            });
        });
    }
}
exports.default = NodeImporter;
//# sourceMappingURL=node-importer.js.map