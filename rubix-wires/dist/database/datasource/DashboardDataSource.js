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
class DashboardDataSource {
    asyncLoadDatabase(cleanUpInterval) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = config_1.default.dataDir;
            this.dashboard = new NeDBDataStore(`${path}/dashboard.db`);
            this.dashboard.persistence.setAutocompactionInterval(cleanUpInterval);
            return this.loadDashboard();
        });
    }
    loadDashboard() {
        return new Promise((resolve, reject) => {
            this.dashboard.loadDatabase(err => {
                if (err) {
                    log.error(err);
                    reject(err);
                }
                return resolve();
            });
        });
    }
    addUiPanel(panel, callback) {
        this.dashboard.insert(panel, function (err, doc) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, doc);
        });
    }
    getUiPanels(callback) {
        this.dashboard.find({}, function (err, docs) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, docs);
        });
    }
    getUiPanel(name, callback) {
        this.dashboard.findOne({ name: name }, function (err, doc) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, doc);
        });
    }
    updateUiPanel(name, update, callback) {
        this.dashboard.update({ name: name }, update, {}, function (err, updated) {
            if (err)
                log.error(err);
            if (updated == 0)
                log.error(`Cat't update dashboard panel [${name}]. Document not found.`);
            if (callback)
                callback(err);
        });
    }
    removeUiPanel(name, callback) {
        this.dashboard.remove({ name: name }, {}, function (err, removed) {
            if (err)
                log.error(err);
            if (removed == 0)
                log.error("Cat't remove. Document not found.");
            if (callback)
                callback(err);
        });
    }
    dropUiPanels(callback) {
        this.dashboard.remove({}, { multi: true }, function (err) {
            if (err)
                log.error(err);
            if (callback)
                callback(err);
        });
    }
}
exports.default = DashboardDataSource;
//# sourceMappingURL=DashboardDataSource.js.map