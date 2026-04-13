<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-09 20:49:43
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-13 18:34:52
 * @FilePath: \blog\frontend\src\views\Base\ArticleItem.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <router-link :to="{
    name: 'articleDetail',
    params:{
      id:article.id
    } }">
  <el-card
  class="mb-8 cursor-pointer"
  shadow="never">
    <template #header>
      <el-text :truncated="true" class="w-160">
        <span class="text-2xl">{{ article.title }}</span>
      </el-text>
    </template>
    <template #default>
          <el-text :line-clamp="2">
            <span class="pl-4 text-base article-text">
              {{ article.summary ?? "这里是简述"}}
            </span></el-text>
    </template>

    <template #footer>
      <div class="flex gap-x-4 text-xs tag-color">
        <div class="flex gap-x-2 items-center">
          <span class="flex items-cente gap-x-2">
            <span>点赞</span><span>({{ article.likeNums }})</span></span>
          <el-icon custom="like.svg" width="18px" height="18px"></el-icon>
        </div>
        <div class="flex gap-x-2 items-center">
          <span class="flex items-cente gap-x-2">
            <span>评论</span>
          <span>({{ article.commentNums }})</span>
        </span>

          <el-icon custom="comment.svg" width="22px" height="22px"></el-icon>
        </div>
        <div class="flex  gap-x-2 items-center">
          <span class="flex flex-row items-center gap-x-2">
            <span>发布时间</span>
            <span>({{ article.date }})</span>
          </span>
          <el-icon custom="date.svg" >

          </el-icon>
        </div>
      </div>

    </template>
  </el-card>
    </router-link>
</template>


<script setup>
defineOptions({
  name: 'ArticleItem'
});

const {article} = defineProps({
  article: {
    type: Object,
    default: {}
  }
});

console.log(article, 'article');
</script>

<style lang="stylus" scoped>
@import "styles/variable.styl";

.el-card
  bgColorCommon()
  margin: 0;
  border-bottom 1px solid #e4e7ed
  border-radius 0

.el-card :deep(.el-card__header)
  bgColorCommon()
  text-align start

.el-card :deep(.el-card__body)
  bgColorCommon()

.el-card :deep(.el-card__footer)
  bgColorCommon()
  border-radius 0px 0px 8px 8px

.el-text
  color text-color_stronger


.article-text
  color text-slight

.tag-color
   color #8491a5

</style>