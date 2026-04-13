export default {
  path: "/chat",
  name: "chat",
  component: () => import("@/views/Chat/index.jsx"),
  meta: {
    needAuth: true,
  },
  __tag: "pc",
};