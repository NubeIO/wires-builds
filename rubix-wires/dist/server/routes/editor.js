"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const container_1 = require("../../nodes/container");
let router = express.Router();
let config = require('../../../config.json');
router.get('/', function (req, res) {
    res.render('editor/index', {
        split: req.query.split,
        container_id: 0,
        theme: config.nodeEditor.theme,
    });
});
router.get('/c/:cid', function (req, res) {
    let cid = req.params.cid || 0;
    if (!container_1.Container.containers[cid])
        return res.redirect('/editor');
    res.render('editor/index', {
        split: req.query.split,
        container_id: cid,
        theme: config.nodeEditor.theme,
    });
});
router.get('/split', function (req, res) {
    res.render('editor/split', { container_id: 0 });
});
router.get('/split/c/:cid', function (req, res) {
    let cid = req.params.cid || 0;
    if (!container_1.Container.containers[cid])
        return res.redirect('/editor/split');
    res.render('editor/split', { container_id: cid });
});
module.exports = router;
//# sourceMappingURL=editor.js.map