<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-09 20:33:56
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-22 13:30:00
 * @FilePath: \blog\frontend\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<script>
import {h, onMounted, shallowRef} from 'vue';
import { _isMobile } from '@/utils/index';

export default {
  name: 'App',
  setup: () => {

    let layout = shallowRef(h("text", "加载中..."));
    
    onMounted(async () => {
      if (!_isMobile()) {
        layout.value = (await import("./views/Base/Layout.vue")).default;
      } else {
        layout.value = (await import("./mviews/Layout.jsx")).default;
      }
    });

    return () => h('div', {id: 'app'}, h(layout.value))
  }
}
</script>

<style lang="stylus">
@import "styles/variable.styl"
@import "styles/base.css"

#app {
  width 100%
  min-height 100vh
  background bg_color
  overflow-x hidden
  overflow hidden
  font-family font_family
  color text_color
}
</style>
