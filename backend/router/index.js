/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-20 15:59:14
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-02-06 17:25:54
 * @FilePath: \徐晨冰_Node_20250120\第五十天\express-login\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const { routes } = require("./routes");
const getModule = (moduleStr) => {
  moduleStr = moduleStr[0].toUpperCase() + moduleStr.slice(1);
  moduleStr = moduleStr.slice(0, moduleStr.length - 1);
  return moduleStr;
};


const setupRouter = (app) => {
  for (let i = 0, route; route = routes[i]; i++) {
    app.use(route.path, (req, _, next) => {
      
      if (req.params.resource) {
        req.Model = req.app.locals.Model[getModule(req.params.resource)];
      } else {
        req.Model = req.app.locals.Model;
      }
      
      next();
    }, route.router);
  }
}



module.exports = {
  setupRouter
}