import { defineComponent, inject, ref, watch, computed } from "vue";
import classifyClass from "./classify.module.styl";
import DelayComp from "@/mviews/mcomponents/Delay.jsx";
import { useArticleStore } from "@/stores/modules/article";
import articleClass from "@/mviews/Article/styls/article.module.styl";
import { useRouter } from "vue-router";


const cacheData = {};

export default defineComponent({setup() {

  const classies = ref({});
  const {useApi} = inject("api");
  const curClassify = ref(null);
  const classifyData = ref([]);
  const articleStore = useArticleStore();
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
  const loadClassify = async () => {
    let { data } = await useApi("column");
    classies.value = data;
    curClassify.value = data[0]?.id || null;
    return data;
  }

  watch(() => curClassify.value, async (column, oldVal) => {
    let ans = cacheData[column];
    if (!ans) {
      const { data } = await useApi("articles", {column});
      ans = data;
      cacheData[column] = ans;
      console.log(ans, "classifyData.value", column);
    }
    classifyData.value = ans;
  });



  return () => (
    <div class={classifyClass.classifyWrap}>
      {      <DelayComp loadFnc={loadClassify} >
        {{
          default: (result) => (
            <div class={classifyClass.classifyTabs}>

              { classies.value.length > 0 ? <van-tabs v-model:active={curClassify.value} swipe-threshold={5}>
                {result.map(item => 
                  (<van-tab title={item.name} key={item.id} name={item.id}></van-tab>)
                )}
              </van-tabs> : null }

              { (+classifyData.value.length) > 0 ? classifyData.value.map(article => (
                <div
                  class={articleClass.articleItem}
                  onClick={() => navToDetail(article)}
                  key={article.id}>
                  <div class={articleClass.content}>
                    <div class={articleClass.right}>
                      <van-text-ellipsis class={articleClass.title} rows="1" content={article.title} />
                      <van-text-ellipsis class={articleClass.summary} rows="2" content={article.summary} />
                    </div>
                    <van-image class={articleClass.cover} src={article.cover} fit="cover"></van-image>
                  </div>
                  <van-divider class={articleClass.divider} dashed>
                    {article.date}
                  </van-divider>
                </div>
              )): (<van-empty description="暂无更多文章数据， 快去写一篇吧" />)}
            </div>

          )
        }}
      </DelayComp>}
    </div>
  );
}});