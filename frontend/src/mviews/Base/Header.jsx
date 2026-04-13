import { defineComponent, ref, onBeforeUnmount, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import headClass from "./styls/head.module.styl";
import { useArticleStore } from "@/stores/modules/article";
import store from "store";



const SearchComp = defineComponent({setup() {
  const articleStore = useArticleStore();
  const router = useRouter();
  const route = useRoute();
  const input = ref("");
    const search = async () => {
      await articleStore.getArticels({ search: input.value }, {
      reset: true,
      search: true
    });
    store.set(import.meta.env.VITE_SEARCH_KEY, { text: input.value, time: Date.now() });
    router.push({name: "articleSearch"});
    }

    onMounted(async () => {
      await router.isReady();
      if (route.name !== "articleSearch") {
        return false;
      }

      const historySearch =  store.get(import.meta.env.VITE_SEARCH_KEY);
      if (historySearch && !!historySearch.text) {
        //半小时
        if (Date.now() - historySearch.time <= 1000 * 60 * 30) {
          input.value = historySearch.text;
        }
        await search();
      }
    });


    return () => (<van-search
        v-model={input.value}
        placeholder="请输入搜索关键词"
        show-action
        onSearch={search}>
         {{action: () => <div onClick={search}>搜索</div>}}
        </van-search>);
}});

const BackComp = defineComponent({setup() {
  const router = useRouter();
  const route = useRoute();

   const onBack = () => {
    router.back();
  };
  const goHome = () => {
    router.push({name: "mHome"});
    console.log("goHome");
  };

  return () => (<div class={headClass.backWrap}>
<div class={headClass.arrowWrap} onClick={onBack}>
      <i class={headClass.iconArrowLeft}></i>
      <span class={headClass.backText}>返回</span>
    </div>
    <p class={headClass.backTitle}>{route.meta.backTitle}</p>
    <div class={headClass.logoWrap} onClick={goHome}>
      <i class={headClass.iconLogo}></i>
    </div>
    </div>);
}});

const headCompMap = {
  "Back": BackComp,
  "Search": SearchComp,
  "Blank": null,
};


const getHeadComp = (type) => {
  if (!(type && (type in headCompMap))) {
    return SearchComp;
  }
  return headCompMap[type];
};

export default defineComponent({
  setup() {
    const route = useRoute();
    const type = computed(() => {
      return route.meta.head;
    });

    return () => {
      const Comp = getHeadComp(type.value) ?? null;
      return (<div class={headClass.header}>
        <Comp/>
        <van-divider hairline={false} style={["--van-divider-margin: 0PX", "--van-divider-border-color: #E5E7EB"]}/>
      </div>)};
  }
});