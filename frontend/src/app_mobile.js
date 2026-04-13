import { setupVant } from "@/plugins/vant";
import 'vant/lib/index.css';


export const setupMobileApp = (app) => {
  document.documentElement.style = "font-size: calc(100vw / 10)";
  app.use(setupVant);
}