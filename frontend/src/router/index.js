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
import { ElNotification } from "element-plus";
import { useLoginStore } from '@/stores/modules/login';
import { _isMobile } from '@/utils/index';




const originRoutes = Object.groupBy(Object.values(import.meta.glob(['./modules/*.js', '!./modules/login.js'], {
  eager: true
})).reduce((acc, module) => {
  let item = module.default;
  if (Array.isArray(item)) {
    acc.push(...item);
  } else {
    acc.push(item);
  }

  return acc;
}, []), (item) => {
  if (!item.__tag) {
    item.__tag = "pc"; //默认优先pc
  }
  return item.__tag;
});

let routes;
if (!_isMobile()) {
  routes = originRoutes.pc;
} else {
  routes = originRoutes.mobile;
}



console.log("看看routes", routes);
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


router.beforeEach((to, from) => {
  if (to.meta.needAuth) {
    const loginStore = useLoginStore();
    if (!loginStore.isLogin) {
      ElNotification({
        message: "请先登录",
        type: "info",
        duration: 2000,
        showClose: false
      });
      return { name: "article"};
    }
  }
  nProgress.start();

  return true;
});

router.afterEach(() => {
  nProgress.done();
});