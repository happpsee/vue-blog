<template>
  <div class="head-container">
    <el-row tag="header" class="head" align="middle" justify="center">
      <el-row class="head-inner" justify="center" align="middle">
        <el-col :span="2">
          <h2 class="logo-container">
            <img class="logo" src="/logo.svg" alt="logo" />
          </h2>
        </el-col>

        <el-col :span="8" :push="1">
          <el-input v-model="input" @keyup.enter="searchArticle" placeholder="搜索文章" class="search-input"></el-input>
        </el-col>

        <el-col :span="12" :push="1">
          <el-row align="middle" justify="end" class="nav">
            <router-link v-for="nav in navs" :key="nav.path" :to="nav.path" class="nav-link"><span>{{ nav.text
                }}</span></router-link>

            <template v-if="!loginStore.isLogin">
              <span class="auth-link login-link" @click="activateForm('login')">登录</span>
              <span class="auth-link register-link" @click="activateForm('registry')">注册</span>
              <Teleport to="body">
                <KeepAlive>
                  <Login 
                  v-model:show="show" 
                  v-model:type="loginType" />
                </KeepAlive>
              </Teleport>
            </template>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useLoginStore } from '@/stores/modules/login.js';
import { ElCol, ElRow } from 'element-plus';
import { useArticleStore } from "@/stores/modules/article";
import { ElNotification } from 'element-plus';
import Login from "@/views/Login/index.vue";

defineOptions({
  name: 'BaseHeader'
})

const input = ref('');
const loginStore = useLoginStore();
const articleStore = useArticleStore();
const loginType = ref(null);
const show = ref(false);
const navs = ref([
  { text: '首页', path: '/' },
  { text: '分类', path: '/classify' },
  { text: '写文章', path: '/write' },
  { text: '用户信息', path: '/userinfo' }
]);


let oldSearchContent = "";
const searchArticle = async () => {
  if (oldSearchContent === input.value) {
    ElNotification.info({
      title: "提示",
      message: "请输入不同的搜索内容"
    });
    return;
  }
  console.log("发请求了");

  oldSearchContent = input.value;
  await articleStore.getArticels({ search: input.value }, {
    reset: true,
    search: true
  });
};




const activateForm = (type) => {
  console.log(type, 'loginType.value');
  loginType.value = type;
  show.value = true;
};




</script>


<style lang="stylus" scoped>
@import "styles/variable.styl"

.head-container
  width 100%
  height 80px

.head
  position fixed
  top 0
  left 0
  width 100vw
  height 80px
  background-color #FFFFFF
  box-shadow shadow_md
  z-index 1000
  transition transition_default

.head-inner
  width 1200px
  height 100%

.logo-container
  margin 0
  padding 0

.logo
  width 60px
  height 60px
  transition transition_default
  &:hover
    transform scale(1.05)

.search-input
  width 100%
  max-width 400px
  .el-input__wrapper
    border-radius border_radius_md
    transition transition_default
    &:hover
      box-shadow 0 0 0 2px rgba(37, 99, 235, 0.1)

.nav
  display flex
  align-items center
  gap spacing_lg

.nav-link
  color text_color
  transition transition_default
  padding spacing_sm spacing_md
  border-radius border_radius_sm
  &:hover
    color cta_color
    background-color rgba(37, 99, 235, 0.05)
  &.router-link-exact-active
    color cta_color

.auth-link
  padding spacing_sm spacing_md
  border-radius border_radius_sm
  transition transition_default
  cursor pointer
  &:hover
    background-color rgba(0, 0, 0, 0.05)

.login-link
  margin-right spacing_sm

.register-link
  &:hover
    background-color rgba(37, 99, 235, 0.05)

@media (max-width: 768px)
  .head-inner
    width 100%
    padding 0 spacing_sm
  
  .nav
    gap spacing_md
  
  .nav-link
    padding spacing_xs spacing_sm
  
  .auth-link
    padding spacing_xs spacing_sm
</style>
