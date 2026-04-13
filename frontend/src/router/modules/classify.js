import classifyPc from "@/views/Classify/index.vue"
import classifyMobile from "@/mviews/Classify/index.jsx"

export default [
  {
  path: "/classify",
  name: "classify",
  component: classifyPc,
  meta: {
    needAuth: true,
  },
  __tag: "pc",
  },
  {
    path: "/classify",
    name: "mClassify",
    __tag: "mobile",
    component: classifyMobile,
    meta: {
      needAuth: true,
    },
    __tag: "mobile",
  }

]