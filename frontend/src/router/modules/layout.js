/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-09 20:44:14
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-15 17:25:29
 * @FilePath: \blog\frontend\src\router\modules\layout.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Article from '@/views/Article/Article.vue'
import ArticleDetail from '@/views/Article/Detail/ArticleDetail.vue';
import ArticleEditor from '@/views/Editor/Editor.vue';
import Classify from '@/views/Classify/index.vue';
import UserInfo from '@/views/UserInfo/index.vue';

export default {
    path: '/',
    name: 'home',
    children: [
      {
      path: "/",
      component: Article
      },
      {
        path: "articleDetail/:id",
        name: "articleDetail",
        component: ArticleDetail,
      },
      {
        path: "/write",
        name: "editor",
        component: ArticleEditor,
      },
      {
        path: "/classify",
        name: "classify",
        component: Classify,
      },
      {
        path: "/userinfo",
        name: "userinfo",
        component: UserInfo,
      }
    ]
}