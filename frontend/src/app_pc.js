import { setupElement } from '@/plugins/element';
import 'element-plus/dist/index.css'
import '@/styles/element.css';
import '@/styles/tailwind.css';
import '@/styles/base.css';
import "animate.css";


export const setupPcApp = (app) => {
  app.use(setupElement);
}