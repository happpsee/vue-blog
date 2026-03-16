/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-02 18:21:31
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-15 15:25:19
 * @FilePath: \blog\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import {router} from '@/router/index.js';
import { createPinia } from 'pinia';
import { createSetupAxios } from '@/apis/index.js';
import { setupElement } from '@/plugins/element';
import App from './App.vue'
import 'element-plus/dist/index.css'
import '@/styles/element.css';
import '@/styles/tailwind.css';
import '@/styles/base.css';
import "animate.css";
import { useApi } from '@/apis/index.js';
import store from 'store';



const app = createApp(App)



const pinia = createPinia();


app.use(setupElement);
app.use(pinia);
app.use(router);

app.use(createSetupAxios, {
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: import.meta.env.VITE_TIMEOUT
});



//合并接口

store.get(import.meta.env.VITE_PUBLICK_KEY) || useApi("publicKey")
  .then((ans) => {
    // let publickKey = ans.publicKey.replace(/[\r\n]/g, '');
    console.log(ans, 'publicKey是');
    store.set(import.meta.env.VITE_PUBLICK_KEY, ans.publicKey);
  });

app.mount('#app');