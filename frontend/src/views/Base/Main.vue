<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-03 12:07:02
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-15 17:22:47
 * @FilePath: \blog\frontend\src\views\Main\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
      <router-view></router-view>
</template>


<script setup>
import { useLoginStore } from "@/stores/modules/login"
import {watch} from "vue";
import store from "store";
defineOptions({
  name: 'BaseMain'
})


const loginStore = useLoginStore();



watch(() => loginStore.isLogin, (newVal) => {

  if (newVal) {
  const token = store.get(import.meta.env.VITE_TOKEN_KEY)
  const eventSource = new EventSource(`${import.meta.env.VITE_BASE_URL}/loginSSE?token=${token}`);
  eventSource.onmessage = (event) => {
    console.log(event, "Event");
    if (event.data === "logout") {
      loginStore.logout();
      ElNotification.warning({
        title: "提示",
        message: "当前账号在别处登录!您已被强制下线",
      });
      eventSource.close();
    }
  }
  }
}, {immediate: true});

</script>