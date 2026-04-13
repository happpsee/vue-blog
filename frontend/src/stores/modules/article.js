/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-13 21:04:06
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-13 21:27:05
 * @FilePath: \blog\frontend\src\stores\modules\article.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// //缓存算法，缓存最近看的5篇文章


import { ref, inject, shallowRef } from "vue";
import { defineStore } from "pinia";

export const useArticleStore = defineStore('article', () => {
  //articles
  const articles = ref([]);
  const nextPage = ref(1);
  const finished = ref(false);
  const loading = ref(false);
  const {useApi} = inject('api');
  const refreshing = ref(false);

  const resetArticles = () => {
    nextPage.value = 1;
    finished.value = false;
    loading.value = false;
    articles.value.length = 0;
  };

 //默认请求
  const defaultGetArticle = (data) => {
    return  useApi('articles', data);
  };

  //搜索请求
  const searchArticle = (data) => {
    return useApi("articleSearch", data);
  };

  const getArticels = async (query = {}, {
    reset = false,
    search = false, 
    refresh = false,
  } = {}) => {
    //说明已经加载完毕了
    let requestFn = defaultGetArticle;
    if (search) {
      resetArticles();
      requestFn = searchArticle;
    }

    if (reset || refresh) {
      resetArticles();
    }
    if (finished.value) {
      return;
    }

    if (!refreshing.value) {
      loading.value = true;
    } else {
      refreshing.value = true;
    }

console.log(query, "query");
    const data = {
      curPages: nextPage.value,
      ...query
    };

    const ans = await requestFn(data);


    if (!search) {
        articles.value = articles.value.concat(ans.data);
    } else {
      articles.value = ans.data;
    }
  
    console.log(articles.value, 'articles.value访问后的结果');

    let curPages = ans.display.findIndex((item) => {
      return item > nextPage.value;
    });


    if (curPages > -1) {
      nextPage.value = ans.display[curPages];   
    } else {
      //表示所有的数据都被查找完毕了,通知子组件,数据加载完毕
      finished.value = true;
    }
    if (!refreshing.value) {
      loading.value = false;
    } else {
      refreshing.value = false;
    }
  };

  const refreshArticle = async () => {
    await getArticels({}, {refresh: true});
  };



  return {
    articles,
    finished,
    loading,
    getArticels,
    refreshing,
    refreshArticle
  }
});
