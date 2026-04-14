export default [
  {
    path: "/",
    name: "home",
    components: {
      default: () => import("@/views/Article/Article.vue")
    },
    __tag: "pc",
  },
  {
    path: "/articleDetail/:id",
    name: "articleDetail",
    component: () => import("@/views/Article/Detail/ArticleDetail.vue"),
    __tag: "pc",
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("@/views/Chat/index.jsx"),
    meta: {
      needAuth: true,
    },
    __tag: "pc",
  },
  {
    path: "/classify",
    name: "classify",
    component: () => import("@/views/Classify/index.vue"),
    meta: {
      needAuth: true,
    },
    __tag: "pc",
  },
  {
    path: "/write",
    name: "editor",
    component: () => import("@/views/Editor/Editor.vue"),
    meta: {
      needAuth: true,
    },
    __tag: "pc",
  },

  {
    path: "/userinfo",
    name: "userinfo",
    component: () => import("@/views/UserInfo/index.vue"),
    meta: {
      needAuth: true,
    },
    __tag: "pc",
  },
]

