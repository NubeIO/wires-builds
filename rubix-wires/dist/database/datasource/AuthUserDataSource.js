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
const crypto_utils_1 = require("../../nodes/utils/crypto-utils");
const jwt = require('jsonwebtoken');
const log = require('logplease').create('auth-database', { color: 4 });
class AuthUserDataSource {
    asyncLoadDatabase(cleanUpInterval) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = config_1.default.dataDir;
            this.auth = new NeDBDataStore(`${path}/auth.db`);
            this.auth.persistence.setAutocompactionInterval(cleanUpInterval);
            return this.loadAuth();
        });
    }
    loadAuth() {
        return new Promise((resolve, reject) => {
            this.auth.loadDatabase(err => {
                if (err) {
                    log.error(err);
                    reject(err);
                }
                return resolve();
            });
        });
    }
    addAuthUser(authUser) {
        return new Promise((resolve, reject) => {
            this.auth.find({}, (err, doc) => {
                if (doc.length) {
                    log.warn('User is already inserted');
                    reject('User is already inserted');
                    return;
                }
                authUser.password = crypto_utils_1.default.encrypt(authUser.password);
                this.auth.insert(authUser, (err, doc) => {
                    if (err) {
                        reject(err);
                        log.error(err);
                    }
                    else {
                        resolve(doc);
                    }
                });
            });
        });
    }
    getAuthUser() {
        return new Promise((resolve, reject) => {
            this.auth.findOne({}, (err, doc) => {
                if (err) {
                    reject(err);
                    log.error(err);
                }
                else {
                    resolve(doc);
                }
            });
        });
    }
    deleteAuthUsers() {
        return new Promise((resolve, reject) => {
            this.auth.remove({}, { multi: true }, err => {
                if (err) {
                    reject(err);
                    log.error(err);
                }
                else {
                    resolve('Successfully removed');
                }
            });
        });
    }
    getAuthToken(authUser) {
        return new Promise((resolve, reject) => {
            this.auth.findOne({ username: authUser.username }, (err, doc) => {
                if (err) {
                    reject(err);
                    log.error(err);
                }
                else if (!doc) {
                    log.warn(`Username ${authUser.password} isn't found`);
                    reject(`Username ${authUser.password} isn't found`);
                }
                else {
                    if (crypto_utils_1.default.decrypt(doc.password) !== authUser.password) {
                        log.warn('Credential mismatch');
                        reject('Credential mismatch');
                    }
                    else {
                        const token = jwt.sign({ username: doc.username }, config_1.default.secretKey, { expiresIn: 18000 });
                        resolve(`${token}`);
                    }
                }
            });
        });
    }
    isAuthenticated(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config_1.default.secretKey, (err, decoded) => {
                if (err) {
                    log.error(err);
                    reject(err);
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}
exports.default = AuthUserDataSource;
//# sourceMappingURL=AuthUserDataSource.js.map