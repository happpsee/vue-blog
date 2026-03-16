<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-14 14:25:56
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-15 16:52:37
 * @FilePath: \blog\frontend\src\views\Article\Detail\ArticleDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="des-wrap">
  <el-scrollbar class="article-des">
    <h1 class="text-4xl mb-8">{{ article?.title }}</h1>

    <div class="article-about text-xs flex items-center mb-10">
      <span class=" author-name mr-4">{{ article?.author?.nickname }}</span>
      <span class="text-common flex items-center gap-x-3">
        <span >{{ article?.date }}</span>
        <span class="flex items-center">
          <el-icon custom="watch.svg"></el-icon>
          <span class="ml-1">{{ article?.clickNums }}</span>
        </span>
        <span class="flex items-center">
          <el-icon custom="like_hollow.svg" :width="'18px'" :height="'18px'"></el-icon>
          <span class="ml-1">{{ article?.likeNums }}</span>
        </span>
      </span>
    </div>

      <article class="content markdown-body" data-theme="light" style="width: 100%;" v-html="article?.content"></article>

    <div>
        <div class="comment-list mt-10">
          <h1 class="mb-10 text-2xl">评论列表</h1>
          <div class="comment-item flex items-center gap-x-4 mb-5" v-for="item in comments">
            <el-avatar :src="item.avatar"></el-avatar>
            <el-text>{{ item?.content }}</el-text>
          </div>
        </div>
    </div>

    <transition appear enter-active-class="animate__animated animate__fadeInUpBig"
        leave-active-class="animate__animated animate__fadeOutDown">
        <textarea v-if="isComment" class="comment-submit comment fixed bottom-0" @keyup.enter="uploadComment"
          resize="none" v-model="inputComment" placeholder="输入评论发送" />
      </transition>

  </el-scrollbar>


  <div class="flex flex-col  items-center gap-y-4 circle-tool absolute top-2 -right-10">
    <el-button v-for="(value, key) in tools" class="tool-item" circle  :icon="value.icon" @click="toolAgency(key)"></el-button>
  </div>

  </div>
</template>

<script setup>
import {useRoute} from 'vue-router';
import {onBeforeMount, ref, inject} from 'vue';
import "github-markdown-css/github-markdown-light.css"
import { useTool } from './compsables/useTool';
import { useComment } from './compsables/useComment';

defineOptions({
  name: "ArticeDetail"
});

const { useApi } = inject("api");
const article = ref(null);

const { isComment, tools, toolAgency } = useTool();
const { inputComment, comments, uploadComment} = useComment(article);


onBeforeMount(async () => {
  const route = useRoute();

  const ans = await useApi("articleDetail", {
    id: route.params.id
  });
  article.value = ans;
});


</script>

<style lang="stylus" scoped>
@import "styles/variable.styl";
.des-wrap
  position relative
  height 755px
  transform: translate(0)
.article-des
  bgColorCommon()
  padding 40px 25px
  height 755px

.author-name
  color #515767
.text-common
  color #8a919f

.content :deep(code)
  display block
  max-height 300px
  white-space pre-wrap
  margin 10px 0

.comment-submit
  width calc(100% - 50px);
  field-sizing content
  max-height 300px
  resize: none
  padding 15px
  border 1px solid rgb(235, 236, 237)
  border-radius 8px
  background-color: #e5e5e5;
  color text-color
  &:focus
    outline none

.comment-list
  padding 15px
  border 1px solid rgb(235, 236, 237)
  background #f8fafc  linear-gradient(#f8fafc, #ececec85);
.comment-item
  padding 10px
  background-color #ffffff


.tool-item
  margin-left 0 !important
  &:hover
    border 1px solid #ececec
    background-color oklch(92.9% 0.013 255.508)

</style>