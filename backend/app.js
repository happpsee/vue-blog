 /*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-18 15:08:52
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-14 12:59:00
 * @FilePath: \徐晨冰_Node_20260118\第四十八天\express-login\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const cors = require("cors");
const {staticPath} = require("./utils/config");
const { connectMongoose } = require("./plugins/mongodb");
const {expressjwt,  UnauthorizedError} = require("express-jwt");
const http = require("http");
const {decrypt,encrypt} = require('./core/index');

const { 
  loginRouter, 
  pubKeyRouter, 
  registerRouter, 
  busRouter, 
  uploadRouter, 
  artLikeRouter, 
  searchRouter,
  userRouter
} = require("./router");


const sourceMiddleware = require("./middleware/resource");
const { Key, User } = require('./models');
const createError = require("http-errors");
const { setupSecretKey } = require('./core');

const setupCors = () => {
  return cors({
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  })
}

const setupJwt = async (app) => {
  
  let {content: secret} = await Key.findOne({name: "publicKey"}).select("content");

  app.use(expressjwt({
    secret,
    algorithms: ["RS256"],
    isRevoked: async (req, token) => {
      let {payload} = token;
      const {id} = payload;
      if (!id || id.trim().length === 0) {
        return true;
      }
      try {
        let result = await User.findById(id);

        if (!result) {
          return false;
        }
        req.users = result;

      } catch (err) {
        return true;
      }
      return false;
    }
  }).unless({
    path: [
      {url: "/login", methods: ["POST"]},
      {url: "/register", methods: ["POST"]},
      {url: "/api/comments", methods: ["GET"]},
      "/getPublicKey",
      "/articles/search",
      {url: /api\/articles\/.*/, methods:["GET"]},
      {url: "/api/articles", methods: ["GET"]},
      {url: "/articles/likes", method: "GET"},
      {url: "/api/articledetail", methods: ["GET"]},
    ]
  }),  (err, req, res, next) => {
    if (err instanceof UnauthorizedError) {
      next(createError(401, "没有权限"));
    }
  });


}

const setupError = (app) => {
  app.use((err, req, res, next) => {
    let message = err.message;
    try {
      message = JSON.parse(message);
    }
    catch (error) {
      console.log("不符合json形式");
    }
    finally {
      res.status(err.status || 500).send({
        code: err.status,
        message
      })
    }
  });
}

const createApp = async () => {
  //连接数据库
  await connectMongoose();

  await setupSecretKey();
  const app = express();

  //使用cors中间件
  app.use(setupCors());

  //格式化请求中间件
  app.use(express.json());
  app.use(express.urlencoded());

  //静态资源暂时代理中间件
  app.use(express.static(staticPath));

  await setupJwt(app); 
 
  app.use("/user", userRouter);
  app.use("/login", loginRouter);
  app.use("/register", registerRouter);
  app.use("/getPublicKey", pubKeyRouter);

  app.use("/api/:resource", sourceMiddleware(), busRouter);

  app.use("/login", loginRouter);
  app.use("/register", registerRouter);
  app.use("/upload", uploadRouter);
  app.use("/articles/likes", artLikeRouter);
  app.use("/articles/search", searchRouter);
  //错误处理中间件
  setupError(app);

  http.createServer(app).listen(8080, () => {
    console.log(`listen 8080 port`)
  });

};


createApp();