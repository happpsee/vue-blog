import ArticleDetail from "@/views/Article/Detail/ArticleDetail.vue";
import ArticleSearch from "@/mviews/Article/Search.jsx";
import ArticleDetailMobile from "@/mviews/Article/Detail.jsx";
export default [
  {
    path: "/articleDetail/:id",
    name: "articleDetail",
    component: ArticleDetail,
    __tag: "pc",
  },
  {
    path: "/articleDetail/:id",
    name: "mArticleDetail",
    meta: {
      head: "Back",
      backTitle: "文章详情",
    },
    component: ArticleDetailMobile,
    __tag: "mobile",
  },
  {
    path: "/articleSearch",
    name: "articleSearch",
    component: ArticleSearch,
    __tag: "mobile",
  }
]