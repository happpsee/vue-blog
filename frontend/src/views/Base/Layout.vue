<template>
    <el-container class="layout" direction="vertical">
        <Header/>

        <div class="content-wrapper">
            <BaseAside />
            <div class="main">
             <Main />
            </div>

        </div>
       
      
    </el-container>

    
</template>


<script setup>
import Header from '@/views/Base/Header.vue';
import Main from '@/views/Base/Main.vue';
import BaseAside from '@/views/Base/Aside.vue';
import '@/styles/element.css';
import '@/styles/tailwind.css';
import '@/styles/base.css';
import "animate.css";
import "nprogress/nprogress.css";
import { inject } from 'vue';

const {setMessage} = inject("messageAdapter");
setMessage(ElNotification);


defineOptions({
  name: "BaseLayout"
});




</script>


<style scoped lang="stylus">
@import "styles/variable.styl"

.layout
  width: 1200px;
  margin 0 auto
  min-height 100vh
  padding 0 spacing_md

@media only screen and (max-width: 1200px) {
  .layout {
    width: 100%;
  }
}

.main
  width 800px;

.content-wrapper
  margin-top spacing_2xl
  margin-bottom spacing_2xl
  display flex
  justify-content center
  column-gap spacing_xl

@media (max-width: 768px)
  .layout
    width 100%
    padding 0 spacing_sm
</style>
