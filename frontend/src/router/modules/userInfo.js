/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-09 20:44:14
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-15 17:25:29
 * @FilePath: \blog\frontend\src\router\modules\layout.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export default {
  path: "/userinfo",
  name: "userinfo",
  component: () => import("@/views/UserInfo/index.vue"),
  meta: {
    needAuth: true,
  },
  __tag: "pc",
}