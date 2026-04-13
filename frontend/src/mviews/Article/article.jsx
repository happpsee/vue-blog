import { defineComponent, onMounted } from "vue";
import articleClass from "./styls/article.module.styl";
import { useArticleStore } from "@/stores/modules/article";
import { storeToRefs} from "pinia";
import { useRouter } from "vue-router";





export default defineComponent({
  setup() {
    const articleStore = useArticleStore();
    const getArticels = articleStore.getArticels;
    const refreshArticle = articleStore.refreshArticle;
    const { articles, finished, loading, refreshing}  = storeToRefs(articleStore);  

  //用于给子组件做无限加载填充数据
  const loadMore = async () => {
    if (refreshing.value) {
      return ;
    }
    await getArticels();
  };

  const router = useRouter();
  const navToDetail = (article) => {
    console.log(article, "article");
    router.push({
      name: "mArticleDetail",
      params: {
        id: article.id
      }
    })
  }
  
  onMounted(async () => {
    if (refreshing.value) {
      return ;
    }
    refreshArticle();
  });
  
    return () => (
     <van-pull-refresh
      class={articleClass.articleList} 
     v-model={refreshing.value}
     onRefresh={refreshArticle}>
      <van-list
      v-model:loading={loading.value}
      finished={finished.value}
      finished-text="没有更多了~~"
      onLoad={loadMore}>
        {
        articles.value.map(article => (
          <div 
          class={articleClass.articleItem}
          onClick={() => navToDetail(article)}
          key={article.id}> 
            <div class={articleClass.content}>
              <div class={articleClass.right}>
              <van-text-ellipsis class={articleClass.title} rows="1" content={article.title}/>
              <van-text-ellipsis class={articleClass.summary} rows="2" content={article.summary}/>
               </div>
             <van-image class={articleClass.cover}  src={article.cover} fit="cover"></van-image>
            </div>
            <van-divider  class={articleClass.divider} dashed>
              {article.date}
            </van-divider>
          </div>
        ))
        }
      </van-list> 
        </van-pull-refresh>
    )
  }
});