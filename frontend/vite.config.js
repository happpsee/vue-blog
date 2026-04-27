/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-02 18:21:31
 * @LastEditors: userName userEmail
 * @LastEditTime: 2026-04-27 13:39:10
 * @FilePath: \徐晨冰_Vue_20260302\第二十一天\blog\vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import { fileURLToPath} from 'node:url'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import visualizer from 'rollup-plugin-visualizer'
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import {ElementPlusResolver} from "unplugin-vue-components/resolvers"
// import compression from 'vite-plugin-compression'

const dirname = path.resolve(fileURLToPath(import.meta.url), '../');


export default defineConfig({
  base: './',
  root: dirname,
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    } 
  },
  build: {
        modulePreload: false,  
    rollupOptions: {
      output: {

        manualChunks(id) {
          // console.log(id.includes("views"), id.includes("mviews"), id.includes("element-plus"), id.includes("vant"), "mview");
          if (id.includes("views")) {
            return "pc";
          }
          if (id.includes("mviews")) {
            console.log(id, "mview");
            return "mobile"
          }
          if (id.includes("element-plus")) {
            return "element-plus";
          }
          if (id.includes("vant")) {
            return "vant"
          }
        },
        paths: {
          "@wangeditor/editor-for-vue": "https://esm.sh/@wangeditor/editor-for-vue@5.1.12?external=vue",
          "node-forge": "https://esm.sh/node-forge@1.3.3",
          "vue": "https://esm.sh/vue@3.5.25"
        }
      },
      external: ["node-forge", "@wangeditor/editor-for-vue", "vue"],
    }
  },
  server: {
    host: "0.0.0.0",
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      stylus: {
        paths: [path.resolve(dirname, './src')]
      }
    }
  },
  plugins: [
    AutoImport({resolvers: [ElementPlusResolver()]}),
    Components({resolvers: [ElementPlusResolver()]}),
    vue(),
    vueJsx(),
    tailwindcss(),
    // compression({
    //   algorithm: "brotliCompress"
    // }),
    visualizer({      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,}),
      {
        name: "html-inject-importmap",
        enforce: "post",
        transformIndexHtml(html) {
          return html.replace('</head>', `
            <script type="importmap">
            {
              "imports": {
              "vue": "https://esm.sh/vue@3.5.25"
              }
            }
            </script></head>`);
        }
      }
  ],
})
