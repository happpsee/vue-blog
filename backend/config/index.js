const {findRoot} = require("../utils");
const path = require("path");

const host = "http:127.0.0.1:8080/";
const rootPath = findRoot();
const staticPath = path.join(rootPath, "static");
const maxFileSize = 1024000;

module.exports = {
  "host": host,
  "rootPath": rootPath,
  "staticPath": staticPath,
  "maxFileSize": maxFileSize
}