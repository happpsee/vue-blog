/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-16 18:22:50
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-10 15:31:49
 * @FilePath: \徐晨冰_Nde_20260116\第四十七天\express-login\router\modules\loginRouter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-16 18:22:50
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-01-16 19:36:08
 * @FilePath: \徐晨冰_Nde_20260116\第四十七天\express-login\router\modules\loginRouter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require("express");
const router = express.Router();

const createError = require("http-errors");
const { User, Article } = require("../../models");
const assert = require("http-assert");
const { getToken, decrypt } = require("../../core/index");

router.post("/", async (req, res, next) => {
  let {username, password} = req.body;



  try {
    password = password.replace(/\. +/g, '');;
    password = decrypt(password);
    if (!username || username.length === 0 || !password || password.length === 0) {
      createError(422, "必需填写账号或密码");
      return false;
    }

    let user = await User.findOne({username});
    console.log(user, 'user');

    if (!user) {
          assert(false, 422, "用户不存在");
    }

    console.log(user.password, password,'user.password-paasssword');
    assert(user.password === password, 422, "用户不存在");
    let token = getToken({username, id: user._id});


    let articles = await Article.aggregate([
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
    console.log(err, '错误原因');
    next(createError(422, "登录错误"));
  }

}); 

module.exports = {
  loginRouter: router
}