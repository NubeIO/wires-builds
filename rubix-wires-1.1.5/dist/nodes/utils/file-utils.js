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
const fs = require("fs");
const path = require("path");
class FileUtils {
    static getDir() {
        return path.dirname(__filename);
    }
    static getAllFiles(dirPath) {
        if (dirPath === null)
            return;
        return new Promise((resolve, reject) => {
            fs.readdir(dirPath, (err, files) => {
                if (err) {
                    reject(err);
                }
                let obj = [];
                files.forEach(file => {
                    obj.push(file);
                });
                resolve(obj);
                return obj;
            });
        });
    }
    static checkFileExists(fileName) {
        return fs.existsSync(fileName);
    }
    static createFile(fileName) {
        return new Promise((resolve, reject) => {
            fs.open(fileName, 'r', (err, fd) => {
                if (err) {
                    fs.writeFile(fileName, '', err => {
                        if (err) {
                            reject(err);
                        }
                        let msg = 'The file was created!';
                        resolve(msg);
                    });
                }
                else {
                    let msg = 'The file exists!';
                    resolve(msg);
                }
            });
        });
    }
    static createDirectory(directoryPath) {
        const directory = path.normalize(directoryPath);
        return new Promise((resolve, reject) => {
            fs.stat(directory, error => {
                if (error) {
                    if (error.code === 'ENOENT') {
                        fs.mkdir(directory, error => {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve(directory);
                            }
                        });
                    }
                    else {
                        reject(error);
                    }
                }
                else {
                    resolve(directory);
                }
            });
        });
    }
    static ensureDirSync(dirPath) {
        try {
            return fs.mkdirSync(dirPath);
        }
        catch (err) {
            if (err.code !== 'EEXIST')
                throw err;
        }
    }
    static readFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs.readFile(fileName, (err, buff) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(buff);
                });
            });
        });
    }
    static readFileReturnJson(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs.readFile(fileName, (err, data) => {
                    let obj = [];
                    if (err) {
                        reject(err);
                    }
                    data
                        .toString()
                        .split('\n')
                        .forEach(function (line, index, arr) {
                        if (line.length === 0) {
                            return;
                        }
                        obj.push(line);
                    });
                    let objStringify = JSON.stringify(obj);
                    let json = JSON.parse(objStringify);
                    resolve(json);
                });
            });
        });
    }
    static appendFile(fileName, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let msg = 'The file ' + fileName + ' was saved!';
                let errorMsg = 'Cant read file. File name is not defined';
                fs.appendFile(fileName, input, err => {
                    if (err) {
                        reject(err);
                    }
                    resolve(msg);
                });
            });
        });
    }
    static writeFile(fileName, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let msg = 'The file ' + fileName + ' was saved!';
                let errorMsg = 'Cant read file. File name is not defined';
                fs.writeFile(fileName, input, err => {
                    if (err) {
                        reject(err);
                    }
                    resolve(msg);
                });
            });
        });
    }
}
exports.default = FileUtils;
//# sourceMappingURL=file-utils.js.map