/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-20 15:59:14
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-02-06 17:25:54
 * @FilePath: \徐晨冰_Node_20250120\第五十天\express-login\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const {loginRouter} = require("./modules/loginRouter");
const { registerRouter} = require("./modules/registerRouter");
const { busRouter } = require("./modules/busRouter");
const {pubKeyRouter} = require("./modules/pubKeyRouter");
const {uploadRouter} = require("./modules/uploadRouter");
const {artLikeRouter} = require("./modules/artLikesRouter");
const {searchRouter} = require("./modules/searchRouter");
const {userRouter} = require("./modules/userRouter");
module.exports = {
  loginRouter,
  registerRouter,
  busRouter,
  pubKeyRouter,
  uploadRouter,
  artLikeRouter,
  searchRouter,
  userRouter
}