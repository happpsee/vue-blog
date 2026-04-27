/*
 * @Author: userName userEmail
 * @Date: 2026-04-26 21:08:32
 * @LastEditors: userName userEmail
 * @LastEditTime: 2026-04-27 20:00:14
 * @FilePath: \vue-blog\backend\middleware\modules\cors.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const cors = require("cors");


const setupCors = (app) => {
  app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT"]
  }))
}

module.exports = {
  setupCors
};