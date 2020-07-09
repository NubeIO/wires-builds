"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
let router = express.Router();
const container_1 = require("../../nodes/container");
router.get('/c/:cid', function (req, res) {
    let container = container_1.Container.containers[req.params.cid];
    if (!container)
        return res.status(404).send(`Can't get container. Container id [${req.params.cid}] not found.`);
    let s = container.serialize(true);
    res.json(s);
});
module.exports = router;
//# sourceMappingURL=api-dashboard.js.map