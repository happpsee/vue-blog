/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-02 17:42:56
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-13 17:57:42
 * @FilePath: \vue-blog\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import nProgress from 'nprogress';
import { createWebHashHistory } from 'vue-router';
import { createRouter } from 'vue-router';


const modules = import.meta.glob(['./modules/*.js', '!./modules/login.js'], {
  eager: true
});

let routes = Object.values(modules).map(module => module.default);

console.log(routes, 'routes');

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(() => {
  nProgress.start();
});

router.afterEach(() => {
  nProgress.done();
});