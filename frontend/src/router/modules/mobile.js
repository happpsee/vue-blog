export default [
  {
    path: "/articleDetail/:id",
    name: "mArticleDetail",
    meta: {
      head: "Back",
      backTitle: "文章详情",
    },
    component: () => import("@/mviews/Article/Detail.jsx"),
    __tag: "mobile",
  },

  {
    path: "/articleSearch",
    name: "articleSearch",
    component: () => import("@/mviews/Article/Search.jsx"),
    __tag: "mobile",
  },
  {
    path: "/classify",
    name: "mClassify",
    __tag: "mobile",
    component: () => import("@/mviews/Classify/index.jsx"),
    meta: {
      needAuth: true,
    },
    __tag: "mobile",
  },
  {
    path: "/",
    name: "mHome",
    __tag: "mobile",
    components: {
      default: () => import("@/mviews/Article/article.jsx")
    }
  },
  {
    path: "/login",
    name: "mLogin",
    meta: {
      head: "Back",
      footer: "Blank",
      backTitle: "登录/注册"
    },
    __tag: "mobile",
    component: () => import("@/mviews/Base/Login.jsx")
  },
  {
    path: "/userinfo",
    name: "mUserInfo",
    meta: {
      head: "Blank",
      needAuth: true,
    },
    component: () => import("@/mviews/UserInfo/index.jsx"),
    __tag: "mobile",
  },
  {
    path: "/changeuser",
    name: "mChangeUser",
    meta: {
      head: "Back",
      backTitle: "修改用户信息",
      needAuth: true,
    },
    component: () => import("@/mviews/UserInfo/changeUser.jsx"),
    __tag: "mobile",
  }
];
