/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-20 15:59:12
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-01-21 13:17:18
 * @FilePath: \徐晨冰_Node_20250120\第五十天\express-login\models\modules\Comment.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const mongoose = require("mongoose");

module.exports = {
  content: {
    type: mongoose.SchemaTypes.String,
    required: [true, "必须填写评论内容"]
  },
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now
  },
  likeNums: {
    type: mongoose.SchemaTypes.Number,
    default: 0
  },
  aid: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Article"
  },
  uid: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  }
};