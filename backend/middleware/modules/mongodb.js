/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-14 19:28:06
 * @LastEditors: userName userEmail
 * @LastEditTime: 2026-04-27 12:26:41
 * @FilePath: \徐晨冰_Node_20260113\第四十六天\express-login\plugins\mongodb.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const mongoose = require("mongoose");

const setupMongoose = async () => {
  await mongoose.connect("mongodb://localhost:27017/blog", {
    user: 'admin',
    pass: '123456',
    authSource: 'admin'
  });

  let db = mongoose.connection;
  db.on("open", () => {
    console.log("mongodb://127.0.0.1:27017/bdb_blog 连接成功");
  });
};




module.exports = {
  setupMongoose
};