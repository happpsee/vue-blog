/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-03 13:17:36
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-09 11:28:20
 * @FilePath: \徐晨冰_Vue_20260302\第二十一天\blog\src\stores\modules\login.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia";
import store from "store";
export const useLoginStore = defineStore('login', {
  state:() =>  ({
    isLogin: !!store.get(import.meta.env.VITE_TOKEN_KEY),
    userInfo: store.get(import.meta.env.VITE_USER_INFO)
  }),
  actions: {
    login(userInfo) {
      this.isLogin = true;
      console.log(this.isLogin, 'thios.isLogin');
      this.setUserInfo(userInfo);
      //登录成功后
    },
    logout() {
      this.isLogin = false;
      this.setUserInfo(null);
      store.set(import.meta.env.VITE_TOKEN_KEY, null);
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      store.set(import.meta.env.VITE_USER_INFO, userInfo);
    }
  }
});