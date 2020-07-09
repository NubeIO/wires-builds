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
class UserDataSource {
    asyncLoadDatabase(cleanUpInterval) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = config_1.default.dataDir;
            this.users = new NeDBDataStore(`${path}/users.db`);
            this.users.persistence.setAutocompactionInterval(cleanUpInterval);
            return this.loadUsers();
        });
    }
    loadUsers() {
        return new Promise((resolve, reject) => {
            this.users.loadDatabase(err => {
                if (err) {
                    log.error(err);
                    reject(err);
                }
                return resolve();
            });
        });
    }
    addUser(user, callback) {
        this.users.insert(user, function (err, doc) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, doc);
        });
    }
    getUser(query, callback) {
        this.users.findOne(query, function (err, doc) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, doc);
        });
    }
    getUsers(callback) {
        this.users.find({}, function (err, docs) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, docs);
        });
    }
    getAsyncUsers() {
        return new Promise((resolve, reject) => {
            this.users.find({}, function (err, doc) {
                if (err) {
                    log.error(err);
                    reject(err);
                }
                else
                    resolve(doc);
            });
        });
    }
    updateUser(query, user, callback) {
        this.users.update(query, user, {}, function (err, updated) {
            if (err)
                log.error(err);
            if (updated == 0)
                log.error(`Cat't update user [${name}]. Document not found.`);
            if (callback)
                callback(err);
        });
    }
    getUsersCount(callback) {
        this.users.count({}, function (err, num) {
            if (err)
                log.error(err);
            if (callback)
                callback(err, num);
        });
    }
    addOrUpdateUser(query, user) {
        return new Promise((resolve, reject) => {
            this.getUser(query, (err, usr) => {
                if (usr) {
                    this.updateUser(query, user, err => {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });
                }
                else {
                    this.addUser(user, err => {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });
                }
            });
        });
    }
    removeUser(query, callback) {
        this.users.remove(query, {}, function (err, removed) {
            if (err)
                log.error(err);
            if (callback)
                callback(err);
        });
    }
    dropUsers(callback) {
        this.users.remove({}, { multi: true }, function (err) {
            if (err)
                log.error(err);
            if (callback)
                callback(err);
        });
    }
}
exports.default = UserDataSource;
//# sourceMappingURL=UserDataSource.js.map