<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-09 20:33:56
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-12 22:24:33
 * @FilePath: \blog\frontend\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<script>
import {h} from 'vue';
import Layout from '@/views/Base/Layout.vue';

export default {
  name: 'App',
  render: () => {
    return h('div', {id: 'app'}, [
      h(Layout)
    ])
  }
}
</script>

<style scoped lang="stylus">
@import "styles/variable.styl"
#app {
  width 100%
  height 100%
  background #f4f6f9;
}
</style>


