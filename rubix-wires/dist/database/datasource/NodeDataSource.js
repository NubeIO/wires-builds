"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const NeDBDataStore = require("nedb");
const config_1 = require("../../config");
const log = require('logplease').create('database', { color: 4 });
class NodeDataSource {
    asyncLoadDatabase(cleanUpInterval) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = config_1.default.dataDir;
            this.nodes = new NeDBDataStore(`${path}/nodes.db`);
            this.nodes.persistence.setAutocompactionInterval(cleanUpInterval);
            return this.load();
        });
    }
    load() {
        return new Promise((resolve, reject) => {
            this.nodes.loadDatabase(err => {
                if (err) {
                    log.error(err);
                    reject(err);
                }
                return resolve();
            });
        });
    }
    addNode(node, callback) {
        let ser_node = node.serialize();
        ser_node._id = 'c' + ser_node.cid + 'n' + ser_node.id;
        this.nodes.insert(ser_node, function (err, doc) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, doc);
        });
    }
    getNodes(callback) {
        this.nodes.find({}, function (err, docs) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, docs);
        });
    }
    getNode(id, cid, callback) {
        let _id = 'c' + cid + 'n' + id;
        this.nodes.findOne({ _id: _id }, function (err, doc) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, doc);
        });
    }
    getNodeType(type, callback) {
        this.nodes.find({ type: type }, function (err, docs) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, docs);
        });
    }
    getNodeByQuery(query, callback) {
        this.nodes.find(query, function (err, docs) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, docs);
        });
    }
    updateNode(id, cid, update, callback) {
        let _id = 'c' + cid + 'n' + id;
        this.nodes.update({ _id: _id }, update, {}, function (err, updated) {
            if (err)
                log.error(err);
            if (updated == 0)
                log.error(`Cat't update node [${cid}/${id}]. Document not found.`);
            if (callback)
                callback(err);
        });
    }
    removeNode(id, cid, callback) {
        let _id = 'c' + cid + 'n' + id;
        this.nodes.remove({ _id: _id }, {}, function (err, removed) {
            if (err)
                log.error(err);
            if (removed == 0)
                log.error("Cat't remove. Document not found.");
            if (callback)
                callback(err);
        });
    }
    dropNodes(callback) {
        this.nodes.remove({}, { multi: true }, function (err) {
            if (err)
                log.error(err);
            if (callback)
                callback(err);
        });
    }
}
exports.default = NodeDataSource;
//# sourceMappingURL=NodeDataSource.js.map