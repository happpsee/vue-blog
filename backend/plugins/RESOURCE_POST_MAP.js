/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-26 17:31:00
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-02-02 18:01:41
 * @FilePath: \徐晨冰_Node_20260124\第五十二天\express-login\plugins\RESOURCE_POST_MAP.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%
 */

module.exports = {

  "Comment": {
    "body": (req) => {
      console.log(req.users, "req是什么");
      return {
        ...req.body,
        uid: req.users._id
      }
    }
  }
}