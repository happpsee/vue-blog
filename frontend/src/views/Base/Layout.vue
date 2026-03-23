<template>
    <el-container class="layout" direction="vertical">
        <Header/>
        
        <el-row class="content-wrapper">
          <el-col :span="7">
            <BaseAside />
          </el-col>
          <el-col :push="1" :span="16">
             <Main />
          </el-col>
        </el-row>
       
      
    </el-container>

    
</template>


<script setup>
import Header from '@/views/Base/Header.vue';
import Main from '@/views/Base/Main.vue';
import BaseAside from '@/views/Base/Aside.vue';

defineOptions({
  name: "BaseLayout"
});




</script>


<style scoped lang="stylus">
@import "styles/variable.styl"

.layout
  width 1200px
  margin 0 auto
  min-height 100vh
  padding 0 spacing_md

.content-wrapper
  margin-top spacing_2xl
  margin-bottom spacing_2xl
  display flex
  gap spacing_lg

@media (max-width: 768px)
  .layout
    width 100%
    padding 0 spacing_sm
  
  .content-wrapper
    flex-direction column
    margin-top spacing_xl
    margin-bottom spacing_xl
</style>
