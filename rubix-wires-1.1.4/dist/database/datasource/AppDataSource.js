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
class AppDataSource {
    asyncLoadDatabase(cleanUpInterval) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = config_1.default.dataDir;
            this.app = new NeDBDataStore(`${path}/app.db`);
            this.app.persistence.setAutocompactionInterval(cleanUpInterval);
            return this.loadApp();
        });
    }
    loadApp() {
        return new Promise((resolve, reject) => {
            this.app.loadDatabase(err => {
                if (err) {
                    log.error(err);
                    reject(err);
                }
                return resolve();
            });
        });
    }
    getLastContainerId(callback) {
        this.app.findOne({ _id: 'lastContainerId' }, function (err, doc) {
            if (err)
                log.error(err);
            if (callback) {
                if (doc)
                    callback(err, doc.last);
                else
                    callback(err, null);
            }
        });
    }
    updateLastContainerId(id, callback) {
        this.app.update({ _id: 'lastContainerId' }, { $set: { last: id } }, { upsert: true }, function (err, updated) {
            if (err)
                log.error(err);
            if (updated == 0)
                log.error("Cat't update. Document not found.");
            if (callback)
                callback(err);
        });
    }
    getLastRootNodeId(callback) {
        this.app.findOne({ _id: 'lastRootNodeId' }, function (err, doc) {
            if (err)
                log.error(err);
            if (callback) {
                if (doc)
                    callback(err, doc.last);
                else
                    callback(err, null);
            }
        });
    }
    updateLastRootNodeId(id, callback) {
        this.app.update({ _id: 'lastRootNodeId' }, { $set: { last: id } }, { upsert: true }, function (err, updated) {
            if (err)
                log.error(err);
            if (updated == 0)
                log.error("Cat't update. Document not found.");
            if (callback)
                callback(err);
        });
    }
    dropApp(callback) {
        this.app.remove({}, { multi: true }, function (err) {
            if (err)
                log.error(err);
            if (callback)
                callback(err);
        });
    }
}
exports.default = AppDataSource;
//# sourceMappingURL=AppDataSource.js.map