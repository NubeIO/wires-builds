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
class HistorianDataSource {
    asyncLoadDatabase(cleanUpInterval) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = config_1.default.dataDir;
            this.history = new NeDBDataStore(`${path}/history.db`);
            this.history.persistence.setAutocompactionInterval(cleanUpInterval);
            return this.loadHistory();
        });
    }
    loadHistory() {
        return new Promise((resolve, reject) => {
            this.history.loadDatabase(err => {
                if (err) {
                    log.error(err);
                    reject(err);
                }
                return resolve();
            });
        });
    }
    addHistory(history, callback) {
        this.history.insert(history, function (err, doc) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, doc);
        });
    }
    updateHistory(query, history, callback, updatedCallback) {
        this.history.update(query, history, {}, function (err, updated) {
            if (err)
                log.error(err);
            else {
                updatedCallback(updated);
            }
            if (updated == 0)
                log.error(`Can't update history [${name}]. Document not found.`);
            if (callback)
                callback(err);
        });
    }
    removeHistory(query, callback, removedCallback) {
        this.history.remove(query, {}, function (err, removed) {
            if (err) {
                log.error(err);
            }
            else {
                removedCallback(removed);
            }
            if (removed == 0)
                log.debug("Cat't remove. History Document not found.");
            if (callback)
                callback(err);
        });
    }
}
exports.default = HistorianDataSource;
//# sourceMappingURL=HistorianDataSource.js.map