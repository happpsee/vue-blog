/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-04 20:43:15
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-04 20:43:25
 * @FilePath: \徐晨冰_Vue_20260302\第二十一天\blog\src\apis\modules\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  "getUserInfo": {
    url: "/user",
    method: "GET",
    withToken: true
  },
  "changeUserInfo": {
    url: "/user",
    method: "PUT",
    withToken: true
  },
  "uploadUser": {
    url: "/upload/user",
    method: "POST",
    withToken: true
  },
  "user": {
    withToken: true,
    url: "/",
    method: "POST"
  }
}