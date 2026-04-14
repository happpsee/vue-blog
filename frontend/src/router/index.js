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
import { useLoginStore } from '@/stores/modules/login';
import { _isMobile } from '@/utils/index';
import "nprogress/nprogress.css";



  
export const messageAdapter = () => {
let message;
  const setMessage = (msgFn) => {
    if (!_isMobile()) {
      message = {
        open: () => {
          msgFn({
            message: "请先登录",
            type: "info",
            duration: 2000,
            showClose: true
          });
        }
      }
    } else {
      message =  {
        open: () => {
          msgFn("请先登录");
        }
      }
    }
  };
  const showMessage = () => {
    return message.open();
  };

  return {
    setMessage,
    showMessage
  }
}


export const setupRouter = async () => {
  let routes;
  if (!_isMobile()) {
    routes = (await import("./modules/pc.js")).default;
  } else {
    routes = (await import("./modules/mobile.js")).default;
  }

  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });

  const message = messageAdapter();
  router.beforeEach((to, from) => {
    if (to.meta.needAuth) {
      const loginStore = useLoginStore();
      if (!loginStore.isLogin && to.name !== "mLogin") {
        message.showMessage();
        return _isMobile() ? { name: "mLogin" } : { name: "article" };
      }
    }
    nProgress.start();

    return true;
  });

  router.afterEach(() => {
    nProgress.done();
  });

  return {router, messageAdapter: message };
};

