/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-02 18:21:31
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-06 20:23:38
 * @FilePath: \徐晨冰_Vue_20260302\第二十一天\blog\vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'


import { fileURLToPath} from 'node:url'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite';



const dirname = path.resolve(fileURLToPath(import.meta.url), '../');


export default defineConfig({
  root: dirname,
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    } 
  },
  css: {
    preprocessorOptions: {
      stylus: {
        paths: [path.resolve(dirname, './src')]
      }
    }
  },
  plugins: [
    vue(),
    tailwindcss()
    
  ],
})
