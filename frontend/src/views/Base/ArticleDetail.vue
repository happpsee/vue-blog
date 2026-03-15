<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-13 17:51:04
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-14 14:18:21
 * @FilePath: \blog\frontend\src\views\Base\ArticleDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
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

  <div class="comment">
      <textarea class="comment-submit" @keyup.enter="uploadComment" resize="none" v-model="inputComment" placeholder="输入评论发送" />
      <div class="comment-list mt-10">
        <h1 class="mb-10 text-2xl">评论列表</h1>
        <div class="comment-item flex items-center gap-x-4 mb-5" v-for="item in comments">
          <el-avatar :src="item.avatar"></el-avatar>
          <el-text>{{ item?.content }}</el-text>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import {useRoute} from 'vue-router';
import {onBeforeMount, inject, ref, computed} from 'vue';
import "github-markdown-css/github-markdown-light.css"
import {ElNotification} from 'element-plus'
import { useLoginStore } from '@/stores/modules/login';
defineOptions({
  name: "ArticeDetail"
});

const {useApi} = inject('api');
const article = ref(null);
const inputComment = ref(null);
const userInfo = useLoginStore();
const comments = computed(() => {
  return article?.value?.comments ?? [];
});
const uploadComment = async () =>{
  try {
    const ans = await useApi('pubComment', {
      'content': inputComment.value,
      'aid': article.value.id,
      'fieldIds': {
        'aid': article.value.id
      }
    });
    article.value.comments.unshift({...ans, avatar: userInfo.userInfo.avatar});
    console.log(article.value.comments);
    ElNotification.success({
      title: '成功!',
      duration: 2000,
      showClose: false,
      message: '评论添加成功'
    });
  } catch (err) {
    ElNotification.error({
      title: '输入错误!',
      duration: 2000,
      showClose: false,
      message: '请检查输入内容是否有误'
    });

    console.log(err, 'error');
  }
  inputComment.value = null;
};

onBeforeMount(async () => {
  const route = useRoute();

  const ans = await useApi("articleDetail", {
    id: route.params.id
  });
  console.log(ans, 'ans');
  article.value = ans;
});

</script>

<style lang="stylus" scoped>
@import "styles/variable.styl";
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
  width 100%
  field-sizing content
  max-height 300px
  resize: none
  padding 15px
  border 1px solid rgb(235, 236, 237)
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

</style>