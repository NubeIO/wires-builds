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
const AppDataSource_1 = require("./datasource/AppDataSource");
const DashboardDataSource_1 = require("./datasource/DashboardDataSource");
const NodeDataSource_1 = require("./datasource/NodeDataSource");
const ScheduleDataSource_1 = require("./datasource/ScheduleDataSource");
const HistorianDataSource_1 = require("./datasource/HistorianDataSource");
const UserDataSource_1 = require("./datasource/UserDataSource");
class NeDbDatabase {
    constructor() {
        this.userDatabase = new UserDataSource_1.default();
        this.nodeDatabase = new NodeDataSource_1.default();
        this.dashboardDatabase = new DashboardDataSource_1.default();
        this.appDatabase = new AppDataSource_1.default();
        this.scheduleDatabase = new ScheduleDataSource_1.default();
        this.historianDatabase = new HistorianDataSource_1.default();
    }
    asyncLoadDatabase(cleanUpInterval = NeDbDatabase.CLEANUP_INTERVAL) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userDatabase.asyncLoadDatabase(cleanUpInterval);
                yield this.nodeDatabase.asyncLoadDatabase(cleanUpInterval);
                yield this.dashboardDatabase.asyncLoadDatabase(cleanUpInterval);
                yield this.appDatabase.asyncLoadDatabase(cleanUpInterval);
                yield this.scheduleDatabase.asyncLoadDatabase(cleanUpInterval);
                yield this.historianDatabase.asyncLoadDatabase(cleanUpInterval);
            }
            catch (e) {
                throw e;
            }
            return null;
        });
    }
    addUser(user, callback) {
        this.userDatabase.addUser(user, callback);
    }
    addOrUpdateUser(query, user) {
        return this.userDatabase.addOrUpdateUser(query, user);
    }
    getUsers(callback) {
        this.userDatabase.getUsers(callback);
    }
    getUser(query, callback) {
        this.userDatabase.getUser(query, callback);
    }
    getAsyncUsers() {
        return this.userDatabase.getAsyncUsers();
    }
    updateUser(query, user, callback) {
        this.userDatabase.updateUser(query, user);
    }
    getUsersCount(callback) {
        this.userDatabase.getUsersCount(callback);
    }
    removeUser(query, callback) {
        this.userDatabase.removeUser(query, callback);
    }
    dropUsers(callback) {
        this.userDatabase.dropUsers();
    }
    addNode(node, callback) {
        this.nodeDatabase.addNode(node, callback);
    }
    getNodes(callback) {
        this.nodeDatabase.getNodes(callback);
    }
    getNodeType(type, callback) {
        this.nodeDatabase.getNodeType(type, callback);
    }
    getNodeByQuery(query, callback) {
        this.nodeDatabase.getNodeByQuery(query, callback);
    }
    getNode(id, cid, callback) {
        this.nodeDatabase.getNode(id, cid, callback);
    }
    updateNode(id, cid, update, callback) {
        this.nodeDatabase.updateNode(id, cid, update, callback);
    }
    removeNode(id, cid, callback) {
        this.nodeDatabase.removeNode(id, cid, callback);
    }
    dropNodes(callback) {
        this.nodeDatabase.dropNodes(callback);
    }
    addUiPanel(panel, callback) {
        this.dashboardDatabase.addUiPanel(panel, callback);
    }
    getUiPanels(callback) {
        this.dashboardDatabase.getUiPanels(callback);
    }
    getUiPanel(name, callback) {
        this.dashboardDatabase.getUiPanel(name, callback);
    }
    updateUiPanel(name, update, callback) {
        this.dashboardDatabase.updateUiPanel(name, update, callback);
    }
    dropUiPanels(callback) {
        this.dashboardDatabase.dropUiPanels(callback);
    }
    removeUiPanel(name, callback) {
        this.dashboardDatabase.removeUiPanel(name, callback);
    }
    getLastContainerId(callback) {
        this.appDatabase.getLastContainerId(callback);
    }
    updateLastContainerId(id, callback) {
        this.appDatabase.updateLastContainerId(id, callback);
    }
    getLastRootNodeId(callback) {
        this.appDatabase.getLastRootNodeId(callback);
    }
    updateLastRootNodeId(id, callback) {
        this.appDatabase.updateLastRootNodeId(id, callback);
    }
    dropApp(callback) {
        this.appDatabase.dropApp(callback);
    }
    addSchedule(schedule, callback) {
        this.scheduleDatabase.addSchedule(schedule, callback);
    }
    updateSchedule(query, schedule, callback) {
        this.scheduleDatabase.updateSchedule(query, schedule, callback);
    }
    removeSchedule(query, callback) {
        this.scheduleDatabase.removeSchedule(query, callback);
    }
    addHistory(history, callback) {
        this.historianDatabase.addHistory(history, callback);
    }
    updateHistory(query, history, callback) {
        this.historianDatabase.updateHistory(query, history, callback);
    }
    removeHistory(query, callback) {
        this.historianDatabase.removeHistory(query, callback);
    }
}
NeDbDatabase.CLEANUP_INTERVAL = 5 * 60 * 1000;
const db = new NeDbDatabase();
exports.db = db;
//# sourceMappingURL=neDbDatabase.js.map