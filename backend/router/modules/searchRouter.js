/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-21 14:39:37
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-02-06 00:24:44
 * @FilePath: \徐晨冰_Node_20250120\第五十天\express-login\router\modules\searchRouter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const express = require("express");

const router = express.Router();
const createError = require("http-errors");
const { Article } = require("../../models");
const P = require("mongoose-sex-page");

router.get("/", async (req, res, next) => {
  let {search = "", size = 20, page = 1, display = 5} = req.query;
  let regExp = new RegExp(search, "gi");
  console.log(regExp);
  try {
    const result = await P(Article)
    .find({     
      $or: [
          {title: {$regex: regExp}},
          {content: {$regex: regExp}}
      ]
    })
    .size(size)
    .page(page)
    .display(display)
    .exec();

    console.log(result, "result");
    res.json({
      code: 200, 
      data: result,
      timestamp: Date.now()
    });

  } catch (err) {
    next(createError(err.status || 400, err.message || "查询错误"));
  }
});

module.exports = {
  searchRouter: router
}