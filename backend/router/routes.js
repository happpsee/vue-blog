
const { busRouter } = require("./modules/busRouter");
const {pubKeyRouter} = require("./modules/pubKeyRouter");
const {uploadRouter} = require("./modules/uploadRouter");
const {userRouter} = require("./modules/userRouter");
const {articleRouter} = require("./modules/article");
const {noMatchRouter} = require("./modules/nopMatchRouter");

const routes = [
  {  
    path: "/user",
    router: userRouter
  },
  {
    path: "/getPublicKey",
    router: pubKeyRouter,
    noWithToken: true
  },
  {
    path: "/api/:resource",
    router: busRouter,
    noWithToken: {
      methods: ["GET"]
    }
  },
  {
    path: "/upload",
    router: uploadRouter
  },
  {
    path: "/article",
    router: articleRouter,
  }
  ,{
    path: "*",
    router: noMatchRouter
  }
];

module.exports = {
  routes
}