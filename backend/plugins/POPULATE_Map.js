/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-31 14:57:20
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-02-02 18:45:52
 * @FilePath: \徐晨冰_Node_20260131\第五十五天\express-login\plugins\POPULATE_Map.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { populate } = require("../models/modules/Key");

const POPULATE_MAP = {
  "Column": [],
  "Article": [
    {
      path: "author",
      select: "nickname avatar",
    },
    {
      path: "column",
      select: "name"
    },
    {
      path: "comments",
      select: "content date likeNums",
      populate: {
        path: "uid",
        select: "nickname avatar"
      }
    },
  ],
  "Comment": [
    {
      path: "uid",
      select: "nickname avatar",
    }

  ],
  "Column": [
    {
      path: "aids",
      select: "title cover date  clickNums commentNums likeNums author"
    }
  ]
}


module.exports = {
  POPULATE_MAP
};