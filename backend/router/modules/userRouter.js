const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const assert = require("assert");
const {getToken} = require("../../core");
const mongoose = require("mongoose");


const LIVE_USER = new Set();

router.post("/login", async (req, res, next) => {
  let {username, password} = req.body;
  try {
    const decrypt = req.app.locals.globalFns["decrypt"];
    const privateKey = req.app.locals.privateKey;
    password = password.replace(/\. +/g, '');
    password = decrypt(password);

    if (!username || username.length === 0 || !password || password.length === 0) {
      createError(422, "必需填写账号或密码");
      return false;
    }

    let user = await req.Model.User.findOne({username});

    assert(!!user, 422, "用户不存在");
    user.password = decrypt(user.password);
    assert(user.password === password, 422, "用户不存在");


    let token = getToken({username, id: user._id, privateKey });

    let articles = await req.Model.Article.aggregate([
      {
        $match: {
          author: user._id
        }
      },
      {
        $group: {
          _id: null,
          articleNum: { $sum: 1 },
          readerNum: { $sum: "$clickNums" }
        }
      }
    ]);

    let  {password:_, ...userInfo} = JSON.parse(JSON.stringify(user));
    const articleNum = articles?.[0]?.articleNum;
    const readerNum = articles?.[0]?.readerNum;
    articleNum && (userInfo.articleNum = articleNum);
    readerNum && (userInfo.readerNum = readerNum);

    const sse = req.app.locals.SSE;

    res.json({
      code: 200,
        data: {
          userId: user._id,
          token,
          ...userInfo
        },
      timestamp: Date.now()
    });
  } catch (err) {
    console.log(err, '错误原因');
    next(createError(422, "登录错误"));
  }
});

router.post("/registry", async (req, res, next) => {
  let {username, password, email} = req.body;

  try {    
    let decrypt = req.app.locals.globalFns["decrypt"];
    let encrypt = req.app.locals.globalFns["encrypt"];
    password = decrypt(password);
    if (!username || username.trim().length === 0 || !password || password.trim().length === 0) {
    next(createError(422, "账号或密码必填"));
    return false;
  }
    const user = await req.Model.User.create({
      username,
      password: encrypt(password),
      email
    });

    let privateKey = req.app.locals.privateKey;
    let token = getToken({username, id: user._id, privateKey});
    let articles = await req.Model.Article.aggregate([
      {
        $match: {
          author: user._id
        }
      },
      {
        $group: {
          _id: null,
          articleNum: { $sum: 1 },
          readerNum: { $sum: "$clickNums" }
        }
      }
    ]);
    let  {password:_, ...userInfo} = JSON.parse(JSON.stringify(user));
    const articleNum = articles?.[0]?.articleNum;
    const readerNum = articles?.[0]?.readerNum;
    articleNum && (userInfo.articleNum = articleNum);
    readerNum && (userInfo.readerNum = readerNum);
    res.json({
      code: 200,
      data: {
          userId: user._id,
          token,
          ...userInfo  
      },
      timestamp: Date.now()
    });

  } catch (err) {
    let errors = "注册错误";
    if (err instanceof mongoose.Error.ValidationError) {
      errors = Object.entries(err.errors).reduce((acc, [key, value]) => {
        acc[key] = value.message;
        return acc;
      }, {});
    }
    console.log(err, '错误原因');
    next(createError(err.status || 422, JSON.stringify(errors)));
  }
});

router.get("/",async (req, res) => {
  
  const { detail } = req.query;

  console.log(detail, "detail");
  if (!detail) {
    res.json({
      code: 200,
      data: req.users,
      timestamp: Date.now()
    });
    return false;
  }


  let articles = await req.Model.Article.aggregate([
    {
      $match: {
        author: req.users._id
      }
    },
    {
      $group: {
        _id: null,
        articleNum: {$sum: 1},
        readerNum: {$sum: "$clickNums"}
      }
    }
  ]);

  const users = JSON.parse(JSON.stringify(req.users));
  res.json({
    code: 200,
    data: {...users, articleNum: articles[0].articleNum, readNum:articles[0].readerNum},
    timestamp: Date.now()
  })


});



router.put("/", async (req, res) => {
  const { nickname, signature, avatar, email, description} = req.body;
  
  const update = {};
  nickname && (update.nickname = nickname);
  signature && (update.signature = signature);
  avatar && (update.avatar = avatar);
  email && (update.email = email);
  description && (update.description = description);
  const _id = req.users._id;

  if (Object.keys(update).length === 0) {
    return false;
  }

  try {
    const ans = await req.Model.User.findByIdAndUpdate(_id, update, {new: true});

    res.json({
      code: 200,
      data: ans,
      timestamp: Date.now()
    });
  } catch (err) {
    createError(404, "更新失败");
  }
});


module.exports = {
  userRouter: router
};