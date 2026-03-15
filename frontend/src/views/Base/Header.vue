<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-02 19:01:48
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-12 11:49:44
 * @FilePath: \blog\frontend\src\views\Header\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="head-container">
  <el-row tag="header" class="head"  align="middle" justify="center">
    <el-row class="head-inner" justify="center" align="middle">
    <el-col :span="2">
      <h2>
        <img class="logo" src="/logo.svg" alt="logo">
      </h2>
    </el-col>

    <el-col :span="8" :push="1">
      <el-input v-model="input"></el-input>
    </el-col>

    <el-col :span="8">
      <el-row  align="middle" justify="end" class="nav">
        <router-link v-for="nav in navs"  :to="nav.path" class="m-5 text-black flex items-center gap-x-1" >
          <!-- <el-icon>
            <component :is=""></component>

          </el-icon> -->
          <span>{{ nav.text }}</span>
        </router-link>
          
        <template v-if="!hasLogin">
          <span class="pr-2 text-black cursor-pointer border-r-2 border-gray-400"
            @click="activateForm('login')">登录</span>
          <span class="pl-2 text-black cursor-pointer" @click="activateForm('registry')">注册</span>
        </template>
      </el-row>
    
    </el-col>
        </el-row>
  </el-row>
    </div>
</template>


<script setup>
import {ref, computed} from 'vue';
import {useLoginStore} from '@/stores/modules/login.js';
import { House } from '@element-plus/icons-vue';
import { ElCol, ElRow } from 'element-plus';
const input = ref('');
const loginStore = useLoginStore();


const navs = ref([
  {text: '首页', path: '/', icon: House},
  {text: '分类', path: '/classfy',  },
  {text: '文章', path: 'article'},
]);


const hasLogin = computed(() => {
  return loginStore.login
});

const activateForm = (type) => {

  loginStore.changeShow(true, type);

};



defineOptions({
  name: 'BaseHeader'
})
</script>


<style lang="stylus" scoped>
@import "styles/variable.styl"

.head-container
  width 100%
  height 70px


.head
  position absolute
  left 0
  width 100vw
  height 80px
  bgColorCommon()
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
.head-inner
  width 1400px


.router-link-exact-active
  color blue !important

.logo
  width 70px
  height 70px
</style>