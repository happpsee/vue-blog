/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-28 14:57:34
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-01-28 16:27:17
 * @FilePath: \第五十三天\express-login\utils\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require("path");

module.exports = {
  "host": "http:127.0.0.1:8080/",
  "staticPath": path.join(__dirname, "../static"),
  "userDataPath": path.join(__dirname, "../database/user.json"),
  "maxFileSize": 1024000
}; 