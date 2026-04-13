import { defineComponent } from "vue";
import Header from "@/mviews/Base/Header.jsx";
import homeClass from "./styls/home.module.styl";
export default defineComponent(() => {
  return () => (
    <div class={homeClass.home}>
      <Header />
      <div class={homeClass.mainLayout}>
          <router-view />
      </div>
    </div>
  )
}); 