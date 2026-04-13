const {setupMongoose} = require("./modules/mongodb.js");
const {setupSecretKey} = require("./modules/secret.js");
const {setupCors} = require("./modules/cors.js");
const {setupJwt} = require("./modules/jwt.js");
const {setupError} = require("./modules/error.js");
const { setupCommon } = require("./modules/common.js");

module.exports = {
  setupMongoose,
  setupSecretKey,
  setupCors,
  setupJwt,
  setupCommon,
  setupError
}
