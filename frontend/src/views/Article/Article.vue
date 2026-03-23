<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-09 16:20:00
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-13 17:34:43
 * @FilePath: \blog\frontend\src\views\Base\article.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <VirtualList  :data="articleStore.articles" :loading="articleStore.loading" :finished="articleStore.finished" @load-more="loadListMore">
    <template #default="{ item }">
      <ArticleItem :article="item"></ArticleItem>
    </template>

  </VirtualList>

</template>


<script setup>
import {  onMounted } from 'vue';
import ArticleItem from './ArticleItem.vue';
import VirtualList from '@/components/virtualList.vue';
import { useArticleStore } from '@/stores/modules/article';

defineOptions({
  name: 'BaseArticle'
});

const articleStore  = useArticleStore();


//用于给子组件做无限加载填充数据
const loadListMore = async () => {
  await articleStore.getArticels();
};

onMounted(async () => {
  await articleStore.getArticels();
  console.log("看看articles", articleStore  );
});

</script>


<style lang="stylus" scoped>

</style>