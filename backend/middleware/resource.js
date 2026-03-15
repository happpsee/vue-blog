/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-13 21:15:00
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-14 12:56:21
 * @FilePath: \徐晨冰_Node_20260113\第四十六天\express-login\middleware\resource.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const getModule = (moduleStr) => {
  moduleStr = moduleStr[0].toUpperCase() + moduleStr.slice(1);
  moduleStr = moduleStr.slice(0, moduleStr.length - 1);
  return require(`../models/index`)[moduleStr];
};


const resourceMiddleware = () => {
  return async (req, res, next) => {
    console.log("guaiq", getModule(req.params.resource));
    req.Model = getModule(req.params.resource);
    next();
  };
};

module.exports = resourceMiddleware;