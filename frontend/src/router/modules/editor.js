export default [
  {
    path: "/write",
    name: "editor",
    component: () => import("@/views/Editor/Editor.vue"),
    meta: {
      needAuth: true,
    },
    __tag: "pc",
  }
]