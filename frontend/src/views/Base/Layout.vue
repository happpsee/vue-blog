<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-02 18:34:41
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-11 13:20:47
 * @FilePath: \blog\frontend\src\views\Layout\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-02 17:42:44
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-09 11:41:58
 * @FilePath: \vue-blog\src\views\Home\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-container class="layout" direction="vertical">
        <Header/>
        
        <el-row class="mt-14">
          <el-col :span="7">
            <BaseAside />
          </el-col>
          <el-col :push="1" :span="16">
             <Main />
          </el-col>
        </el-row>
       
        
        <template v-if="!loginStore.login">
          <Teleport  to="body">
            <KeepAlive>
              <Login />
            </KeepAlive>
          
        </Teleport>
        </template>   
    </el-container>

    
</template>


<script setup>
import { useLoginStore } from '@/stores/modules/login.js';
import Header from '@/views/Base/Header.vue';
import Main from '@/views/Base/Main.vue';
import BaseAside from '@/views/Base/Aside.vue';
import Login from '@/views/Login/index.vue';

defineOptions({
  name: "BaseLayout"
});

const loginStore = useLoginStore();



</script>


<style scoped lang="stylus">

.layout
  width 1200px;
  margin: 0 auto;
</style>