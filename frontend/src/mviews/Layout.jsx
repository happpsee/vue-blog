import { defineComponent } from "vue";
import layoutClass from "./layout.module.styl";
import Footer from "@/mviews/Base/Footer.jsx";
import Home from "@/mviews/Base/Home.jsx";
import { inject } from "vue";
import { setupVant } from "@/plugins/vant.js";
import "vant/lib/index.css";
import { showFailToast } from "vant";

export default defineComponent(() => {
  const setupComp = inject("setupComp");

  const {setMessage} = inject("messageAdapter");
  setMessage(showFailToast);
  
  setupComp((app) => {
    document.documentElement.style = "font-size: calc(100vw / 10)";
    setupVant(app);
  });

  return () => (
    <div class={layoutClass.mobileLayout}>
      <Home />
      <Footer />
    </div>
  )
})
