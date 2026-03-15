/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-20 17:03:00
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-01-20 17:13:02
 * @FilePath: \徐晨冰_Node_20250120\第五十天\express-login\router\modules\artLikes.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE{}
 */


const express = require("express");
const router  = express.Router();
const { Article } = require("../../models/index");
const assert = require("http-assert");
const createError = require("http-errors");

//文章点赞
router.get("/:id", async (req, res, next) => {
  let id = req.params.id;

  try {
    assert(id, "缺少参数id");

    let data = await Article.findByIdAndUpdate(id, {
      $inc: {
        likeNums: 1
       }
      }, {new: true});
    res.json({
      code: 200,
      data,
      timestamp: Date.now()
    });
  } catch (err) {
    next(createError(422, err.message || "点赞错误"));
  }

});

module.exports = { artLikeRouter: router};