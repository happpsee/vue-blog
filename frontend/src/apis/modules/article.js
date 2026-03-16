/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-04 20:41:26
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-13 18:56:39
 * @FilePath: \徐晨冰_Vue_20260302\第二十一天\blog\src\apis\modules\article.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  "articles": {
    url: "/api/articles",
    method: "GET"
  },
  "articleAdd": {
    url: "/api/articles",
    method: "POST",
    withToken: true
  },
  "uploadArticleCover": {
    url: "/upload/article",
    method: "POST",
    withToken: true
  },
  "pubComment": {
    url: "/api/comments",
    method: "POST",
    withToken: true
  },
  "articleSearch": {
    url: "/articles/search",
    method: "GET"
  },
  "articleDetail": {
    url: "/api/articles/id",
    method: "GET",
    dynamic: true
  }
}