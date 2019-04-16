const fs = require("fs");
const asyncReadFile = (path) => {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, "utf-8", function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
module.exports = asyncReadFile;