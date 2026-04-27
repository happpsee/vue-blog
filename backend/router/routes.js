/*
 * @Author: userName userEmail
 * @Date: 2026-04-26 21:08:32
 * @LastEditors: userName userEmail
 * @LastEditTime: 2026-04-27 19:30:17
 * @FilePath: \vue-blog\backend\router\routes.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

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