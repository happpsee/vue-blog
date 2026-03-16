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
import { useLoginStore } from '@/stores/modules/login';

const loginStore = useLoginStore();

const open = () => {
   loginStore.open();
}

defineOptions({
  name: 'BaseMain'
})


</script>