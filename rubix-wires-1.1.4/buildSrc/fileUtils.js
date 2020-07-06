const fs = require('fs');
const path = require('path');

const deleteFolderRecursive = dir => {
  if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
    fs.readdirSync(dir).forEach(file => {
      const curPath = `${dir}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        // Recurse
        deleteFolderRecursive(curPath);
      } else {
        // Delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
};

const ensureDirectoryExistence = filePath => {
  if (fs.existsSync(filePath)) {
    return true;
  }
  fs.mkdirSync(filePath);
  return filePath;
};

module.exports = {
  deleteFolderRecursive: deleteFolderRecursive,
  ensureDirectoryExistence: ensureDirectoryExistence,
};
