<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-09 16:20:00
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-13 17:34:43
 * @FilePath: \blog\frontend\src\views\Base\article.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <VirtualList  :data="articles" :loading="loading" :finished="finished" @load-more="loadListMore">
    <template #default="{ item }">
      <ArticleItem :article="item"></ArticleItem>
    </template>

  </VirtualList>

</template>


<script setup>
import {  onMounted,onActivated, inject, ref, getCurrentInstance } from 'vue';
import ArticleItem from './ArticleItem.vue';
import VirtualList from '@/components/virtualList.vue';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'BaseArticle'
});
onActivated(() => {
  console.log("诸法onActiveate");
});

const route = useRoute();


const {useApi} = inject('api');

const articles = ref([]);
const nextPage = ref(1);
const finished = ref(false);
const loading = ref(false);

//加载数据
const requestArticle = async () => {
  if (finished.value) {
    console.log("数据都被加载完了");
    return ;
  }
  loading.value = true;

  const data = {
    curPages: nextPage.value
  };

  route.query.columnId && (data.column = route.query.columnId);

  const ans = await useApi('articles', data);
  console.log('拿到新数据');

  articles.value = articles.value.concat(ans.data);
  let curPages = ans.display.findIndex((item) => {
    return item > nextPage.value;
  });
  if (curPages > -1) {
    //找到了
    nextPage.value = ans.display[curPages];
  } else {
    //表示所有的数据都被查找完毕了,通知子组件,数据加载完毕
    finished.value = true;
  }
  loading.value = false;

};

const loadListMore = async () => {
  console.log('loadmodre被触发了');
  await requestArticle();
  console.log('加载更多');
};

onMounted(async () => {
  await requestArticle();
});

</script>


<style lang="stylus" scoped>

</style>