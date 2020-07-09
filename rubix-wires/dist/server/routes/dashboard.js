"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const container_1 = require("../../nodes/container");
let router = express.Router();
router.get('/', function (req, res, next) {
    res.render('dashboard/index', { container_id: 0 });
});
router.get('/c/:cid', function (req, res, next) {
    res.render('dashboard/index', { container_id: req.params.cid });
});
router.get('/c/:cid/n/:id*', function (req, res) {
    let cont = container_1.Container.containers[req.params.cid];
    if (!cont)
        return res
            .status(404)
            .send(`Can't send request to node. Container id [${req.params.cid}] not found.`);
    let node = cont.getNodeById(req.params.id);
    if (!node)
        return res
            .status(404)
            .send(`Can't send request to node. Node id [${req.params.cid}/${req.params.id}] not found.`);
    if (node['onDashboardGetRequest'])
        node['onDashboardGetRequest'](req, res);
    else
        return res
            .status(404)
            .send(`Can't send request to node. Node id [${req.params.cid}/${req.params.id}] does not accept requests.`);
});
router.post('/c/:cid/n/:id*', function (req, res) {
    let cont = container_1.Container.containers[req.params.cid];
    if (!cont)
        return res
            .status(404)
            .send(`Can't send request to node. Container id [${req.params.cid}] not found.`);
    let node = cont.getNodeById(req.params.id);
    if (!node)
        return res
            .status(404)
            .send(`Can't send request to node. Node id [${req.params.cid}/${req.params.id}] not found.`);
    if (node['onDashboardPostRequest'])
        node['onDashboardPostRequest'](req, res);
    else
        return res
            .status(404)
            .send(`Can't send request to node. Node id [${req.params.cid}/${req.params.id}] does not accept requests.`);
});
module.exports = router;
//# sourceMappingURL=dashboard.js.map