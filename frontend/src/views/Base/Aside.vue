<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-10 15:40:48
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-14 14:22:01
 * @FilePath: \blog\frontend\src\views\Base\Aside.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-card class="aside">
      <el-avatar :size="110"
        :src="userInfo?.avatar ?? 'https://ts1.tc.mm.bing.net/th/id/OIP-C.krr9xL5BPcI8y3YCBNW5pwHaHa?w=180&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'">
      </el-avatar>
      <p class="nickname text-2xl">
        {{ userInfo?.nikename ?? `用户${Date.now()}` }}
      </p>

      <div class="flex gap-x-6 mb-6">
        <div class="flex flex-col gap-y-2 justify-content text-center">
          <span class="flex flex-2 gap-x-2">
            <el-icon custom="article.svg"></el-icon>
            <el-text>文章</el-text>
          </span>
          <span>{{ userInfo?.articleNum ?? 0 }}</span>
        </div>

        <div class="flex flex-col gap-y-2 justify-center text-center">
          <span class="flex flex-2 gap-x-2">
            <el-icon custom="reader.svg"></el-icon>
            <el-text>读者</el-text>
          </span>
          <span >{{ userInfo?.readerNum ?? 0 }}</span>
        </div>
      </div>

      <p class="pl-4 pr-4 overflow-hidden line-clamp-15 text-ellipsis max-h-90 cursor-pointer">
        {{ userInfo?.description ?? "这个人很懒，什么都没有写" }}
      </p>
  </el-card>
</template>


<script setup>
import { useLoginStore } from '@/stores/modules/login';
import {toRef} from 'vue';
defineOptions({
  name: "BaseAside"
});

const loginStore = useLoginStore();

const userInfo = toRef(() => loginStore.userInfo);
</script>


<style lang="stylus" scoped>
@import "styles/variable.styl";

:deep(.el-card__body)
  bgColorCommon()
  display flex
  flex-direction column
  align-items center
  row-gap 20px
  padding 20px 10px

</style>