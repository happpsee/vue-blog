/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-04 20:42:17
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-04 20:42:27
 * @FilePath: \徐晨冰_Vue_20260302\第二十一天\blog\src\apis\modules\column.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  "column": {
    url: "/api/columns",
    method: "GET",
    withToken: true
  },
  "addColumn": {
    url: "/api/columns",
    method: "POST",
    withToken: true
  },
}