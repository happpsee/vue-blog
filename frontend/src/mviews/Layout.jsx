import { defineComponent } from "vue";
import layoutClass from "./layout.module.styl";
import Footer from "@/mviews/Base/Footer.jsx";
import Home from "@/mviews/Base/Home.jsx";


export default defineComponent(() => {
  return () => (
    <div class={layoutClass.mobileLayout}>
      <Home />
      <Footer />
    </div>
  )
})
