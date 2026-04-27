 /*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-18 15:08:52
 * @LastEditors: userName userEmail
 * @LastEditTime: 2026-04-27 12:21:11
 * @FilePath: \徐晨冰_Node_20260118\第四十八天\express-login\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const http = require("http");
const {  
  setupMongoose,
  setupSecretKey,
  setupCors,
  setupJwt,
  setupError,
  setupCommon,
} = require("./middleware");
const {setupRouter} = require("./router");
const { setupModel } = require("./models");
const socketIo = require("socket.io");
const {setupChat} = require("./chat.js");
const {setupSSE} = require("./loginSSE.js");

const setupMiddleware = [
  setupMongoose,
  setupModel,
  setupSecretKey,
  setupCors,
  setupCommon,
  setupSSE,
  setupJwt,
  setupRouter,
  setupError,
];




const createApp = async () => {
  const app = express();
  app.locals.globalFns = {};

  for (let i = 0, item; item = setupMiddleware[i]; i++) {
    await Promise.resolve(item(app));
  }

  const server = http.createServer(app)
  
  server.listen(3000, () => {
    console.log(`listen 8080 port`)
  });

  const io = socketIo(server, { transports: ['websocket'] });
  app.locals.io = io;
  io.on("connection", (socket) => {
    console.log("连接成功");
    setupChat(app, socket);
  });

};


createApp();