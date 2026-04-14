import { defineComponent, computed } from "vue";
import articleClass from "./styls/article.module.styl";
import { useArticleStore } from "@/stores/modules/article";
import { useRouter } from "vue-router";

export default defineComponent({setup() {
  const articleStore = useArticleStore();
  const articles = computed(() => articleStore.articles);
  
  return () => (<div  class={articleClass.articleList} >
    {  articles.value.length <= 0 ?  <van-empty  description="暂无更多列表数据" /> : <van-list
        finished-text="没有更多了~~">
          {
          articles.value.map(article => (
            <div 
            class={articleClass.articleItem}
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
        </van-list> } </div>);
}});