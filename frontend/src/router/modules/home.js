import Article from "@/views/Article/Article.vue";
import ArticleMobile from "@/mviews/Article/article.jsx";

export default [
  {
    path: "/",
    name: "home",
    components: {
      default: Article
    },
    __tag: "pc",
  },
  {
    path: "/",
    name: "mHome",
    __tag: "mobile",
    components: {
      default: ArticleMobile
    }
  },
  {
    path: "/login",
    name: "mLogin",
    meta:{
      head: "Back",
      footer: "Blank",
      backTitle: "登录/注册"
    },
    __tag: "mobile",
    component: () => import("@/mviews/Base/Login.jsx")
  }
]