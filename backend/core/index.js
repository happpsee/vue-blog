/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2025-12-16 14:28:53
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-13 13:28:23
 * @FilePath: \express-login\auth\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const mongoPage = require("mongoose-sex-page");
const jwt = require("jsonwebtoken");



const openFieldMap = {
  "Article": "title cover clickNums commentNums likeNums date summary",
  "User": "",
  "Column": "name date aids _id"
};

//使用完pagination,完成查询
const pagination = async ({ model, query: selectoQuery = {}} = {}) => {
  let selectField = openFieldMap[model.modelName];
  let { curPages = 1, size = 20,...query} = selectoQuery;
  let { records: data, total, display } = await mongoPage(model).find(query).select(selectField).page(curPages).size(size).exec();
  return {curPages, data, total, display};
}

const getToken = ({username, id, privateKey}) => {
  return jwt.sign({username, id, exp: Math.floor(Date.now() / 1000) + 24 * 3600 * 3}, privateKey, {algorithm: "RS256"});
}

module.exports = {
  pagination,
  getToken
}