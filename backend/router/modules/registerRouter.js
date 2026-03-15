/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-16 18:22:50
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-07 18:40:42
 * @FilePath: \徐晨冰_Nde_20260116\第四十七天\express-login\router\modules\registerRouter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * 
 */
const express = require("express");

const User = require("../../models/modules/User");
const router = express.Router();
const { getToken, encrypt, decrypt } = require("../../core/index");
const createError = require("http-errors");
const mongoose = require("mongoose");

router.post("/", async (req, res, next) => {
  let {username, password, email} = req.body;



  try {
    password = decrypt(password);
    if (!username || username.trim().length === 0 || !password || password.trim().length === 0) {
    next(createError(422, "账号或密码必填"));
    return false;
  }
    const user = await User.create({
      username,
      password,
      email
    });

    let token = getToken({username, id: user._id});

    console.log(user, "是不是创建成功了");
    res.json({
      code: 200,
      data: {
          userId: user._id,
          token  
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
    next(createError(err.status || 422, JSON.stringify(errors)));
  }
});

module.exports = {
  registerRouter: router
}