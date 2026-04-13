/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-25 19:49:25
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-07 17:45:49
 * @FilePath: \徐晨冰_Node_20260124\第五十二天\express-login\router\modules\pubKeyRouter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const express = require("express");
const createError = require("http-errors");
const router = express.Router();


router.get("/", async (req, res, next) => {
  try {
    res.json({
      code: 200,
      data: {
        publicKey: req.app.locals.publicKey
      },
      timestamp: Date.now()
    });
  } catch (err) {
    next(createError(404, "没有改资源"));
  }
});


module.exports = {
  pubKeyRouter:router
}