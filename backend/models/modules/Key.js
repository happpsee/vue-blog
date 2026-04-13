/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-18 15:14:18
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-01-18 15:16:16
 * @FilePath: \徐晨冰_Node_20260118\第四十八天\express-login\models\Key.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const mongoose = require("mongoose");

module.exports = {
  name: mongoose.SchemaTypes.String,
  content: {
    type: String,
    required: [true, "必须填写Key内容"]
  },
  data: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now
  }
};
